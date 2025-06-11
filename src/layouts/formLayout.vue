<template>
  <div class="form-layout" :class="{ 'rtl': $i18n.locale === 'ar' }">
    <main class="content">
      <router-view :setting="setting" />
    </main>
    <ConferenceFooter
      :logo="setting.logoFullUrl"
      :title="getLocalized('Title')"
      :heroDec="getLocalized('HeroSubTitle')"
    />
  </div>
</template>

<script>
import ConferenceFooter from "@/components/conferenceFooter.vue";

export default {
  components: {
    ConferenceFooter,
  },
  data() {
    return {
      setting: {
        logoFullUrl: "",
        arabicTitle: "",
        englishTitle: "",
        persianTitle: "",
        arabicHeroSubTitle: "",
        englishHeroSubTitle: "",
        persianHeroSubTitle: "",
      },
    };
  },
  methods: {
    getLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale] || "arabic";
      return this.setting[`${prefix}${field}`] || "";
    },
  },
  mounted() {
    if (!this.$i18n.locale) {
      this.$i18n.locale = "ar";
    }
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

.form-layout {
  font-family: "Cairo", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.rtl {
  direction: rtl;
}

.content {
  flex: 1;
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
}
</style>