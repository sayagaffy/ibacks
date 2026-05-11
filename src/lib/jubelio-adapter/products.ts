import { jubelio } from "./client";

export interface JubelioProductVariant {
  item_id?: number;
  item_name?: string;
  item_code?: string;
  sell_price?: string | number;
  thumbnail?: string | null;
  available_qty?: string | number | null;
  end_qty?: string | number | null;
}

export interface JubelioInventoryProduct {
  item_group_id?: number;
  item_name?: string;
  sell_price?: string | number;
  thumbnail?: string | null;
  item_category_id?: number | null;
  available_qty?: string | number | null;
  end_qty?: string | number | null;
  variants?: JubelioProductVariant[];
}

export interface JubelioPromotionDetail {
  item_id?: number;
  promotion_price?: string | number;
}

export interface JubelioPromotion {
  start_date?: string;
  end_date?: string;
  details?: JubelioPromotionDetail[];
}

export interface JubelioProductSku {
  item_id?: number | string;
  item_code?: string | number;
  thumbnail?: string | null;
  available_qty?: string | number | null;
  end_qty?: string | number | null;
  variation_values?: Record<string, unknown>[];
  images?: Record<string, unknown>[];
}

export interface JubelioInventoryItemsResponse {
  data: JubelioInventoryProduct[];
  totalCount: number;
}

export interface JubelioPromotionsResponse {
  data: JubelioPromotion[];
}

export interface JubelioInventoryItemGroupResponse {
  product_skus?: JubelioProductSku[];
  thumbnail?: string | null;
  image?: string | null;
}

export interface JubelioInventoryItemDescriptionResponse {
  description?: string;
}

export function getInventoryItems(): Promise<JubelioInventoryItemsResponse> {
  return jubelio.get<JubelioInventoryItemsResponse>("/inventory/items/");
}

export function getInventoryPromotions(): Promise<JubelioPromotionsResponse> {
  return jubelio.get<JubelioPromotionsResponse>(
    "/inventory/promotions/?page=1&pageSize=50",
  );
}

export function getInventoryItemGroup(
  itemGroupId: number,
): Promise<JubelioInventoryItemGroupResponse> {
  return jubelio.get<JubelioInventoryItemGroupResponse>(
    `/inventory/items/group/${itemGroupId}`,
  );
}

export function getInventoryItemDescription(
  itemId: number,
): Promise<JubelioInventoryItemDescriptionResponse> {
  return jubelio.get<JubelioInventoryItemDescriptionResponse>(
    `/inventory/items/${itemId}`,
  );
}
