class ImageCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Maximum number of images to cache
  }

  async getImage(url) {
    // Check if image is already in cache
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      // Create a new image object
      const img = new Image();
      
      // Create a promise to handle loading
      const imagePromise = new Promise((resolve, reject) => {
        img.onload = () => {
          // Add to cache
          this.addToCache(url, img);
          resolve(img);
        };
        img.onerror = reject;
      });

      // Start loading the image
      img.src = url;

      return imagePromise;
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  }

  addToCache(url, image) {
    // If cache is full, remove oldest item
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // Add new image to cache
    this.cache.set(url, image);
  }

  preloadImages(urls) {
    return Promise.all(urls.map(url => this.getImage(url)));
  }

  clearCache() {
    this.cache.clear();
  }
}

// Export a singleton instance
export const imageCache = new ImageCache(); 