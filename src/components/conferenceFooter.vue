<script>
export default {
  props: {
    logo: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    heroDec: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      contactEmail: 'mgm@int-mgm.org',
      contactPhone: '+964 7877799669'
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<template>
  <footer
    class="footer"
    :style="{
      'background-image': 'url(' + require('@/assets/images/footer-bg.png') + ')',
    }"
  >
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-lg-4 text-center footer-logo-container">
          <div class="mb-4">
            <img
              :src="logo"
              alt=""
              class="footer-logo"
              width="200"
            />
            <p class="text-white-50 my-4 footer-description">
              {{ title }} <br>
              <!-- {{ heroDec }} -->
            </p>
            
            <!-- Contact Information -->
            <div class="footer-contact">
              <div class="contact-item">
                <i class="fa fa-envelope"></i>
                <a :href="'mailto:' + contactEmail" class="text-white-50">{{ contactEmail }}</a>
              </div>
              
              <div class="contact-item">
                <i class="fa fa-whatsapp"></i>
                <a href="https://wa.me/9647877799669" class="text-white-50 text-decoration-none">{{ contactPhone }}</a>
              </div>

            
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="footer-divider"></div>
          <div class="text-center mt-3">
            <p class="text-white-50 f-15 mb-0">
              {{ currentYear }} © جميع الحقوق محفوظة لمعاونية شؤون الطبابة والمقاتلين والمضحين
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.text-decoration-none{
  direction: ltr;
}
.footer-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer {
  padding: 4rem 0 2rem;
  background-size: cover;
  background-position: center;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #195015;
  z-index: 0;
  color: white;
}

.footer .container {
  position: relative;
  z-index: 1;
}

.footer-logo {
  max-width: 200px;
  height: auto;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}

.footer-description {
  margin: 1.5rem 0;
  font-size: 0.95rem;
  line-height: 1.7;
  text-align: justify;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
}

.contact-item i {
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.contact-item:hover i {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.contact-item a {
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-item a:hover {
  color: #fff !important;
  text-decoration: underline;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  margin: 2rem 0 1rem;
}

/* RTL Support */
[dir="rtl"] .footer-description {
  text-align: center;
}

/* Responsive Styles */
@media (max-width: 767px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }
  
  .footer-logo {
    max-width: 288%;
  }
  
  .footer-description {
    font-size: 0.9rem;
  }
}
</style>