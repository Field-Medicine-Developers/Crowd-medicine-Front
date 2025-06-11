<script>
export default {
  props: {
    setting: {
      type: Object,
      required: true,
      default: () => ({
        logoFullUrl: '',
        siteName: '',
        address: '',
        phone: '+9647830200030', // تم إضافة رقم الهاتف هنا
        email: 'mgm@int-mgm.org', // تم إضافة البريد الإلكتروني هنا
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      })
    },
    logo: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    safeSetting() {
      return {
        logoFullUrl: this.setting?.logoFullUrl || '',
        siteName: this.setting?.siteName || 'Site Name',
        address: this.setting?.address || '',
        phone: this.setting?.phone || '+9647830200030', // تم إضافة رقم الهاتف هنا
        email: this.setting?.email || 'mgm@int-mgm.org', // تم إضافة البريد الإلكتروني هنا
        facebook: this.setting?.facebook || '',
        twitter: this.setting?.twitter || '',
        instagram: this.setting?.instagram || '',
        linkedin: this.setting?.linkedin || ''
      }
    },
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    getLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian"
      };
      const prefix = languageMap[this.$i18n.locale];
      return this.setting[`${prefix}${field}`] || "";
    }
  }
};
</script>

<template>
  <footer class="footer">
    <div class="footer-decoration"></div>
    <div class="container">
      <div class="footer-content">
        <div class="row footer-main">
          <!-- Logo and Social Media -->
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-widget">
              <div class="footer-logo-container">
                <img v-if="logo" :src="logo" alt="Logo" class="footer-logo" />
                <div v-else class="logo-placeholder">
                  <i class="fa fa-image"></i>
                </div>
              </div>
              <p class="footer-description" v-html="getLocalized('FooterDescription')"></p>
              <div class="footer-social">
                <a v-if="safeSetting.facebook" :href="safeSetting.facebook" target="_blank" class="social-link">
                  <i class="fa fa-facebook"></i>
                </a>
                <a v-if="safeSetting.twitter" :href="safeSetting.twitter" target="_blank" class="social-link">
                  <i class="fas fa-twitter"></i>
                </a>
                <a v-if="safeSetting.instagram" :href="safeSetting.instagram" target="_blank" class="social-link">
                  <i class="fa fa-instagram"></i>
                </a>
                <a v-if="safeSetting.linkedin" :href="safeSetting.linkedin" target="_blank" class="social-link">
                  <i class="fa fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-widget">
              <h4 class="footer-heading">{{ $t('contactUs') }}</h4>
              <div class="footer-contact">
                <div class="contact-item" v-if="safeSetting.address">
                  <div class="contact-icon">
                    <i class="fa fa-map-marker"></i>
                  </div>
                  <div class="contact-text">{{ safeSetting.address }}</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <i class="fab fa-whatsapp"></i>
                  </div>
                  <div class="contact-text">
                    <a href="https://wa.me/9647877799669"> +964 7877799669  </a>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <i class="fa fa-envelope"></i>
                  </div>
                  <div class="contact-text">
                    <a href="mailto:mgm@int-mgm.org">mgm@int-mgm.org</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-widget">
              <h4 class="footer-heading">{{ $t('quickLinks') }}</h4>
              <ul class="links-list">
                <li class="link-item">
                  <router-link to="/" class="footer-link">
                    <i class="fa fa-angle-left link-icon"></i>
                    <span>{{ $t('home') }}</span>
                  </router-link>
                </li>
                <li class="link-item">
                  <router-link to="/blog" class="footer-link">
                    <i class="fa fa-angle-left link-icon"></i>
                    <span>{{ $t('blog') }}</span>
                  </router-link>
                </li>
                <li class="link-item">
                  <a href="#conferenceVersions" class="footer-link">
                    <i class="fa fa-angle-left link-icon"></i>
                    <span>{{ $t('conferenceVersions') }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="footer-bottom">
          <div class="footer-divider"></div>
          <p class="copyright">&copy; {{ currentYear }} {{ $t('allRightsReserved') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, #195015 0%, #195015 100%);
  position: relative;
  overflow: hidden;
  padding: 4rem 0 2rem;
  color: #fff;
}

.footer-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: 0;
}

.footer-content {
  position: relative;
  z-index: 1;
}

.footer-widget {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.footer-widget:hover {
  transform: translateY(-5px);
}

.footer-logo-container {
  width: 150px;
  height: 150px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.footer-logo {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.footer-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.footer-social {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  color: #fff;
}

.footer-heading {
  color: #fff;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.8rem;
  font-weight: 600;
}

.footer-heading::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.footer-contact {
  width: 100%;
}

.contact-item {
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.contact-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.contact-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.contact-text a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-text a:hover {
  color: #fff;
  text-decoration: underline;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.link-item {
  margin-bottom: 1rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}

.footer-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.link-icon {
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.footer-link:hover .link-icon {
  transform: scale(1.2);
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  margin: 2rem 0;
}

.footer-bottom {
  text-align: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

/* Responsive styles */
@media (max-width: 991px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }
  
  .footer-widget {
    padding: 1.5rem;
  }
}

@media (max-width: 767px) {
  .footer-logo-container {
    width: 120px;
    height: 120px;
  }
  
  .footer-heading {
    font-size: 1.2rem;
  }
  
  .social-link,
  .contact-icon {
    width: 36px;
    height: 36px;
  }
}

/* RTL Support */
[dir="rtl"] .footer-link:hover {
  transform: translateX(-5px);
}

[dir="rtl"] .link-icon {
  transform: rotate(180deg);
}

.contact-item .fab.fa-whatsapp {
  color: #25D366;
  font-size: 1.2rem;
}

.contact-item a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-item a:hover {
  color: #fff;
  text-decoration: none;
}

.contact-item a[href^="https://wa.me"] {
  color: #25D366;
}

.contact-item a[href^="https://wa.me"]:hover {
  color: #128C7E;
}

.contact-text {
  direction: ltr;
}
</style>