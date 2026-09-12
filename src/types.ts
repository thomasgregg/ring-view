export type CameraMode = "last_recording" | "live";
export type PreviewSource =
  | "last_recording"
  | "live"
  | "default"
  | "snapshot"
  | "newest";
export type PreviewFallback = "last_recording" | "snapshot";
export type AspectRatio = "auto" | "16:9" | "4:3" | "1:1";
export type FitMode = "cover" | "contain";
export type DoorAction = "unlock" | "open";
export type DoorControlVisibility = "live_only" | "all_views";
export type DoorControlLocation = "viewer_only" | "dashboard_and_viewer";
export type DashboardBehavior = "open_viewer" | "interactive";
export type DashboardStart = "on_demand" | "last_recording" | "live";

export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed?: string;
  last_updated?: string;
  attributes: {
    friendly_name?: string;
    entity_picture?: string;
    access_token?: string;
    supported_features?: number;
    video_url?: string;
    [key: string]: unknown;
  };
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  platform?: string;
  device_id?: string | null;
  disabled_by?: string | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  config?: {
    time_zone?: string;
  };
  connection?: {
    readonly connected?: boolean;
    addEventListener?(event: "disconnected" | "ready", callback: () => void): void;
    removeEventListener?(event: "disconnected" | "ready", callback: () => void): void;
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
      options?: { resubscribe?: boolean; preCheck?: () => boolean },
    ): Promise<() => void | Promise<void>>;
  };
  language?: string;
  locale?: { language: string };
  themes?: unknown;
  hassUrl(path?: string): string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  localize?(key: string, values?: Record<string, unknown>): string;
  formatEntityName?(stateObj: HassEntity, name?: string): string;
  callService?(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<unknown>;
}

export interface GridOptions {
  columns?: number | "full";
  rows?: number;
  min_columns?: number;
  min_rows?: number;
  max_columns?: number;
  max_rows?: number;
}

export interface RingViewConfig {
  type?: string;
  recording_entity: string;
  live_entity: string;
  snapshot_entity?: string;
  last_activity_entity?: string;
  name?: string;
  default_mode?: CameraMode;
  remember_last_mode?: boolean;
  autoplay_recording?: boolean;
  live_muted?: boolean;
  two_way_audio?: boolean;
  doorbell_entity?: string;
  door_entity?: string;
  door_contact_entity?: string;
  door_action?: DoorAction;
  door_control_visibility?: DoorControlVisibility;
  door_control_location?: DoorControlLocation;
  door_hold_to_activate?: boolean;
  dashboard_behavior?: DashboardBehavior;
  dashboard_start?: DashboardStart;
  dashboard_live_muted?: boolean;
  show_name?: boolean;
  preview_source?: PreviewSource;
  preview_fallback?: PreviewFallback;
  show_snapshot_button?: boolean;
  snapshot_directory?: string;
  aspect_ratio?: AspectRatio;
  fit_mode?: FitMode;
  grid_options?: GridOptions;
}

export interface NormalizedConfig extends Required<
  Omit<
    RingViewConfig,
    | "name"
    | "grid_options"
    | "doorbell_entity"
    | "door_entity"
    | "door_contact_entity"
    | "snapshot_entity"
    | "last_activity_entity"
  >
> {
  name?: string;
  doorbell_entity?: string;
  door_entity?: string;
  door_contact_entity?: string;
  snapshot_entity?: string;
  last_activity_entity?: string;
  grid_options?: GridOptions;
}

export interface ConfigFormSchema {
  name: string;
  type?: "grid" | "expandable";
  title?: string;
  flatten?: boolean;
  required?: boolean;
  column_min_width?: string;
  iconPath?: string;
  schema?: ConfigFormSchema[];
  selector?: Record<string, unknown>;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
    loadCardHelpers?: () => Promise<{
      importMoreInfoControl?: (domain: string) => Promise<unknown> | void;
    }>;
  }
}
