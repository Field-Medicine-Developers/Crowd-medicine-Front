<template>
  <section class="showcase section mb-5" id="showcase">
    <div class="showcase__header">
      <h2 class="section-title">{{ $t("conferences") }}</h2>
      <div class="section-divider">
        <span class="divider-dot"></span>
        <span class="divider-line"></span>
        <span class="divider-dot"></span>
      </div>
    </div>

    <div class="showcase__container">
      <div
        v-for="(conference, index) in conferenceVersions"
        :key="index"
        class="showcase__item"
      >
        <RouterLink
          v-if="conference.conferenceSetting"
          :to="`conference/${conference.id}`"
          class="showcase__link"
        >
          <div class="showcase__card">
            <div
              class="showcase__img-wrapper"
              :style="{
                backgroundImage: `url(${conference.conferenceSetting.logoFullUrl})`,
              }"
            >
              <div class="showcase__logo-container">
                <CachedImage
                  :src="conference.conferenceSetting.logoFullUrl"
                  :alt="getConferenceVersionsLocalized('Name', index)"
                  img-class="showcase__logo"
                  @load="onImageLoad"
                  @error="onImageError"
                />

                <!-- <img
                  :src="conference.conferenceSetting.logoFullUrl"
                  :alt="getConferenceVersionsLocalized('Name', index)"
                  class="showcase__logo"
                /> -->
              </div>
              <div class="showcase__overlay">
                <span class="showcase__view-btn">{{ $t("viewDetails") }}</span>
              </div>
            </div>
            <div class="showcase__content">
              <h3 class="showcase__title">
                {{ getConferenceVersionsLocalized("Name", index) }}
              </h3>
              <p
                v-if="getConferenceVersionsLocalized('Description', index)"
                class="showcase__description"
              >
                {{
                  truncateDescription(
                    getConferenceVersionsLocalized("Description", index)
                  )
                }}
              </p>
              <div class="showcase__date" v-if="conference.startDate">
                <i class="fa fa-calendar-alt"></i>
                <span>{{ formatDate(conference.startDate) }}</span>
              </div>
            </div>
          </div>
        </RouterLink>

        <RouterLink v-else class="showcase__link">
          <div class="showcase__card">
            <div class="showcase__img-wrapper placeholder">
              <div class="showcase__logo-container placeholder">
                <img
                  src="https://www.diabetes.ie/wp-content/uploads/2021/05/logo-Placeholder.jpg"
                  :alt="getConferenceVersionsLocalized('Name', index)"
                  class="showcase__logo"
                />
              </div>
              <div class="showcase__overlay">
                <span class="showcase__view-btn">{{ $t("comingSoon") }}</span>
              </div>
            </div>
            <div class="showcase__content">
              <h3 class="showcase__title">
                {{ getConferenceVersionsLocalized("Name", index) }}
              </h3>
              <p
                v-if="getConferenceVersionsLocalized('Description', index)"
                class="showcase__description"
              >
                {{
                  truncateDescription(
                    getConferenceVersionsLocalized("Description", index)
                  )
                }}
              </p>
              <div class="showcase__badge">
                <span>{{ $t("upcoming") }}</span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script>
import CachedImage from '@/components/CachedImage.vue'

export default {
  name: "ConferenceShowcase",
  components: { CachedImage },
  props: {
    conferenceVersions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getConferenceVersionsLocalized(field, index) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return (
        (this.conferenceVersions[index] &&
          this.conferenceVersions[index][`${prefix}${field}`]) ||
        ""
      );
    },
    truncateDescription(text) {
      if (!text) return "";
      return text.length > 100 ? text.substring(0, 100) + "..." : text;
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(this.$i18n.locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    },
  },
};
</script>

<style scoped>
.showcase {
  padding: 80px 24px;
  background-color: #f8f9fa;
  position: relative;
}

.showcase__header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
}

.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 150px;
}

.divider-line {
  height: 2px;
  width: 60px;
  background-color: #195015;
}

.divider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #195015;
  margin: 0 5px;
}

.showcase__container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.showcase__item {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease;
}

.showcase__item:hover {
  transform: translateY(-8px);
}

.showcase__link {
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
  display: block;
}

.showcase__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  transition: all 0.3s ease;
}

.showcase__card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.showcase__img-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Blurred background from logo */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.showcase__img-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  z-index: 1;
}

.showcase__img-wrapper.placeholder {
  background-color: #f0f0f0;
}

.showcase__logo-container {
  position: relative;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background-color: #195015ab;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.showcase__logo-container.placeholder {
  background-color: transparent;
  box-shadow: none;
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

.showcase__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #195015d1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.showcase__card:hover .showcase__overlay {
  opacity: 1;
}

.showcase__view-btn {
  color: white;
  font-weight: 600;
  padding: 10px 24px;
  border: 2px solid white;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.showcase__view-btn:hover {
  background-color: white;
  color: #195015;
  transform: scale(1.05);
}

.showcase__content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.showcase__title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.showcase__description {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
  flex-grow: 1;
}

.showcase__date {
  display: flex;
  align-items: center;
  color: #195015;
  font-size: 14px;
  font-weight: 500;
  margin-top: auto;
}

.showcase__date i {
  margin-right: 8px;
}

.showcase__badge {
  display: inline-block;
  padding: 6px 12px;
  background-color: #e6f7f5;
  color: #195015;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-top: auto;
  align-self: flex-start;
}

/* تحسينات للواجهات العربية */
:dir(rtl) .showcase__date i {
  margin-right: 0;
  margin-left: 8px;
}

/* تأثيرات حركية إضافية */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(112, 55, 1, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 150, 136, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 150, 136, 0);
  }
}

.showcase__logo-container {
  animation: pulse 3s infinite;
}

/* تحسينات للشاشات المختلفة */
@media (max-width: 1200px) {
  .showcase__container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .showcase {
    padding: 60px 20px;
  }

  .section-title {
    font-size: 28px;
  }

  .showcase__container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
  }

  .showcase__img-wrapper {
    height: 180px;
  }

  .showcase__content {
    padding: 20px;
  }

  .showcase__title {
    font-size: 18px;
  }

  .showcase__logo-container {
    width: 85%;
    height: 85%;
  }
}

@media (max-width: 480px) {
  .showcase {
    padding: 40px 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .showcase__container {
    grid-template-columns: 1fr;
  }

  .showcase__item:hover {
    transform: translateY(-5px);
  }

  .showcase__logo-container {
    width: 90%;
    height: 90%;
    padding: 10px;
  }
}

.showcase {
  padding: 10px 24px 60px;
  background-color: #f8f9fa;
  position: relative;
}
</style>
