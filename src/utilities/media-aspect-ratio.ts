export const MEDIA_ASPECT_RATIO_EVENT = "ring-view-media-aspect-ratio";

export interface MediaAspectRatioDetail {
  aspectRatio?: number;
}

const RATIO_EPSILON = 0.001;

export function aspectRatioFromDimensions(
  width: number,
  height: number,
): number | undefined {
  if (
    !Number.isFinite(width)
    || !Number.isFinite(height)
    || width <= 0
    || height <= 0
  ) {
    return undefined;
  }
  return width / height;
}

export function aspectRatioFromMedia(
  media: HTMLImageElement | HTMLVideoElement,
): number | undefined {
  return media instanceof HTMLVideoElement
    ? aspectRatioFromDimensions(media.videoWidth, media.videoHeight)
    : aspectRatioFromDimensions(media.naturalWidth, media.naturalHeight);
}

export function aspectRatiosMatch(
  first: number | undefined,
  second: number | undefined,
): boolean {
  if (first === undefined || second === undefined) return first === second;
  return Math.abs(first - second) <= RATIO_EPSILON * Math.max(first, second);
}

export function mediaAspectRatioEvent(
  aspectRatio?: number,
): CustomEvent<MediaAspectRatioDetail> {
  return new CustomEvent<MediaAspectRatioDetail>(MEDIA_ASPECT_RATIO_EVENT, {
    detail: { aspectRatio },
    bubbles: true,
    composed: true,
  });
}
