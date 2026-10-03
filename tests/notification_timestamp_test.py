"""Execute the actual blueprint wait template; requires Jinja2 and PyYAML."""
import unittest
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace
import jinja2
from jinja2.nativetypes import NativeEnvironment
import yaml

class BlueprintLoader(yaml.SafeLoader):
    pass
BlueprintLoader.add_constructor('!input', lambda loader, node: loader.construct_scalar(node))
BLUEPRINT = yaml.load((Path(__file__).parents[1] / 'blueprints/automation/ring_view/doorbell_notification.yaml').read_text(), Loader=BlueprintLoader)
WAIT = next(action['wait_template'] for action in BLUEPRINT['actions'] if 'wait_template' in action)

def timestamp(value, default=None):
    try:
        return float(value)
    except (ValueError, TypeError):
        try:
            return datetime.fromisoformat(value.replace('Z', '+00:00')).timestamp()
        except (ValueError, TypeError, AttributeError):
            return default

class States:
    def __init__(self, age, event_id):
        self.age = age
        self.preview = SimpleNamespace(attributes={'last_video_id': event_id}, last_updated='2026-10-01T12:00:00Z')
    def __getitem__(self, key):
        return self.preview
    def __call__(self, key):
        return self.age

class RecordingFreshnessTests(unittest.TestCase):
    def render(self, age, event_id='new', sensor='sensor.age'):
        now = datetime(2026, 10, 1, 12, 0, 10, tzinfo=timezone.utc)
        return jinja2.Environment().from_string(WAIT).render(
            states=States(age, event_id), preview_camera_id='camera.recording',
            preview_kind='recording', preview_marker_before='old',
            recording_timestamp_id=sensor, doorbell_pressed_at=now.timestamp()-10,
            as_timestamp=timestamp, now=lambda: now,
        ).strip() == 'True'
    def test_recent_recording_passes_without_extra_wait(self):
        self.assertTrue(self.render('2026-10-01T12:00:00Z'))
        self.assertTrue(self.render('2026-10-01T11:59:55Z'))
    def test_old_future_invalid_and_unchanged_recordings_do_not_pass(self):
        for age in ['2026-10-01T11:59:54Z', '2026-10-01T12:00:16Z', 'unavailable', 'unknown']:
            with self.subTest(age=age): self.assertFalse(self.render(age))
        self.assertFalse(self.render('2026-10-01T12:00:00Z', event_id='old'))
    def test_optional_sensor_keeps_previous_behavior(self):
        self.assertTrue(self.render('unavailable', sensor=''))
        self.assertFalse(self.render('unavailable', event_id='old', sensor=''))
    def test_immediate_notification_precedes_wait_and_no_delay_is_added(self):
        actions = BLUEPRINT['actions']
        self.assertEqual(actions[0]['alias'], 'Notify immediately')
        self.assertEqual(actions[0]['data']['actions'][0]['title'], '{{ live_action_title }}')
        self.assertIn('wait_template', actions[1])
        self.assertFalse(any('delay' in action for action in actions))

