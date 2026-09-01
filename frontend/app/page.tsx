"use client";

import { useEffect, useRef, useState } from "react";
import type { Product, Category } from "@/lib/data";
import { LocationGate, readSavedLocation } from "@/components/location-gate";
import type { SavedLocation } from "@/components/location-gate";
import { PromoBar } from "@/components/promo-bar";
import { Header } from "@/components/header";
import { HeroSlider } from "@/components/hero-slider";
import { CategoryNav } from "@/components/category-nav";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { ProductSheet } from "@/components/product-sheet";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileOrderBar } from "@/components/mobile-order-bar";
import { InfoDrawer } from "@/components/info-drawer";
import { Overlay } from "@/components/overlay";
import { Footer } from "@/components/footer";
import { SkeletonLoader } from "@/components/skeleton-loader";
import { useScrollSpy } from "@/components/use-scroll-spy";

// Map category names to art types for visual styling
const categoryArtMap: { [key: string]: any } = {
  'Coffee': 'espresso',
  'Cappuccino': 'cappuccino',
  'Latte': 'latte',
  'Iced Coffee': 'iced',
  'Shakes': 'shake',
  'Desserts': 'dessert',
  'Snacks': 'snack',
};

function Shop({ categories, loading }: { categories: Category[]; loading: boolean }) {
  const [active, setActive] = useScrollSpy(categories);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [displayedCategories, setDisplayedCategories] = useState(categories.slice(0, 3));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Location gate: hydrate from localStorage on mount (client-only) so the
  // first server render is identical to the first client render.
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(
    null
  );
  const [locationOpen, setLocationOpen] = useState(false);

  useEffect(() => {
    setSavedLocation(readSavedLocation());
  }, []);

  // Sync displayedCategories with categories - show all categories
  useEffect(() => {
    if (categories.length > 0) {
      // Show all categories (lazy loading happens at image level, not category level)
      setDisplayedCategories(categories);
    }
  }, [categories]);

  // Infinite scroll - load more categories as user scrolls
  useEffect(() => {
    if (loading || displayedCategories.length >= categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate network delay, then load next batch
          setTimeout(() => {
            const newCount = Math.min(
              displayedCategories.length + 2,
              categories.length
            );
            setDisplayedCategories(categories.slice(0, newCount));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [categories]);

  const anyOpen = cartOpen || infoOpen || selected !== null || locationOpen;

  // Close drawers/sheet with Escape (accessibility) and lock body scroll
  // while any overlay surface is open. The location gate is NOT dismissible
  // with Escape — the user must pick a location first.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !locationOpen) {
        setCartOpen(false);
        setInfoOpen(false);
        setSelected(null);
      }
    }
    if (!anyOpen) return;
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [anyOpen, locationOpen]);

  return (
    <>
      <PromoBar />
      <Header
        savedLocation={savedLocation}
        onOpenCart={() => setCartOpen(true)}
        onOpenInfo={() => setInfoOpen(true)}
        onOpenLocation={() => setLocationOpen(true)}
      />

      <main className="page-main">
        <HeroSlider />
        <div className="sticky-bar">
          <SearchBar
            products={categories.flatMap(c => c.products)}
            onSelect={setSelected}
          />
          <CategoryNav
            active={active}
            categories={categories}
            onSelect={(id) => {
              setActive(id);
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>

        {loading ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(192, 133, 82, 0.2)',
              borderTopColor: '#c08552',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto'
            }} />
            <p style={{ marginTop: '20px', color: '#6b5548', fontSize: '16px' }}>Loading our menu...</p>
          </div>
        ) : displayedCategories.length === 0 ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            minHeight: '400px'
          }}>
            <p style={{ color: '#6b5548', fontSize: '18px' }}>No products available at the moment.</p>
          </div>
        ) : (
          <div id="menu-section">
            {displayedCategories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="c-section"
                aria-label={category.name}
              >
              <div className="c-section-head">
                <span className="c-section-num">{category.num} — Our {category.name}</span>
                <h2 className="c-section-title">{category.name}</h2>
                <p className="c-section-desc">{category.tagline}</p>
              </div>
              <div className="c-grid">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </section>
            ))}
            {isLoadingMore && <SkeletonLoader count={12} />}
            {displayedCategories.length < categories.length && (
              <div ref={loadMoreRef} style={{ height: '100px' }} />
            )}
          </div>
        )}
      </main>

      <Footer />

      <LocationGate
        open={!savedLocation || locationOpen}
        onConfirm={(saved) => {
          setSavedLocation(saved);
          setLocationOpen(false);
        }}
      />

      <ProductSheet product={selected} onClose={() => setSelected(null)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
      <InfoDrawer open={infoOpen} onClose={() => setInfoOpen(false)} />
      <Overlay
        show={anyOpen}
        onClose={() => {
          setCartOpen(false);
          setInfoOpen(false);
          setSelected(null);
        }}
      />
      <MobileOrderBar onViewCart={() => setCartOpen(true)} />
    </>
  );
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API with Stale-While-Revalidate
  useEffect(() => {
    fetchProducts();

    // Re-fetch products when cache is cleared (e.g., product added in Admin)
    const handleCacheCleared = () => {
      fetchProducts(true);
    };

    window.addEventListener('roast_products_cache_cleared', handleCacheCleared);
    window.addEventListener('roast_cache_cleared', handleCacheCleared);
    window.addEventListener('storage', handleCacheCleared);

    return () => {
      window.removeEventListener('roast_products_cache_cleared', handleCacheCleared);
      window.removeEventListener('roast_cache_cleared', handleCacheCleared);
      window.removeEventListener('storage', handleCacheCleared);
    };
  }, []);

  const fetchProducts = async (forceFresh = false) => {
    try {
      // 1. If cached products exist, load them immediately for instant UI render (Stale)
      if (!forceFresh && typeof window !== 'undefined') {
        const cachedProducts = localStorage.getItem('products_cache');
        if (cachedProducts) {
          try {
            const parsed = JSON.parse(cachedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
              await processProducts(parsed);
              setLoading(false);
            }
          } catch {
            localStorage.removeItem('products_cache');
          }
        }
      }

      // 2. Always fetch fresh products from API in background (Revalidate)
      const response = await fetch(`/api/products?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const data = await response.json();

      if (response.ok && data.products) {
        // Save fresh data to cache
        if (typeof window !== 'undefined') {
          localStorage.setItem('products_cache', JSON.stringify(data.products));
          localStorage.setItem('products_cache_time', Date.now().toString());
        }

        await processProducts(data.products);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const processProducts = async (products: any[]) => {
    // Fetch categories from database to get proper ordering
    let dbCategories: any[] = [];
    try {
      const catResponse = await fetch(`/api/categories?t=${Date.now()}`, {
        cache: 'no-store'
      });
      const catData = await catResponse.json();
      if (catResponse.ok && catData.categories) {
        // Filter only active categories and sort by display_order
        dbCategories = catData.categories
          .filter((c: any) => c.is_active)
          .sort((a: any, b: any) => a.display_order - b.display_order);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }

    // Group products by category (case-insensitive lookup key)
    const productsByCategory: { [key: string]: any[] } = {};

    products.forEach((p: any) => {
      // Show product if stock is not strictly 0 (defaults to in stock)
      const inStock = p.stock === undefined || p.stock === null || p.stock > 0;
      if (inStock) {
        const catName = p.category ? p.category.trim() : 'Other';
        if (!productsByCategory[catName]) {
          productsByCategory[catName] = [];
        }
        productsByCategory[catName].push({
          id: p.id,
          name: p.name,
          description: p.description || `Delicious ${p.name}`,
          price: parseFloat(p.price),
          art: categoryArtMap[catName] || 'espresso',
          badge: p.featured ? 'Popular' : undefined,
          image: p.image,
        });
      }
    });

    // Build categories array using database order
    const categoriesArray: Category[] = [];
    const usedCategoryNames = new Set<string>();

    if (dbCategories.length > 0) {
      // Use database categories with custom ordering
      dbCategories.forEach((dbCat: any, index: number) => {
        // Find matching products by name (case-insensitive match)
        const matchingKey = Object.keys(productsByCategory).find(
          (key) => key.toLowerCase() === dbCat.name.toLowerCase()
        );
        const categoryProducts = matchingKey ? productsByCategory[matchingKey] : [];

        if (matchingKey) {
          usedCategoryNames.add(matchingKey);
        }

        if (categoryProducts.length > 0) {
          categoriesArray.push({
            id: dbCat.slug || dbCat.name.toLowerCase().replace(/\s+/g, '-'),
            num: `0${categoriesArray.length + 1}`,
            name: dbCat.name,
            tagline: dbCat.description || `Explore our ${dbCat.name.toLowerCase()} collection`,
            products: categoryProducts,
          });
        }
      });
    }

    // Append any products from categories not in dbCategories so they are NEVER lost
    Object.entries(productsByCategory).forEach(([name, categoryProducts]) => {
      if (!usedCategoryNames.has(name) && categoryProducts.length > 0) {
        categoriesArray.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          num: `0${categoriesArray.length + 1}`,
          name: name,
          tagline: `Explore our ${name.toLowerCase()} collection`,
          products: categoryProducts,
        });
      }
    });

    setCategories(categoriesArray);
  };

  return <Shop categories={categories} loading={loading} />;
}