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
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  connection?: {
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => void>;
  };
  language?: string;
  locale?: { language: string };
  themes?: unknown;
  hassUrl(path?: string): string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  localize?(key: string, values?: Record<string, unknown>): string;
  formatEntityName?(stateObj: HassEntity, name?: string): string;
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
  name?: string;
  default_mode?: CameraMode;
  remember_last_mode?: boolean;
  autoplay_recording?: boolean;
  live_muted?: boolean;
  two_way_audio?: boolean;
  doorbell_entity?: string;
  show_name?: boolean;
  preview_source?: PreviewSource;
  preview_fallback?: PreviewFallback;
  aspect_ratio?: AspectRatio;
  fit_mode?: FitMode;
  grid_options?: GridOptions;
}

export interface NormalizedConfig extends Required<
  Omit<
    RingViewConfig,
    "name" | "grid_options" | "doorbell_entity" | "snapshot_entity"
  >
> {
  name?: string;
  doorbell_entity?: string;
  snapshot_entity?: string;
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
