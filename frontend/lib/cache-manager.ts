/**
 * Cache Manager - Clear all frontend caches
 */

export function clearAllCaches() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Clear localStorage
    localStorage.removeItem('products_cache');
    localStorage.removeItem('products_cache_timestamp');
    localStorage.removeItem('hero_images_cache');
    localStorage.removeItem('settings_cache');

    // 2. Clear sessionStorage
    sessionStorage.clear();

    console.log('✅ All caches cleared successfully');
    return true;
  } catch (error) {
    console.error('Failed to clear caches:', error);
    return false;
  }
}

export function clearProductsCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('products_cache');
  localStorage.removeItem('products_cache_timestamp');
}

export function clearHeroImagesCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('hero_images_cache');
}

export function clearSettingsCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('settings_cache');
}
