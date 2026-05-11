import {
  integer,
  numeric,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

const point = customType<{ data: string }>({
  dataType: () => "geometry(Point,4326)",
});

const polygon = customType<{ data: string }>({
  dataType: () => "geometry(Polygon,4326)",
});

export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 120 }).notNull(),
  geo: point("geo").notNull(),
  serviceRadiusKm: numeric("service_radius_km", { precision: 6, scale: 2 })
    .notNull()
    .default("0"),
  openingHours: text("opening_hours"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const serviceAreas = pgTable("service_areas", {
  id: serial("id").primaryKey(),
  warehouseId: integer("warehouse_id")
    .notNull()
    .references(() => warehouses.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 160 }).notNull(),
  polygon: polygon("polygon").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productReviews = pgTable(
  "product_reviews",
  {
    id: serial("id").primaryKey(),
    jubelioItemId: integer("jubelio_item_id").notNull(),
    channelId: integer("channel_id").notNull().default(64),
    channelItemId: varchar("channel_item_id", { length: 64 }).notNull(),
    sourceReviewId: varchar("source_review_id", { length: 64 }),
    rating: smallint("rating").notNull(),
    reviewText: text("review_text"),
    reviewerName: varchar("reviewer_name", { length: 120 }),
    reviewCreatedAt: timestamp("review_created_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    reviewUniq: uniqueIndex("product_reviews_source_uniq").on(
      table.channelId,
      table.channelItemId,
      table.sourceReviewId,
    ),
  }),
);

export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;
export type ServiceArea = typeof serviceAreas.$inferSelect;
export type NewServiceArea = typeof serviceAreas.$inferInsert;
export type ProductReview = typeof productReviews.$inferSelect;
export type NewProductReview = typeof productReviews.$inferInsert;
