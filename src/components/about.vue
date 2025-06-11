<script>
import { gsap } from "gsap";
import { Back } from "gsap";
// import { BoxIcon } from "@zhuowenli/vue-feather-icons";

export default {
  props: {
    about: {
      type: Object,
      required: true,
    },

    tip: {
      type: Object,
      required: true,
    },

    tipItems: {
      type: Array,
      required: false,
    },
  },

  methods: {
    getLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return this.about[`${prefix}${field}`] || "";
    },
    getTipLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return this.tip[`${prefix}${field}`] || "";
    },

    getItemTipLocalized(field, index) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return (
        (this.tipItems[index] && this.tipItems[index][`${prefix}${field}`]) ||
        ""
      );
    },
  },

  mounted() {
    const box = this.$refs.box;
    const timeline = gsap.timeline();
    timeline.to(box, {
      duration: 1,
      x: 0,
      rotation: 360,
      ease: Back.easeInOut,
    });

    timeline.to(
      box,
      {
        duration: 0.9,
        backgroundColor: "white",
      },
      "-=0.5"
    );
  },

  data() {
    return {};
  },
};
</script>

<template>
  <section class="conference-section" id="about">
    <div class="container">
      <div class="section-header">
        <div class="goals-themes-title-container">
          <i class="fa fa-bullseye goals-themes-icon"></i>
          <h2 class="goals-themes-title">{{ getLocalized("Name") }}</h2>
        </div>
        <p class="description">{{ getLocalized("Description") }}</p>
      </div>
      
      <div class="section-header">
        <div class="goals-themes-title-container">
          <i class="fa fa-bullseye goals-themes-icon"></i>
          <h2 class="goals-themes-title">{{ getTipLocalized("Name") }}</h2>
        </div>
        <p class="description">{{ getTipLocalized("Description") }}</p>
      </div>
      
      <div class="goals-themes-title-container">
          <i class="fa fa-bullseye goals-themes-icon"></i>
          <h2 class="goals-themes-title">{{ $t("conferenceTopics") }}</h2>
        </div>

      <div class="services-grid">
        
        <div
          ref="box"
          v-for="(service, index) in tipItems"
          :key="index"
          class="service-card"
          :class="{ 'service-card-highlight': service.highlighted }"
        >
          <div class="service-icon-wrapper">
            <img
              :src="service.iconFullUrl"
              alt="Service Icon"
              class="service-icon"
            />
          </div>
          <h3 class="service-title">
            {{ getItemTipLocalized("Name", index) }}
          </h3>
          <p class="service-description">
            {{ getItemTipLocalized("Description", index) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.conference-section {
  padding: 4rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.goals-themes-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.goals-themes-icon {
  font-size: 2rem;
  color: #195015;
}

.goals-themes-title {
  font-size: 2.5rem;
  color: #2c3c4e;
  font-weight: 700;
  margin: 0;
}

.description {
  color: #6c757d;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.7;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: #195015;
}

.service-card-highlight {
  border: 2px solid #195015;
  background: linear-gradient(145deg, #f0f8f5, #ffffff);
}

.service-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.service-icon {
  width: 48px;
  height: 48px;
  color: #195015;
}

.service-title {
  font-size: 1.3rem;
  color: #2c3c4e;
  margin-bottom: 1rem;
  font-weight: 600;
}

.service-description {
  color: #6c757d;
  line-height: 1.6;
}
</style>
