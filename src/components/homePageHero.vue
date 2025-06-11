<template>
  <div class="hero-section d-flex align-items-start justify-content-center">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-12 col-sm-12">
          <h1 class="display-4 fw-bold home__title animate__fadeInLeft text-center mb-3">
            {{ getLocalized("HeroTitle") }}
          </h1>
          <div class="text-center  mb-4" v-html="getLocalized('HeroSubTitle')" ></div>
        </div>
        <div class="col-md-12 col-sm-12 text-center">
          <video
            controls
            :src="setting.heroVedioFullUrl"
            class="rounded shadow-lg w-100"
            style=" max-width: 800px"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    setting: {
      type: Object,
      required: true,
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
      return this.setting[`${prefix}${field}`] || "";
    },
  },
};
</script>
<!-- import css -->