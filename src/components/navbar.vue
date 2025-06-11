<template>
  <nav
    class="navbar navbar-expand-lg fixed-top navbar-custom"
    id="navbar"
    :class="{ 'navbar-light': navcolor === 'light', 'navbar-light bg-white': navcolor === 'light-white', 'nav-sticky': isScrolled }"
  >
    <div class="container">
      <!-- Logo -->
      <router-link class="navbar-brand logo" to="/" @click="closeMenu">
        <div class="logo-container">
          <CachedImage
            :src="setting.logoFullUrl"
            alt="Logo"
            img-class="logo-img-main"
            @load="onImageLoad"
            @error="onImageError"
          />

          <!-- <img :src="setting.logoFullUrl" alt="Logo" class="logo-img" /> -->
        </div>
      </router-link>
      
      <!-- Mobile Toggle Button -->
      <!-- <button class="navbar-toggler" type="button" @click="toggleMenu">
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
      </button>
       -->
      <!-- Navbar Links and Language Selector -->
      <div class="collapse navbar-collapse" :class="{ 'show': isMenuOpen }">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="item in navItems" :key="item.id">
            <router-link v-if="!item.link.startsWith('#')" :to="item.link" class="nav-link" @click="closeMenu">
              <i :class="item.icon"></i> 
              <span>{{ $t(item.name) }}</span>
            </router-link>
            <a v-else :href="item.link" class="nav-link" @click="scrollToSection">
              <i :class="item.icon"></i> 
              <span>{{ $t(item.name) }}</span>
            </a>
          </li>
        </ul>
        
        <div class="language-selector">
          <button 
            class="btn language-btn" 
            @click="toggleLanguageMenu"
          >
            <i class="fa fa-globe"></i>
            <span>{{ LanguageName }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Decorative Elements -->
    <div class="navbar-decoration navbar-decoration-1"></div>
    <div class="navbar-decoration navbar-decoration-2"></div>
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
        <div 
          class="language-option" 
          :class="{ 'active': $i18n.locale === 'ar' }"
          @click="changeLocale('ar', 'العربية')"
        >
          <div class="language-option-icon">
            <i class="fa fa-language"></i>
          </div>
          <div class="language-option-text">العربية</div>
        </div>
        <div 
          class="language-option"
          :class="{ 'active': $i18n.locale === 'en' }"
          @click="changeLocale('en', 'English')"
        >
          <div class="language-option-icon">
            <i class="fa fa-flag"></i>
          </div>
          <div class="language-option-text">English</div>
        </div>
        <div 
          class="language-option"
          :class="{ 'active': $i18n.locale === 'fa' }"
          @click="changeLocale('fa', 'الفارسية')"
        >
          <div class="language-option-icon">
            <i class="fa fa-globe"></i>
          </div>
          <div class="language-option-text">فارسي</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { MenuIcon } from "@zhuowenli/vue-feather-icons";
import { ref, onMounted, onUnmounted } from "vue";
import CachedImage from '@/components/CachedImage.vue'

export default {
  props: {
    navcolor: { type: String, default: null },
    setting: { type: Object, required: true }
  },
  // components: { MenuIcon },
  components: { CachedImage },
  setup() {
    const isMenuOpen = ref(false);
    const isLanguageMenuOpen = ref(false);
    const LanguageName = ref("العربية");
    const rtlLocales = ["ar", "fa"];
    const isScrolled = ref(false);

    const navItems = [
      { id: 1, name: "home", link: "/", icon: "fa fa-home" },
      { id: 2, name: "blog", link: "/blog", icon: "fa fa-list-alt" },
      { id: 3, name: "conferenceVersions", link: "#conferenceVersions", icon: "fa fa-list-alt" }
    ];
    
    // Handle window scroll for navbar style changes
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
    };
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    });
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return { 
      isMenuOpen, 
      isLanguageMenuOpen, 
      LanguageName, 
      rtlLocales, 
      navItems,
      isScrolled
    };
  },
  methods: {
    toggleLanguageMenu() {
      this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
    },
    closeLanguageMenu() {
      this.isLanguageMenuOpen = false;
    },
    changeLocale(locale, name) {
      this.$i18n.locale = locale;
      document.documentElement.dir = this.rtlLocales.includes(locale) ? "rtl" : "ltr";
      this.LanguageName = name;
      this.$emit("changeLocale", locale);
      this.closeLanguageMenu();
      this.closeMenu();
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    scrollToSection(event) {
      const link = event.target.closest('.nav-link');
      if (link && link.getAttribute('href').startsWith('#')) {
        event.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          this.closeMenu();
        }
      }
    }
  }
};
</script>

<style scoped>

.navbar {
  background-color: #195015 !important;
}
/* Navbar Base Styles */
.navbar-custom {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.2rem 0;
  background: linear-gradient(135deg, #195015 0%, #195015 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1000;
}

/* Sticky Navbar Styles */
.navbar-custom.nav-sticky {
  background: #195015;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 0.8rem 0;
}

/* Decorative Elements */
.navbar-custom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: 0;
}

.navbar-decoration {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
}

.navbar-decoration-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: 10%;
}

.navbar-decoration-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: 5%;
}

