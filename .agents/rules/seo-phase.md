# MISSION: FINAL PHASE IMPLEMENTATION (ADVANCED SEO, GEO & HYPERLOCAL)

## Context

We are entering the Final Phase of the ibackscreation.com revamp. The core UI/UX and Jubelio WMS integrations are stable. Your mission is to implement the "Generative Engine Optimization (GEO) & Hyperlocal Strategy" as the final architectural layer. This ensures the site is optimized not just for traditional search, but for AI-powered search engines (e.g., Google AI Overviews, ChatGPT) and Voice Search.

## CRITICAL ARCHITECTURE RULES:

- **Core Stack:** Next.js (App Router), TypeScript, and Tailwind CSS.
- **No External Backend:** Do NOT create a separate Go backend. All spatial search scoring must be implemented natively via Next.js API Routes/Server Actions.
- **Jubelio Primacy:** Jubelio remains the single source of truth for product data.

## TECHNICAL REQUIREMENTS:

### 1. GEO & ASSET ARCHITECTURE (AI-Ready Data):

- **Server-Side Rendering (SSR):** Ensure all dynamic routes utilize Next.js Server Components for full HTML indexing.
- **Comprehensive JSON-LD Schema:** Generative engines rely heavily on structured data. You MUST generate dynamic schema markup including `Product`, `Offer`, `AggregateRating`, `FAQPage`, and `ImageObject` [5]. Ensure fields like pricing, availability, and GTIN/SKU are actively mapped from Jubelio [5].
- **Asset Optimization:** Configure Next.js image loader to exclusively use Cloudflare R2 for storing and serving images in WebP/AVIF formats to maintain lightning-fast LCP (Largest Contentful Paint) for mobile/voice search users [6, 7].
- **Automated XML Sitemap:** Build a dynamic `sitemap.ts` based on the active Jubelio product catalog.

### 2. CONVERSATIONAL SEO & DYNAMIC FOOTER (Answer Engine Optimization):

- **Component Creation:** Build an `<SeoContentBlock />` component rendered at the bottom of Category and Home pages. Use a UX-friendly accordion/"Read More" toggle to keep the mobile UI clean while keeping the text in the HTML DOM [8].
- **Conversational Content:** Generative engines favor natural language. The text inside this block must be structured as Q&A (Who, What, Where, When, How) targeting long-tail voice search queries (e.g., "What is the best fast-charging powerbank?") [9, 10].
- **E-E-A-T Signals:** Embed authentic customer reviews and trust signals within the UI. Reviews provide natural language data that AI assistants use for answers [11, 12].

### 3. GEO-LOCATION & HYPERLOCAL IMPLEMENTATION:

- **Spatial Database Setup:** Use PostgreSQL + PostGIS (via Drizzle/Prisma in `/src/lib/geo-db/`) STRICTLY for handling physical store/warehouse coordinates (Point geometry) [13].
- **Local Location Pages:** If we have physical presence, create a dynamic route (e.g., `/locations/[city]`) with unique local content (not just duplicated boilerplate text) [14, 15]. Include specific `LocalBusiness`, `branchOf`, `openingHours`, `areaServed`, and `geo` schema markup [16].
- **User Location Detection & Scoring:** Implement hybrid detection (HTML5 Geolocation API + IP fallback). Create a TypeScript utility using `ST_Distance` to calculate proximity [13].
- **Geofencing Logic:** Display accurate shipping availability and "Fast Pickup" options on the Product Detail Page (PDP) based on the user's distance from the nearest warehouse polygon [17].

## EXECUTION INSTRUCTION:

Do not trigger the full GEO/Hyperlocal logic simultaneously. Wait for my specific prompt for each sub-task. Maintain clean, modular code, keeping file sizes strictly under 150 lines.
