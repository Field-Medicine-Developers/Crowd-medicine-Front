<template>
    <ConferenceNavbar :setting="setting" @changeLocale="getLocalized" />
    <main class="content">
      <router-view :setting="setting" />
    </main>
    <ConferenceFooter :logo="setting.logoFullUrl" :title="getLocalized('Title')" :heroDec="getLocalized('HeroSubTitle')" />
  </template>
  
  <script>
  import ConferenceNavbar from "@/components/conferenceNavbar.vue"; 
  import ConferenceFooter from "@/components/conferenceFooter.vue"; 
  import api from "@/js/api"; 
  
  export default {
    components: {
      ConferenceNavbar,
      ConferenceFooter,
      
    },
    data() {
      return {
        id: this.$route.params.id ,
        setting: {
          logo: "",
          arabicTitle: "",
          englishTitle: "",
          persianTitle: "",
          arabicHeroTitle: "",
          englishHeroTitle: "",
          persianHeroTitle: "",
          arabicHeroSubTitle: "",
          englishHeroSubTitle: "",
          persianHeroSubTitle: "",
          heroVedio: "",
          arabicFooter: "",
          englishFooter: "",
          persianFooter: "",
          location: {
            arabicAddress: " ",
            englishAddress: "",
            persianAddress: "",
            arabicAddressDescription: "",
            englishAddressDescription: "",
            persianAddressDescription: "",
            latitude: 0,
            longitude: 0,
          },
          logoFullUrl: "",
          heroVedioFullUrl: "",
          terms : "",
          isActive : true,
          endTime : "",
        },
      };
    },
    methods: {



      async fetchSetting() {
        try {
          const response = await api.get("ConferenceSetting/GetConferenceSettingById?id=" + this.id);
          if (response.data.data == null) {
            return;
          }
          this.setting = response.data.data;
        } catch (error) {
          console.error("Error fetching setting:", error);
        }
      },
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
    mounted() {
      this.fetchSetting();
    },
  };
  </script>
  