/* Logo Styles */
.logo-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 12px;
  z-index: 10;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.15);
  margin-right: 1rem;
}

.logo-img {
  height: 90px;

  max-width: 130px;
  object-fit: contain;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-container:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.logo-container:hover .logo-img {
  transform: scale(1.05);
}

/* Mobile Toggle Button */
.navbar-toggler {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;
  z-index: 1005;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-toggler:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.toggler-icon {
  display: block;
  width: 22px;
  height: 2px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.navbar-toggler:hover .toggler-icon {
  width: 18px;
}

.navbar-toggler:hover .toggler-icon:nth-child(1) {
  transform: translateY(1px);
}

.navbar-toggler:hover .toggler-icon:nth-child(3) {
  transform: translateY(-1px);
}

/* Navigation Links */
.navbar-nav {
  margin-right: 2rem;
  display: flex;
  align-items: center;
  z-index: 10;
}

.nav-item {
  margin: 0 0.25rem;
}

.nav-link {
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  background-color: transparent;
}

.nav-link i {
  margin-right: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
}

.nav-link:hover i {
  transform: scale(1.2);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  width: 20px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transform: translateX(-50%);
}

/* Language Selector */
.language-selector {
  margin-left: 0.5rem;
  z-index: 10;
}

.language-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  color: white;
}

.language-btn i {
  font-size: 1rem;
  transition: all 0.3s ease;
}

.language-btn:hover i {
  transform: rotate(15deg);
}

/* Language Modal */
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
  max-width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalSlide 0.3s ease-out;
}

.language-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #f9f9f9, #ffffff);
}

.language-modal-header h3 {
  margin: 0;
  color: #1d3557;
  font-size: 1.2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 5px;
}

.language-modal-header h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, #195015, transparent);
  border-radius: 2px;
}

.close-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: #555;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
  color: #333;
}

.language-modal-body {
  padding: 1.5rem;
}

.language-option {
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 12px;
  background-color: #2f9e9424;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border: 1px solid #f0f0f0;
}

.language-option:hover {
  background-color: #f0f7f6;
  transform: translateY(-2px);
  background-color: rgb(0 150 136 / 6%);
  border-color: #195015;
}

.language-option.active {
  background-color: rgb(0 150 136 / 6%);
  border-color: #195015;
}

.language-option-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 150, 136, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #195015;
  font-size: 1.2rem;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.language-option:hover .language-option-icon {
  background-color: rgba(0, 150, 136, 0.2);
  transform: rotate(15deg);
}

.language-option-text {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

/* Animations */
@keyframes modalFade {
  from { opacity: 0; }
  to { opacity: 1; }
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

/* RTL Support */
[dir="rtl"] .nav-link i {
  margin-right: 0;
  margin-left: 0.5rem;
}

[dir="rtl"] .language-option-icon {
  margin-right: 0;
  margin-left: 1rem;
}

[dir="rtl"] .language-modal-header h3::after {
  left: auto;
  right: 0;
  background: linear-gradient(to left, #195015, transparent);
}

/* Responsive Styles */
@media (max-width: 991px) {
  .navbar-custom {
    padding: 0.8rem 1rem;
  }
  
  .navbar-collapse {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    height: 100vh;
    background: linear-gradient(135deg, rgba(0, 150, 136, 0.98) 0%, rgba(0, 121, 107, 0.98) 100%);
    padding: 2rem 1.5rem;
    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease-in-out;
    transform: translateX(100%);
    overflow-y: auto;
    z-index: 1004;
    display: flex;
    flex-direction: column;
  }
  
  [dir="rtl"] .navbar-collapse {
    right: auto;
    left: 0;
    transform: translateX(-100%);
    box-shadow: 5px 0 30px rgba(0, 0, 0, 0.15);
  }
  
  .navbar-collapse.show {
    transform: translateX(0);
  }
  
  .navbar-nav {
    margin-right: 0;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 100%;
    flex-direction: column;
  }
  
  .nav-item {
    margin: 0.5rem 0;
    width: 100%;
  }
  
  .nav-link {
    padding: 1rem;
    width: 100%;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.1);
    justify-content: center;
  }
  
  .nav-link.router-link-active::after {
    display: none;
  }
  
  .language-selector {
    margin-left: 0;
    margin-top: auto;
    width: 100%;
  }
  
  .language-btn {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }
  
  .logo-container {
    margin-right: 0;
    background-color: transparent;
  }
  
  .logo-img {
    height: 32px;
    max-width: 110px;
  }
}

@media (max-width: 576px) {

  .navbar > .container, .navbar > .container-fluid, .navbar > .container-sm, .navbar > .container-md, .navbar > .container-lg, .navbar > .container-xl, .navbar > .container-xxl {
    display: flex
;
    flex-wrap: inherit;
    align-items: center;
    justify-content: center;
}


  .navbar-custom {
    padding: 0.6rem 1rem;
  }
  
  .logo-img {
    height: 132px;
    max-width: 100px;
  }
  
  .navbar-collapse {
    width: 260px;
    padding: 1.5rem 1rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 0.8rem;
  }
  
  .language-option {
    padding: 0.8rem;
  }
  
  .language-option-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .language-option-text {
    font-size: 0.9rem;
  }
}
</style>