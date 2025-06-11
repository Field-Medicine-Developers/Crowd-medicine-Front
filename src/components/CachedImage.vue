<template>
  <div class="cached-image" :class="{ 'loading': isLoading }">
    <img
      v-if="!isLoading"
      :src="imageUrl"
      :alt="alt"
      :class="imgClass"
      @load="handleLoad"
      @error="handleError"
    />
    <div v-if="isLoading" class="loading-placeholder">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import { imageCache } from '@/js/imageCache';

export default {
  name: 'CachedImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    imgClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: true,
      imageUrl: '',
      error: null
    };
  },
  watch: {
    src: {
      immediate: true,
      handler(newSrc) {
        this.loadImage(newSrc);
      }
    }
  },
  methods: {
    async loadImage(src) {
      try {
        this.isLoading = true;
        const image = await imageCache.getImage(src);
        if (image) {
          this.imageUrl = src;
        }
      } catch (error) {
        console.error('Error loading image:', error);
        this.error = error;
      } finally {
        this.isLoading = false;
      }
    },
    handleLoad() {
      this.$emit('load');
    },
    handleError(error) {
      this.$emit('error', error);
    }
  }
};
</script>

<style scoped>
.cached-image {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #195015;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.logo-img-main {
  height: 90px;
  padding-right: 13px;
  padding-left: 13px;
max-width: 130px;
object-fit: contain;
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-container:hover .logo-img-main {
  transform: scale(1.05);
}

@media (max-width: 991px) {
  .logo-img-main {
    height: 90px;
    max-width: 110px;
    padding-right: 13px;
    padding-left: 13px;
  }
}

.showcase__logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.showcase__card:hover .showcase__logo {
  transform: scale(1.05);
}

.logo-dark,
.logo-light {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  width: 120px;
  height: auto;
  position: relative;
  z-index: 1;
  object-fit: contain;
  
  &:hover {
    transform: scale(1.05) rotate(-2deg);
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
  }
}

@media (max-width: 991px) {
  .logo-dark,
  .logo-light {
    width: 100px;
  }
}

@media (max-width: 576px) {
  .logo-dark,
  .logo-light {
    width: 80px;
  }
}

</style> 