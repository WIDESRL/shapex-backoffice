export const BANNER_SIZES = [
  { value: 'Great', translationKey: 'banners.sizeGreat' },
  { value: 'Medium', translationKey: 'banners.sizeMedium' },
  { value: 'Small', translationKey: 'banners.sizeSmall' },
] as const;

export type BannerSizeValue = typeof BANNER_SIZES[number]['value'];
