# Frontend Pagination & Image Sizing Implementation Guide

## Quick Reference

### What Was Done

1. ✅ Created universal **Pagination component** in `shared/components/ui/`
2. ✅ Integrated pagination into **ProductsPage** (2500+ products browsing)
3. ✅ Integrated pagination into **Admin Users management**
4. ✅ Reduced product image display sizes by **~3x** across all pages
5. ✅ Made product detail layout **responsive with padding and max-width**
6. ✅ Updated category images to use **S3 hosted URLs**

---

## Component Architecture

### Pagination Component Flow

```
ProductsPage / UserManagement
         ↓
   [loadProducts(page)]
         ↓
   [API call with ?page=X]
         ↓
   [Backend returns { results, count, next, previous }]
         ↓
   [Pagination component receives total, currentPage, pageSize]
         ↓
   [User clicks Siguiente/Anterior or page number]
         ↓
   [onPageChange(newPage) → loadProducts(newPage)]
```

---

## File Structure

```
ss_frontend/
├── src/
│   ├── shared/
│   │   └── components/
│   │       └── ui/
│   │           └── Pagination.tsx          ← NEW: Universal component
│   │
│   └── modules/
│       ├── products/
│       │   ├── pages/
│       │   │   ├── ProductsPage.tsx        ← Updated: +pagination
│       │   │   ├── ProductDetailPage.tsx   ← Updated: responsive images
│       │   │   └── HomePage.tsx            ← Updated: S3 category URLs
│       │   └── components/
│       │       └── ProductCard.tsx         ← Updated: smaller images
│       │
│       └── admin/
│           ├── components/
│           │   └── DataTable.tsx           ← Updated: pagination support
│           └── pages/
│               └── UsersManagment.tsx      ← Updated: +pagination
```

---

## Key Code Snippets

### Pagination Component Usage

```tsx
<Pagination
  total={totalCount} // Total records (e.g., 2500)
  pageSize={pageSize} // Records per page (e.g., 12)
  currentPage={page} // Current page (1-indexed)
  onPageChange={(p) => loadProducts(p)} // Callback
/>
```

### ProductsPage Pagination Implementation

```tsx
// State
const [page, setPage] = useState<number>(1);
const [totalCount, setTotalCount] = useState<number>(0);
const [pageSize, setPageSize] = useState<number>(12);

// Load function
const loadProducts = async (requestedPage = 1) => {
  const params = {
    /* filters */
  };
  params.page = requestedPage; // ← Add page param

  const data = await productsService.getProducts(params);
  setProducts(data.results ?? []);
  setTotalCount(data.count ?? 0);
  setPage(requestedPage);
};

// Render
<Pagination
  total={totalCount}
  pageSize={pageSize}
  currentPage={page}
  onPageChange={(p) => loadProducts(p)}
/>;
```

### ProductCard Image Sizing

```tsx
// Before: aspect-[3/4] (fills available width, tall)
// After: responsive heights
<div className="relative h-40 md:h-44 lg:h-48 overflow-hidden bg-neutral-light rounded-t-lg">
  <img src={product.imagen_principal} className="w-full h-full object-cover" />
</div>

// Result:
// Mobile: 160px height
// Tablet: 176px height
// Desktop: 192px height
```

### ProductDetailPage Image Layout

```tsx
// Centered, padded container
<div className="flex justify-center">
  <div className="w-full max-w-md p-4 bg-neutral-100 rounded-2xl">
    <Swiper /* ... */>
      {allImages.map((image) => (
        <SwiperSlide>
          {/* object-contain: shows full image without cropping */}
          <img src={image} className="w-full h-64 md:h-96 object-contain" />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</div>

// Result:
// - Image centered with padding
// - Max 448px wide on desktop
// - Responsive height (256px mobile, 384px desktop)
// - Thumbnails positioned below within container
```

---

## Backend Requirements

### API Endpoint Expectations

ProductsPage expects backend to return:

```json
{
  "count": 2500,
  "next": "http://api.example.com/products/?page=2",
  "previous": null,
  "results": [
    { "id": "1", "nombre": "...", "imagen_principal": "..." },
    ...
  ]
}
```

**Query Parameters:**

- `page` (required): 1-indexed page number
- `categorias`: comma-separated category IDs (optional)
- `marca`: comma-separated brand IDs (optional)
- `precio_min`, `precio_max`: price range (optional)
- `color`: color filter (optional)
- `talla`: size ID (optional)

### Backend Setup (Django)

