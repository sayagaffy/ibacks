# Graph Report - ibacks  (2026-05-03)

## Corpus Check
- 119 files · ~28,581 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 267 nodes · 340 edges · 15 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `getProducts()` - 18 edges
2. `getCategories()` - 12 edges
3. `Button()` - 9 edges
4. `getSeoFooterLinks()` - 8 edges
5. `safeText()` - 8 edges
6. `toAbsoluteUrl()` - 8 edges
7. `ProductCard()` - 7 edges
8. `syncCategoriesFromJubelio()` - 7 edges
9. `GET()` - 6 edges
10. `GET()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `sitemap()` --calls--> `getCategories()`  [INFERRED]
  src\app\sitemap.ts → src\lib\category-cache.ts
- `GET()` --calls--> `getProducts()`  [INFERRED]
  src\app\api\categories\route.ts → src\lib\product-cache.ts
- `GET()` --calls--> `getProducts()`  [INFERRED]
  src\app\api\cron\fetch-reviews\route.ts → src\lib\product-cache.ts
- `GET()` --calls--> `getProducts()`  [INFERRED]
  src\app\api\products\route.ts → src\lib\product-cache.ts
- `GET()` --calls--> `getProducts()`  [INFERRED]
  src\app\api\products\[id]\route.ts → src\lib\product-cache.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (22): generateMetadata(), toDisplayName(), BackLink(), CategoryPage(), generateMetadata(), resolveCategoryData(), buildCategoryPath(), getCategorySeoContent() (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (16): sitemap(), GET(), GET(), flattenCategoryNodes(), ensureCacheDir(), getProductDetailWithDescription(), getProducts(), isCacheFresh() (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (6): buildPromoHeroSlides(), resolvePromoSlug(), slugifyPromo(), getPromoHero(), findSlideBySlug(), ProductCard()

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (12): GET(), getItemCategories(), ensureCacheDir(), getCategories(), isCategoryCacheFresh(), readCategoriesFromDisk(), syncCategoriesFromJubelio(), buildCategoryTree() (+4 more)

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
Cohesion: 0.24
Nodes (5): addSearchHistory(), loadSearchHistory(), saveSearchHistory(), useHeaderSearch(), SearchBar()

### Community 9 - "Community 9"
Cohesion: 0.43
Nodes (3): run(), fetchIpFallbackWarehouse(), fetchNearestWarehouse()

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (1): JubelioClient

### Community 12 - "Community 12"
Cohesion: 0.83
Nodes (3): loadEnv(), run(), upsertWarehouse()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (2): getFavouriteItems(), GET()

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (1): CartDrawerClient()

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (2): loadEnv(), run()

## Knowledge Gaps
- **Thin community `Community 11`** (6 nodes): `JubelioClient`, `.authenticate()`, `.constructor()`, `.get()`, `.getInstance()`, `client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (4 nodes): `getFavouriteItems()`, `GET()`, `route.ts`, `favourites.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (4 nodes): `RootLayout()`, `CartDrawerClient()`, `layout.tsx`, `CartDrawerClient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (3 nodes): `loadEnv()`, `run()`, `geo-migrate.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getProducts()` connect `Community 1` to `Community 0`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `getWarehousesByCity()` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `getCategories()` connect `Community 3` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `getProducts()` (e.g. with `sitemap()` and `GET()`) actually correct?**
  _`getProducts()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getCategories()` (e.g. with `sitemap()` and `GET()`) actually correct?**
  _`getCategories()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `getSeoFooterLinks()` (e.g. with `CategoryPage()` and `getCategories()`) actually correct?**
  _`getSeoFooterLinks()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `safeText()` (e.g. with `generateMetadata()` and `buildProductSchema()`) actually correct?**
  _`safeText()` has 2 INFERRED edges - model-reasoned connections that need verification._