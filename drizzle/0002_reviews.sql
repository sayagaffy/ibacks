CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  jubelio_item_id INTEGER NOT NULL,
  channel_id INTEGER NOT NULL DEFAULT 64,
  channel_item_id VARCHAR(64) NOT NULL,
  source_review_id VARCHAR(64),
  rating SMALLINT NOT NULL,
  review_text TEXT,
  reviewer_name VARCHAR(120),
  review_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_reviews_source_uniq
  ON product_reviews (channel_id, channel_item_id, source_review_id);

CREATE INDEX IF NOT EXISTS product_reviews_jubelio_idx
  ON product_reviews (jubelio_item_id);