If using Django REST Framework pagination:

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12
}
```

---

## Testing Scenarios

### 1. Product Pagination

**Scenario:** User browses through 2500 products

```
1. Visit /products
2. See 12 products on page 1
3. Click "Siguiente" → URL changes to ?page=2
4. See different 12 products
5. Click page number → Jump directly to that page
6. Verify URL updates: ?page=X
7. Apply filter (e.g., categorias=1) → Stays on page 1
8. Paginate again → Filters maintained across pages
```

### 2. Product Images

**Scenario:** Images display at correct sizes

```
1. Visit /products (ProductCard)
   - Desktop: ~192px height
   - Mobile: ~160px height
   - No distortion, proper object-cover
2. Click product → Product detail
   - Main image: centered, padded (max 448px wide)
   - Height: ~256px mobile, ~384px desktop
   - Full image visible (object-contain)
   - Thumbnails below
3. Verify S3 image loads (check Network tab)
```

### 3. Admin Pagination

**Scenario:** Admin manages users with pagination

```
1. Visit /admin/users
2. See 10 users per page (pageSize=10)
3. Click "Siguiente" → Load next 10 users
4. Search for "john" → Results page 1
5. Paginate → Results maintained across pages
6. Add new user → Returns to appropriate page
```

### 4. Category Images

**Scenario:** Home page loads category images

```
1. Visit / (home page)
2. Scroll to "Compra por Categoría"
3. Verify all 4 images load from S3:
   - Vestidos: vestidos.jpg
   - Blusas: blusas.jfif
   - Pantalones: jeans.webp
   - Chaquetas: jackets.webp
4. Check Network tab → 200 OK responses
5. Verify images display correctly
```

---

## Responsive Design Breakdown

### Mobile (<768px)

- ProductCard height: `h-40` (160px)
- ProductDetail main image: `h-64` (256px)
- Pagination: Shows "Anterior/Siguiente" only (no page numbers)
- Full-width layout

### Tablet (768px - 1024px)

- ProductCard height: `md:h-44` (176px)
- ProductDetail main image: `md:h-96` (384px)
- Pagination: Shows page numbers
- Grid: 3 columns

### Desktop (>1024px)

- ProductCard height: `lg:h-48` (192px)
- ProductDetail main image: `md:h-96` (384px), max-width 448px
- Pagination: Shows page numbers with Previous/Next
- Grid: 4 columns

---

## Troubleshooting

### Issue: Pagination doesn't appear

**Cause:** Backend not returning `count` or pagination props not set
**Solution:** Verify DataTable/ProductsPage receives:

- `total`, `pageSize`, `currentPage`, `onPageChange`

### Issue: Images look stretched/distorted

**Cause:** `object-cover` with wrong aspect ratio
**Solution:** ProductCard uses `object-cover` ✓ (intentional)
ProductDetail uses `object-contain` ✓ (intentional)

### Issue: S3 images 404

**Cause:** URL is incorrect or S3 bucket not public
**Solution:**

- Verify S3 URL format: `https://smart-sales-2025-media.s3.us-east-1.amazonaws.com/...`
- Confirm bucket policy allows public GetObject
- Check object ACLs are public-read

### Issue: Page state not syncing with URL

**Cause:** `setSearchParams` not called
**Solution:** ProductsPage includes URL sync:

```tsx
const sp: any = Object.fromEntries(Array.from(searchParams.entries()));
sp.page = String(requestedPage);
setSearchParams(sp);
```

---

## Performance Notes

### Before Updates

- ProductsPage loaded all products at once
- Product images at full size (aspect-[3/4])
- No pagination on admin pages

### After Updates

- ✅ Pagination: Only 12 products loaded per page
- ✅ Images: Smaller render size = less memory
- ✅ Admin: Efficient data loading with pagination
- ✅ UX: Better perceived performance

### Optimization Opportunities (Future)

- Image lazy loading
- Progressive image loading (LQIP)
- Infinite scroll pagination option
- Server-side filtering optimization
- Image CDN caching

---

## Deployment Checklist

- [ ] All frontend files updated (7 files modified/created)
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Backend endpoint supports `page` parameter
- [ ] S3 bucket is public with correct URLs
- [ ] Images uploaded via `upload_imagenes_s3.py` (2500 images)
- [ ] Seeder updated to use deterministic image filenames
- [ ] Database seeded with 2500 products
- [ ] Test pagination on /products page
- [ ] Test pagination in /admin/users
- [ ] Test category images load from S3
- [ ] Responsive design tested on mobile/tablet/desktop

---

## Summary Statistics

| Metric                 | Value              |
| ---------------------- | ------------------ |
| Components Created     | 1 (Pagination.tsx) |
| Components Updated     | 5                  |
| Pages Updated          | 4                  |
| Image size reduction   | ~3x                |
| Products per page      | 12 (configurable)  |
| Admin records per page | 10 (configurable)  |
| Total files changed    | 7                  |
| Lines of code added    | ~200               |
