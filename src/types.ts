export type CameraMode = "last_recording" | "live";
export type PreviewSource = "last_recording" | "live" | "default";
export type AspectRatio = "auto" | "16:9" | "4:3" | "1:1";
export type FitMode = "cover" | "contain" | "fill";

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

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  locale?: { language: string };
  themes?: unknown;
  hassUrl(path?: string): string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
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
  name?: string;
  default_mode?: CameraMode;
  remember_last_mode?: boolean;
  autoplay_recording?: boolean;
  preview?: {
    source?: PreviewSource;
    show_name?: boolean;
    show_mode_badge?: boolean;
  };
  appearance?: {
    aspect_ratio?: AspectRatio;
    fit_mode?: FitMode;
  };
  viewer?: {
    show_controls?: boolean;
    live_muted?: boolean;
    close_on_escape?: boolean;
  };
  performance?: {
    suspend_when_hidden?: boolean;
    live_timeout_seconds?: number;
    retry_live_once?: boolean;
    debug?: boolean;
  };
  grid_options?: GridOptions;
}

export interface NormalizedConfig
  extends Required<Omit<RingViewConfig, "name" | "grid_options">> {
  name?: string;
  grid_options?: GridOptions;
  preview: Required<NonNullable<RingViewConfig["preview"]>>;
  appearance: Required<NonNullable<RingViewConfig["appearance"]>>;
  viewer: Required<NonNullable<RingViewConfig["viewer"]>>;
  performance: Required<NonNullable<RingViewConfig["performance"]>>;
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
