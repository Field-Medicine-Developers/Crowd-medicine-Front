<template>
  <div class="news-ticker">
    <div class="news-ticker-content">
      <div class="news-ticker-label">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
        <span>{{ $t('lastNews') }}</span>
      </div>
      <div class="news-ticker-text">
        <marquee :direction="isRTL ? 'right' : 'left'" :scrollamount="scrollSpeed">
          <div v-for="(news, index) in newsList" :key="index" class="news-ticker__item">
            {{ getBlogLocalized('BlogTitle', index) }}
            <img v-if="logo" :src="logo" alt="logo" />
          </div>
        </marquee>
      </div>
      <div class="news-ticker-controls">
        <button @click="togglePause">
          <svg class="icon" viewBox="0 0 24 24">
            <path v-if="isPaused" d="M8 5v14l11-7z"/>
            <path v-else d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        <button @click="changeSpeed">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsTicker',
  props: {
    newsList: {
      type: Array,
      required: true,
      default: () => []
    },
    logo: {
      type: String,
      required: false,
      default: '/default-logo.png'
    }
  },
  data() {
    return {
      isPaused: false,
      scrollSpeed: 5
    };
  },
  computed: {
    isRTL() {
      return this.$i18n.locale === 'ar';
    }
  },
  watch: {
    scrollSpeed(newSpeed) {
      const marquee = this.$el.querySelector('marquee');
      if (marquee) {
        marquee.scrollAmount = newSpeed;
      }
    }
  },
  methods: {
    getBlogLocalized(field, index) {
      const languageMap = {
        ar: 'arabic',
        en: 'english',
        fa: 'persian'
      };
      const prefix = languageMap[this.$i18n.locale];
      return (this.newsList[index] && this.newsList[index][`${prefix}${field}`]) || '';
    },
    togglePause() {
      this.isPaused = !this.isPaused;
      const marquee = this.$el.querySelector('marquee');
      if (marquee) {
        if (this.isPaused) {
          marquee.stop();
        } else {
          marquee.start();
        }
      }
    },
    changeSpeed() {
      this.scrollSpeed = this.scrollSpeed === 5 ? 2 : 5;
    }
  }
};
</script>

<style scoped>
.news-ticker {
  background: linear-gradient(135deg, #195015  0%, #195015 100%);
  color: #fff;
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 999;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.news-ticker::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: 0.1;
  z-index: 0;
}

.news-ticker-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.news-ticker-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  color: rgba(255, 255, 255, 0.9);
}

.news-ticker-text {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  padding: 0.5rem 0;
}

.news-ticker__item {
  display: inline-flex;
  align-items: center;
  margin-right: 2rem;
  gap: 1rem;
  flex-direction: row-reverse;
  
  img {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.news-ticker-controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  button {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    .icon {
      width: 20px;
      height: 20px;
    }
  }
}

@media (max-width: 768px) {
  .news-ticker {
    padding: 1rem 0;
  }
  
  .news-ticker-content {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .news-ticker-label {
    width: 100%;
    justify-content: center;
  }
  
  .news-ticker-text {
    font-size: 1rem;
    text-align: center;
  }
  
  .news-ticker-controls {
    width: 100%;
    justify-content: center;
  }
  
  .news-ticker__item {
    margin-right: 1rem;
    
    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
  