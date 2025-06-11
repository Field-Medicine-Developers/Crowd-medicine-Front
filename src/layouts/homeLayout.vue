<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="layout">
    <Navbar :setting="setting" @changeLocale="getLocalized" />
    <main class="content">
      <router-view :setting="setting" />
    </main>
    <Footer :logo="setting.logoFullUrl" :title="getLocalized('Title')" :heroDec="getLocalized('HeroSubTitle')" />
    <Switcher />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Navbar from "@/components/navbar.vue";
import Footer from "@/components/footer.vue";
import Switcher from "@/components/switcher";
import api from "@/js/api";
import { localizationMixin } from "@/mixins/localizationMixin";

export default {
  name: 'HomeLayout',
  components: {
    Navbar,
    Footer,
    Switcher,
  },
  mixins: [localizationMixin],
  data() {
    return {
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
        terms: "",
      },
      loading: true,
      error: null
    };
  },
  computed: {
    ...mapState(["isDarkMode"]),
    pageTitle() {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian"
      };
      const prefix = languageMap[this.currentLanguage];
      return this.setting[`${prefix}Title`] || "مؤتمر حشد الطبابة العلمي الدولي";
    }
  },
  methods: {
    ...mapActions(['setLanguage']),
    async fetchSetting() {
      try {
        const response = await api.get("Setting/GetAllSetting");
        if (response.data.data == null) {
          return;
        }
        this.setting = response.data.data;
        this.updatePageMetadata();
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
    updatePageMetadata() {
      // Update page title
      document.title = this.pageTitle;
      
      // Update favicon
      if (this.setting.logoFullUrl) {
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
          favicon.href = this.setting.logoFullUrl;
        }
      }
    }
  },
  watch: {
    currentLanguage() {
      this.updatePageMetadata();
    }
  },
  mounted() {
    this.fetchSetting();
  },
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
}

.layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.05) 0%, rgba(0, 121, 107, 0.05) 100%);
  z-index: 0;
}

.layout::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: 
    linear-gradient(45deg, rgba(0, 150, 136, 0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(0, 150, 136, 0.05) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(0, 150, 136, 0.05) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(0, 150, 136, 0.05) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: 0.1;
  z-index: 0;
}

.content {
  flex: 1;
  /* padding-top: 80px; */
  position: relative;
  z-index: 1;
}

/* Global styles for sections */
section {
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.03) 0%, rgba(0, 121, 107, 0.03) 100%);
  z-index: -1;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 2.5rem;
  position: relative;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.5px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #195015 0%, #00796b 100%);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 150, 136, 0.2);
  }
}

.section-subtitle {
  font-size: 1.4rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  font-weight: 500;
}

/* Card styles */
.card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  }
}

.card-header {
  background: transparent;
  border-bottom: 1px solid rgba(234, 237, 243, 0.8);
  padding: 2rem;
}

.card-body {
  padding: 2rem;
}

/* Button styles */
.btn {
  padding: 1.2rem 2.5rem;
  border-radius: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.95rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover::before {
    transform: translateX(0);
  }
  
  &-primary {
    background: linear-gradient(135deg, #195015 0%, #00796b 100%);
    border: none;
    box-shadow: 0 4px 15px rgba(0, 150, 136, 0.2);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 150, 136, 0.3);
    }
  }
  
  &-outline-primary {
    color: #195015;
    border: 2px solid #195015;
    background: transparent;
    
    &:hover {
      background: linear-gradient(135deg, #195015 0%, #00796b 100%);
      color: #fff;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 150, 136, 0.2);
    }
  }
}

/* Form styles */
.form-control {
  border-radius: 15px;
  border: 2px solid #eaedf3;
  padding: 1.2rem 1.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: #195015;
    box-shadow: 0 0 0 0.2rem rgba(0, 150, 136, 0.1);
  }
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive styles */
@media (max-width: 768px) {
  /* .content {
    padding-top: 70px;
  } */
  
  section {
    padding: 4rem 0;
  }
  
  .section-title {
    font-size: 2.2rem;
  }
  
  .section-subtitle {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
  
  .card {
    margin-bottom: 2rem;
  }
  
  .btn {
    padding: 1rem 2rem;
  }
  
  .form-control {
    padding: 1rem 1.2rem;
  }
}
</style>
  