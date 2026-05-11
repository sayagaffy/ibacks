# Graph Report - ibacks  (2026-05-11)

## Corpus Check
- 122 files · ~28,766 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 275 nodes · 359 edges · 17 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `getProducts()` - 18 edges
2. `getCategories()` - 12 edges
3. `syncProductsFromJubelio()` - 10 edges
4. `Button()` - 9 edges
5. `getSeoFooterLinks()` - 8 edges
6. `safeText()` - 8 edges
7. `toAbsoluteUrl()` - 8 edges
8. `ProductCard()` - 7 edges
9. `syncCategoriesFromJubelio()` - 7 edges
10. `getProductDetailWithDescription()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `syncProductsFromJubelio()`  [INFERRED]
  scripts\sync-products.ts → src\lib\product-cache.ts
- `sitemap()` --calls--> `getProducts()`  [INFERRED]
  src\app\sitemap.ts → src\lib\product-cache.ts
- `GET()` --calls--> `getProducts()`  [INFERRED]
  src\app\api\categories\route.ts → src\lib\product-cache.ts
- `GET()` --calls--> `getProducts()`  [INFERRED]
  src\app\api\cron\fetch-reviews\route.ts → src\lib\product-cache.ts
- `GET()` --calls--> `getProducts()`  [INFERRED]
  src\app\api\products\route.ts → src\lib\product-cache.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (18): GET(), GET(), getInventoryItemDescription(), getInventoryItemGroup(), getInventoryItems(), getInventoryPromotions(), ensureCacheDir(), getProductDetailWithDescription() (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (15): generateMetadata(), toDisplayName(), BackLink(), CategoryPage(), generateMetadata(), resolveCategoryData(), buildCategoryPath(), isProductInStock() (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (13): sitemap(), GET(), getItemCategories(), ensureCacheDir(), getCategories(), isCategoryCacheFresh(), readCategoriesFromDisk(), syncCategoriesFromJubelio() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (6): buildPromoHeroSlides(), resolvePromoSlug(), slugifyPromo(), getPromoHero(), findSlideBySlug(), ProductCard()

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (3): handleSubmit(), validateCheckout(), Button()

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (10): getNearestWarehouse(), getWarehousesByCity(), isValidPoint(), toNumber(), GET(), fetchIpApi(), GET(), getHeaderIp() (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (9): GET(), parseLimit(), resolveItemId(), getInventoryItem(), extractShopeeChannelItemId(), getShopeeChannelItemId(), clampRating(), fetchShopeeReviews() (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.23
Nodes (7): getCategoryName(), getFilteredHistory(), splitHighlight(), HighlightedText(), HistoryIcon(), SearchIcon(), StarIcon()

### Community 8 - "Community 8"
Cohesion: 0.32
Nodes (7): buildProductSchema(), buildAggregateRatingSchema(), buildReviewSchemas(), clampRating(), normalizeUrl(), safeText(), stripHtml()

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (5): addSearchHistory(), loadSearchHistory(), saveSearchHistory(), useHeaderSearch(), SearchBar()

### Community 10 - "Community 10"
Cohesion: 0.43
Nodes (3): run(), fetchIpFallbackWarehouse(), fetchNearestWarehouse()

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (1): JubelioClient

### Community 13 - "Community 13"
Cohesion: 0.83
Nodes (3): loadEnv(), run(), upsertWarehouse()

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (2): getFavouriteItems(), GET()

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (1): CartDrawerClient()

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (2): loadEnv(), run()

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (2): getReviewsBundle(), toNumber()

## Knowledge Gaps
- **Thin community `Community 12`** (6 nodes): `JubelioClient`, `.authenticate()`, `.constructor()`, `.get()`, `.getInstance()`, `client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (4 nodes): `getFavouriteItems()`, `GET()`, `route.ts`, `favourites.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `RootLayout()`, `CartDrawerClient()`, `layout.tsx`, `CartDrawerClient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (3 nodes): `loadEnv()`, `run()`, `geo-migrate.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (3 nodes): `getReviewsBundle()`, `toNumber()`, `queries.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getProducts()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `getWarehousesByCity()` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `getCategories()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `getProducts()` (e.g. with `sitemap()` and `GET()`) actually correct?**
  _`getProducts()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getCategories()` (e.g. with `sitemap()` and `GET()`) actually correct?**
  _`getCategories()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `syncProductsFromJubelio()` (e.g. with `run()` and `GET()`) actually correct?**
  _`syncProductsFromJubelio()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `getSeoFooterLinks()` (e.g. with `CategoryPage()` and `getCategories()`) actually correct?**
  _`getSeoFooterLinks()` has 3 INFERRED edges - model-reasoned connections that need verification._