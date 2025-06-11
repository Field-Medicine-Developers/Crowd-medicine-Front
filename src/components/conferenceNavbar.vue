<script>
import { MenuIcon } from "@zhuowenli/vue-feather-icons";
import CachedImage from '@/components/CachedImage.vue'
import { ref } from "vue";

export default {
  props: {
    navcolor: {
      type: String,
      default: null,
    },

    setting: {
      type: Object,
      required: true,
    }
  },
  components: { MenuIcon, CachedImage },
  setup() {
    const currentSection = ref(null);
    return { currentSection };
  },
  data() {
    return {
      rtlLocales: ["ar", "fa"],
      LanguageName: "العربية",
      isLanguageMenuOpen: false,
    };
  },
  mounted() {
    this.initScrollSpy();
    window.addEventListener("scroll", this.onWindowScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  methods: {

    onImageLoad() {
      
      
    },

    onImageError() {
      console.log('image error');
    },


    changeLocale(locale, name) {
      this.$i18n.locale = locale;

      this.setDocumentDirection(locale);
      this.LanguageName = name;
      this.$emit("changeLocale", locale);
    },

    getTextDirection(locale) {
      return this.rtlLocales.includes(locale) ? "rtl" : "ltr";
    },

    setDocumentDirection(locale) {
      const direction = this.getTextDirection(locale);
      document.documentElement.dir = direction;
      document.documentElement.lang = locale;
    },

    onWindowScroll() {
      const navbar = document.getElementById("navbar");
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        navbar.classList.add("nav-sticky");
      } else {
        navbar.classList.remove("nav-sticky");
      }
    },
    toggleMenu() {
      document.getElementById("navbarCollapse").classList.toggle("show");
    },
    initScrollSpy() {
      const sections = document.querySelectorAll("section");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.currentSection = entry.target.id;
            }
          });
        },
        {
          root: null,
          threshold: 0.5,
        }
      );

      sections.forEach((section) => observer.observe(section));
    },
    toggleLanguageMenu() {
      this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
    },
    closeLanguageMenu() {
      this.isLanguageMenuOpen = false;
    },
  },
};
</script>
<template>
  <!--Navbar Start-->
  <nav class="navbar navbar-expand-lg fixed-top navbar-custom" id="navbar" :class="{
    'navbar-light': navcolor === 'light',
    'navbar-light bg-white': navcolor === 'light-white',
  }">
    <div class="container">
      <!-- LOGO -->
      <router-link class="navbar-brand logo" to="/">
        <CachedImage
                  :src="setting.logoFullUrl"
                  :alt="'logo'"
                  img-class="logo-dark"
                  @load="onImageLoad"
                  @error="onImageError"
                />

                <CachedImage
                  :src="setting.logoFullUrl"
                  :alt="'logo'"
                  img-class="logo-light"
                  @load="onImageLoad"
                  @error="onImageError"
                />

      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" @click="toggleMenu">

        <menu-icon class=""></menu-icon>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav ms-auto navbar-center" id="navbar-navlist">
          <li class="nav-item">
            <a v-scroll-to="'#home'" href="javascript:void(0);" class="nav-link"
              :class="{ active: currentSection === 'home' }">
              <i class="fa fa-home me-2"></i> {{ $t("home") }}
            </a>
          </li>

          <li class="nav-item">
            <a v-scroll-to="'#about'" href="javascript:void(0);" class="nav-link"
              :class="{ active: currentSection === 'about' }">
              <i class="fa fa-info-circle me-2"></i> {{ $t("about") }}
            </a>
          </li>

          <li class="nav-item">
            <a v-scroll-to="'#conferenceTopics'" href="javascript:void(0);" class="nav-link"
              :class="{ active: currentSection === 'conferenceTopics' }">
              <i class="fa fa-book me-2"></i> {{ $t("conferenceTopics") }}
            </a>
          </li>
          <li class="nav-item">
            <a v-scroll-to="'#address'" href="javascript:void(0);" class="nav-link"
              :class="{ active: currentSection === 'address' }">
              <i class="fa fa-map-marker me-2"></i> {{ $t("conferenceAddress") }}
            </a>
          </li>

          <li class="nav-item">
            <a v-scroll-to="'#committees'" href="javascript:void(0);" class="nav-link"
              :class="{ active: currentSection === 'committees' }">
              <i class="fa fa-users me-2"></i> {{ $t("committees") }}
            </a>
          </li>

          <li class="nav-item">
            <a v-scroll-to="'#blog'" href="javascript:void(0);" class="nav-link"
              :class="{ active: currentSection === 'blog' }">
              <i class="fa fa-newspaper-o me-2"></i> {{ $t("blog") }}
            </a>
          </li>


          <li class="nav-item">
            <a v-scroll-to="'#submitResearch'" href="javascript:void(0);" class="nav-link"
              :class="{ active: currentSection === 'submitResearch' }">
              <i class="fa fa-upload me-2"></i> {{ $t("submitResearch") }}
            </a>
          </li>
        </ul>
        <div class="language-selector">
          <button 
            class="btn btn-primary language-btn" 
            @click="toggleLanguageMenu"
          >
            <i class="fa fa-globe me-2"></i> {{ LanguageName }}
          </button>
        </div>
      </div>

    </div>
  </nav>

  <!-- Language Modal -->
  <div class="language-modal" v-if="isLanguageMenuOpen" @click="closeLanguageMenu">
    <div class="language-modal-content" @click.stop>
      <div class="language-modal-header">
        <h3>{{ $t('selectLanguage') }}</h3>
        <button class="close-btn" @click="closeLanguageMenu">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="language-modal-body">
        <div class="language-option" @click="changeLocale('ar', 'العربية')">
          <i class="fa fa-language me-2"></i> العربية
        </div>
        <div class="language-option" @click="changeLocale('en', 'English')">
          <i class="fa fa-flag me-2"></i> English
        </div>
        <div class="language-option" @click="changeLocale('fa', 'الفارسية')">
          <i class="fa fa-globe me-2"></i> فارسي
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nav-sticky.navbar {
  margin-top: 0px;
  /* background-color: #195015; */
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.06);
  color: #ffffff !important;
}

