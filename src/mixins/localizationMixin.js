export const localizationMixin = {
  methods: {
    getLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return this[`${prefix}${field}`] || "";
    },
    updatePageMetadata() {
      // Update page title
      document.title = this.pageTitle;
      
      // Update favicon
      if (this.logoFullUrl) {
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
          favicon.href = this.logoFullUrl;
        }
      }
    }
  },
  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    }
  }
}; 