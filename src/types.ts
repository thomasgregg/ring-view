export type CameraMode = "last_recording" | "live";
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

export interface HomeAssistant {
  states: Record<string, HassEntity>;
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
  name?: string;
  default_mode?: CameraMode;
  live_muted?: boolean;
  show_name?: boolean;
  aspect_ratio?: AspectRatio;
  fit_mode?: FitMode;
  grid_options?: GridOptions;
}

export interface NormalizedConfig extends Required<
  Omit<RingViewConfig, "name" | "grid_options">
> {
  name?: string;
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
