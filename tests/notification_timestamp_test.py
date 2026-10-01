"""Execute the actual blueprint wait template; requires Jinja2 and PyYAML."""
import unittest
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace
import jinja2
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
        self.assertEqual(actions[0]['data']['actions'][0]['title'], 'View Live')
        self.assertIn('wait_template', actions[1])
        self.assertFalse(any('delay' in action for action in actions))

if __name__ == '__main__': unittest.main()
