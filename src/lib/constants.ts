/**
 * Shared constants for the ibacks frontend.
 * Import from here to avoid duplication.
 */

export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1200&auto=format&fit=crop';

/**
 * Maps Jubelio item_category_id → human-readable category name.
 * IDs come from the Jubelio WMS API response (`item_category_id`).
 */
export const CATEGORY_NAME_MAP: Record<number, string> = {
  12642: 'Screen Protector',
  5524: 'Casing',
  12644: 'Aksesoris',
  7423: 'Kabel & Charger',
  5521: 'Audio',
  7426: 'Powerbank',
  7413: 'Earphone',
  18940: 'Teknologi',
  7410: 'Gaming',
  12649: 'Lainnya',
};