class NotificationDeliveryTests(unittest.TestCase):
    def context(self, language='en', kind='recording', doorbell='event.front', name=''):
        env = NativeEnvironment(undefined=jinja2.StrictUndefined)
        context = dict(notification_language_value=language,
                       doorbell_name_value=name, doorbell_entity_id=doorbell,
                       preview_kind=kind, preview_camera_id='camera.front',
                       live_view_url='/entrance?mode=live',
                       recording_view_url='/entrance?mode=last_recording',
                       now=lambda: datetime(2026, 10, 3, tzinfo=timezone.utc))
        for key in ['notification_tag', 'notification_title', 'live_message',
                    'live_action_title', 'recording_action_title']:
            context[key] = env.from_string(BLUEPRINT['variables'][key]).render(context).strip()
        prep = next(a['variables'] for a in BLUEPRINT['actions']
                    if a.get('alias') == 'Prepare fresh preview notification')
        for key, value in prep.items():
            result = env.from_string(value).render(context)
            context[key] = result.strip() if isinstance(result, str) else result
        return env, context

    def test_both_languages_cover_titles_messages_and_buttons(self):
        expected = {
            'en': ('Someone is at the door', 'Tap to view Live', 'View Live',
                   'Watch Recording', 'Recording ready', 'New image available'),
            'de': ('Jemand ist an der Tür', 'Tippe, um die Live-Ansicht zu öffnen',
                   'Live ansehen', 'Aufnahme ansehen', 'Aufnahme verfügbar',
                   'Neues Bild verfügbar'),
        }
        for language, texts in expected.items():
            with self.subTest(language=language):
                _, context = self.context(language)
                for key, expected_text in zip(['notification_title', 'live_message',
                        'live_action_title', 'recording_action_title', 'preview_message'], texts):
                    self.assertEqual(context[key], expected_text)
                for kind in ['snapshot', 'camera']:
                    _, context = self.context(language, kind)
                    self.assertEqual(context['preview_message'], texts[-1])

    def test_only_verified_recordings_get_recording_action(self):
        template = BLUEPRINT['actions'][-1]['data']['actions']
        for language in ['en', 'de']:
            for kind in ['recording', 'snapshot', 'camera']:
                with self.subTest(language=language, kind=kind):
                    env, context = self.context(language, kind)
                    actions = env.from_string(template).render(context)
                    self.assertIsInstance(actions, list)
                    self.assertEqual(len(actions), 2 if kind == 'recording' else 1)
                    self.assertEqual(actions[0]['uri'], context['live_view_url'])
                    if kind == 'recording':
                        self.assertEqual(actions[1]['uri'], context['recording_view_url'])
                        self.assertEqual(actions[1]['title'], context['recording_action_title'])

    def test_notification_tap_stays_live_and_tags_match_between_stages(self):
        for action in [BLUEPRINT['actions'][0], BLUEPRINT['actions'][-1]]:
            self.assertEqual(action['data']['url'], '{{ live_view_url }}')
            self.assertEqual(action['data']['clickAction'], '{{ live_view_url }}')
            self.assertEqual(action['data']['tag'], '{{ notification_tag }}')
        _, front = self.context(doorbell='event.front')
        _, back = self.context(doorbell='binary_sensor.back_ding')
        self.assertNotEqual(front['notification_tag'], back['notification_tag'])
        _, renamed = self.context(doorbell='event.front', name=' Haustür ')
        self.assertEqual(front['notification_tag'], renamed['notification_tag'])
        self.assertEqual(renamed['notification_title'], 'Someone is at the door · Haustür')
        _, german = self.context('de', name='Haustür')
        self.assertEqual(german['notification_title'], 'Jemand ist an der Tür · Haustür')

    def test_public_image_url_is_selected_only_after_successful_save(self):
        # Continue on error belongs to the enclosing sequence, so a failed
        # snapshot aborts that sequence before the public URL assignment.
        action = next(a for a in BLUEPRINT['actions']
                      if a.get('alias') == 'Prepare the optional public notification image')
        self.assertTrue(action['continue_on_error'])
        save, select_url = action['then']
        self.assertEqual(save['action'], 'camera.snapshot')
        self.assertNotIn('continue_on_error', save)
        env, context = self.context()
        self.assertTrue(context['notification_image_url'].startswith('/api/camera_proxy/'))
        context.update(notification_image_base_url_value=' https://example.com/ ',
                       notification_image_file_key='camera-front')
        public_url = env.from_string(select_url['variables']['notification_image_url']).render(context)
        self.assertTrue(public_url.startswith('https://example.com/local/ring-view-camera-front.jpg?v='))
        self.assertEqual(BLUEPRINT['actions'][-1]['data']['image'], '{{ notification_image_url }}')

    def test_new_inputs_have_compatible_defaults(self):
        inputs = BLUEPRINT['blueprint']['input']['delivery']['input']
        self.assertEqual(inputs['notification_language']['default'], 'en')
        self.assertEqual(inputs['doorbell_name']['default'], '')

if __name__ == '__main__': unittest.main()