.nav-sticky.navbar .navbar-nav li .nav-link {
  color: #ffffff !important;
}

.navbar-toggler {
  color: #ffffff !important;
  border: none !important;
  background: #195015;
  padding: 20px;
  border-radius: 50%;
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
}

[dir="rtl"] .navbar-toggler {
  right: auto;
  left: 1rem;
}

.navbar-nav {
  margin-right: 2rem;
  position: relative;
  z-index: 1;
  
  .nav-link {
    font-weight: 600;
    padding: 0.8rem 1.5rem;
    margin: 0 0.5rem;
    color: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.95rem;
    cursor: pointer;
    
    &.router-link-active {
      color: #fff;
      background: none;
      box-shadow: none;
    }
    
    i {
      margin-left: 0.5rem;
      font-size: 1.1rem;
      vertical-align: middle;
    }
  }
}

.language-selector {
  position: relative;
  z-index: 1;
}

.language-btn {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  color: #fff;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.95rem;
  
  i {
    margin-left: 0.5rem;
    font-size: 1.1rem;
    vertical-align: middle;
  }
}

.language-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
  animation: modalFade 0.3s ease-out;
}

.language-modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalSlide 0.3s ease-out;
}

.language-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.language-modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #7f8c8d;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #2c3e50;
  transform: rotate(90deg);
}

.language-modal-body {
  padding: 1.5rem;
}

.language-option {
  padding: 1rem 1.5rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.language-option:hover {
  background: rgba(0, 150, 136, 0.1);
  transform: translateX(5px);
}

.language-option i {
  margin-left: 0.5rem;
  color: #195015;
  font-size: 1.2rem;
}

@keyframes modalFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlide {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .language-modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .language-option {
    padding: 0.8rem 1.2rem;
  }
}

@media (max-width: 991px) {
  .navbar-nav {
    margin-right: 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    margin-top: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    
    .nav-link {
      padding: 1rem 1.5rem;
      margin: 0.3rem 0;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  .navbar-toggler {
    position: static;
    margin-left: auto;
  }
  
  [dir="rtl"] .navbar-toggler {
    margin-left: 0;
    margin-right: auto;
  }
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