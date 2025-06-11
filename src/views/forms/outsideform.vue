<template>
  <div>
    <div class="container">
      <div class="conference-header mb-5">
        <div class="container-fluid">
          <div class="header-content d-flex align-items-center">
            <div class="logo-container ms-auto">
              <img
                :src="setting.logoFullUrl || fallbackLogo"
                alt="Logo"
                class="logo-img"
              />
            </div>
            <div class="title-container text-center">
              <h1 class="conference-title">{{ $t("heroTitle") }}</h1>
              <p class="conference-subtitle">{{ $t("heroSubTitle") }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="language-selector mb-4">
        <label for="languageSelect" class="form-label">{{
          $t("selectLanguage")
        }}</label>
        <select
          id="languageSelect"
          v-model="$i18n.locale"
          class="form-select w-auto"
          @change="updateDirection"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="fa">فارسی</option>
        </select>
      </div>

      <div v-if="isSubmitted" class="text-center success-message">
        <i class="fa fa-check-circle fa-3x text-success mb-3"></i>
        <h4>{{ $t("formSubmittedSuccessfully") }}</h4>
        <p>{{ $t("thankYouMessage") }}</p>
        <b-button variant="primary" @click="resetForm" class="mt-3">
          {{ $t("submitAnother") }}
        </b-button>
      </div>

      <b-card v-else no-body class="shadow-lg">
        <b-card-header class="bg-gradient-primary text-white py-3">
          <h4 class="mb-0">
            <i class="fa fa-user-plus mr-2"></i>
            {{ $t("formDescription") }}
          </h4>
        </b-card-header>
        <b-card-body>
          <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <div class="row g-3">
              <div class="col-12">
                <h5 class="section-title">{{ $t("personalInformation") }}</h5>
              </div>

              <b-form-group
                class="col-md-6"
                :label="
                  $t('fullName') +
                  ($i18n.locale === 'ar'
                    ? ` (${$t('ArabicFullName')})`
                    : $i18n.locale === 'en'
                    ? ` (${$t('EnglishFullName')})`
                    : ` (${$t('PersianFullName')})`) +
                  ' *'
                "
                label-for="fullName"
              >
                <b-form-input
                  id="fullName"
                  v-model="form.fullName"
                  :placeholder="$t('fullNamePlaceholder')"
                  required
                  :state="formErrors.fullName ? false : null"
                ></b-form-input>
                <b-form-invalid-feedback v-if="formErrors.fullName">{{
                  formErrors.fullName
                }}</b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                class="col-md-6"
                :label="$t('country') + ' *'"
                label-for="country"
              >
                <b-form-select
                  id="country"
                  v-model="form.Country"
                  :options="countries"
                  required
                  :state="formErrors.Country ? false : null"
                ></b-form-select>
                <b-form-invalid-feedback v-if="formErrors.Country">{{
                  formErrors.Country
                }}</b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                class="col-md-6"
                :label="$t('ThePassport') + ' *'"
                label-for="passport"
              >
                <b-form-file
                  id="passport"
                  v-model="form.ThePassport"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  :state="formErrors.ThePassport ? false : null"
                  @change="onPassportFileChange"
                ></b-form-file>
                <b-form-invalid-feedback v-if="formErrors.ThePassport">{{
                  formErrors.ThePassport
                }}</b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                class="col-md-6"
                :label="$t('powerPoint') + ' *'"
                label-for="powerPoint"
              >
                <b-form-file
                  id="powerPoint"
                  v-model="form.PowerPoint"
                  accept=".ppt,.pptx"
                  required
                  :state="formErrors.PowerPoint ? false : null"
                  @change="onPowerPointChange"
                ></b-form-file>
                <b-form-invalid-feedback v-if="formErrors.PowerPoint">{{
                  formErrors.PowerPoint
                }}</b-form-invalid-feedback>
              </b-form-group>

              <div class="col-12">
                <h5 class="section-title">{{ $t("notes") }}</h5>
              </div>

              <b-form-group
                class="col-md-12"
                :label="
                  $i18n.locale === 'ar'
                    ? $t('ArNote')
                    : $i18n.locale === 'en'
                    ? $t('EnNote')
                    : $t('PeNote')
                "
                label-for="note"
              >
                <b-form-textarea
                  id="note"
                  v-model="form.Note"
                  :placeholder="$t('NotePlaceholder')"
                  rows="5"
                ></b-form-textarea>
              </b-form-group>

              <div class="col-12">
                <h5 class="section-title">{{ $t("termsAndConditions") }}</h5>
                <ul class="terms-list">
                  <li v-for="(term, index) in termsList" :key="index">
                    {{ term }}
                  </li>
                </ul>
                <b-form-checkbox
                  v-model="form.termsAgreed"
                  required
                  :state="formErrors.termsAgreed ? false : null"
                >
                  {{ $t("iAgree") }}
                </b-form-checkbox>
                <b-form-invalid-feedback v-if="formErrors.termsAgreed">{{
                  formErrors.termsAgreed
                }}</b-form-invalid-feedback>
              </div>

              
              <div class="col-12">
                <div class="turnstile-section">
                  <h5 class="section-title">
                    {{ $t("securityVerification") }}
                  </h5>
                  <div class="turnstile-container">
                    <div id="turnstile-widget"></div>
                  </div>
                  <div v-if="turnstileError" class="alert alert-danger mt-2">
                    {{ turnstileError }}
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end mt-4">
                <b-button
                  type="submit"
                  variant="primary"
                  size="lg"
                  :disabled="!isFormValid || isSubmitting || !turnstileToken"
                  class="submit-btn"
                >
                  <b-spinner small v-if="isSubmitting" class="mr-2"></b-spinner>
                  <i v-else class="fa fa-paper-plane mr-2"></i>
                  {{ isSubmitting ? $t("submitting") : $t("submit") }}
                </b-button>
              </div>
            </div>
          </form>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toast-notification";
import {
  BCard,
  BCardHeader,
  BCardBody,
  BButton,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormFile,
  BFormTextarea,
  BFormInvalidFeedback,
  BSpinner,
} from "bootstrap-vue-next";
import countries from "@/assets/data/countries.json";

export default {
  name: "ConferenceForm",
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BButton,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormFile,
    BFormTextarea,
    BFormInvalidFeedback,
    BSpinner,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  props: {
    setting: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        fullName: "",
        Country: "",
        ThePassport: null,
        PowerPoint: null,
        Note: "",
        ConferenceVersionID: 3,
        termsAgreed: false,
      },
      formErrors: {},
      isSubmitting: false,
      isSubmitted: false,
      fallbackLogo:
        "https://api.int-mgm.org/images/settings/84ccf070-9a30-4559-b86c-3c6512c09764.png",
      countries: [
        { value: "", text: this.$t("chooseCountry") },
        ...countries.countries,
      ],
      termsList: [],

      turnstileSiteKey: "1x00000000000000000000AA",
      turnstileToken: null,
      turnstileWidgetId: null,
      turnstileLoaded: false,
      turnstileError: null,
      turnstileRetryCount: 0,
      maxRetries: 3,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.fullName &&
        this.form.Country &&
        this.form.ThePassport &&
        this.form.PowerPoint &&
        this.form.termsAgreed &&
        this.turnstileToken
      );
    },
  },
  watch: {
    "$i18n.locale": {
      handler(newLocale) {
        this.updateTermsList(newLocale);
        this.updateDirection();
        // إعادة تحميل Turnstile باللغة الجديدة
        this.reloadTurnstile();
      },
      immediate: true,
    },
  },
  mounted() {
    this.initializeComponent();
  },
  beforeUnmount() {
    this.cleanupTurnstile();
  },
  methods: {
    async initializeComponent() {
      this.updateDirection();
      await this.loadTurnstileScript();
    },

    async loadTurnstileScript() {
      try {
        // تحقق من وجود السكربت مسبقاً
        if (window.turnstile) {
          this.turnstileLoaded = true;
          await this.initializeTurnstile();
          return;
        }

        console.log(" Loading Turnstile script...");

        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;

        const loadPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            console.log("✅ Turnstile script loaded successfully");
            this.turnstileLoaded = true;
            resolve();
          };

          script.onerror = (error) => {
            console.error(" Failed to load Turnstile script:", error);
            this.turnstileError = this.$t("turnstileScriptFailed");
            reject(error);
          };
        });

        document.head.appendChild(script);
        await loadPromise;
        await new Promise((resolve) => setTimeout(resolve, 500));
        await this.initializeTurnstile();
      } catch (error) {
        console.error(" Error loading Turnstile:", error);
        this.turnstileError = this.$t("turnstileScriptFailed");
      }
    },

    async initializeTurnstile() {
      try {
        if (!window.turnstile) {
          throw new Error("Turnstile not available");
        }
        this.cleanupTurnstile();
        const container = document.getElementById("turnstile-widget");
        if (!container) {
          throw new Error("Turnstile container not found");
        }

        container.innerHTML = "";

        console.log(" Initializing Turnstile widget...");

        const options = {
          sitekey: this.turnstileSiteKey,
          theme: "auto",
          size: "normal",
          language: this.getLanguageCode(),

          callback: (token) => {
            console.log(" Turnstile token received");
            this.turnstileToken = token;
            this.turnstileError = null;
            this.turnstileRetryCount = 0;
          },

          "error-callback": (errorCode) => {
            console.error(" Turnstile error:", errorCode);
            this.handleTurnstileError(errorCode);
          },

          "expired-callback": () => {
            console.log(" Turnstile token expired");
            this.turnstileToken = null;
            this.turnstileError = this.$t("turnstileExpired");
            this.resetTurnstile();
          },

          "timeout-callback": () => {
            console.log(" Turnstile timeout");
            this.turnstileToken = null;
            this.turnstileError = this.$t("turnstileTimeout");
            this.resetTurnstile();
          },
        };

        this.turnstileWidgetId = window.turnstile.render(
          "#turnstile-widget",
          options
        );

        if (this.turnstileWidgetId) {
          console.log(
            " Turnstile initialized successfully with ID:",
            this.turnstileWidgetId
          );
        } else {
          throw new Error("Failed to initialize Turnstile widget");
        }
      } catch (error) {
        console.error(" Error initializing Turnstile:", error);
        this.turnstileError = this.$t("turnstileInitFailed");

        if (this.turnstileRetryCount < this.maxRetries) {
          this.turnstileRetryCount++;
          console.log(
            `🔄 Retrying Turnstile initialization (${this.turnstileRetryCount}/${this.maxRetries})...`
          );
          setTimeout(() => this.initializeTurnstile(), 2000);
        }
      }
    },

    handleTurnstileError(errorCode) {
      this.turnstileToken = null;

      const errorMessages = {
        110100: this.$t("turnstileDomainError"),
        110200: this.$t("turnstileSiteKeyError"),
        110420: this.$t("turnstileActionError"),
        300010: this.$t("turnstileNetworkError"),
        300020: this.$t("turnstileGenericError"),
        300030: this.$t("turnstileTimeoutError"),
      };

      const message =
        errorMessages[errorCode] ||
        this.$t("turnstileUnknownError", { code: errorCode });
      this.turnstileError = message;

      console.error("Turnstile Error Details:", { errorCode, message });

      const retryableErrors = [300010, 300020, 300030];
      if (
        retryableErrors.includes(errorCode) &&
        this.turnstileRetryCount < this.maxRetries
      ) {
        this.turnstileRetryCount++;
        setTimeout(() => this.resetTurnstile(), 3000);
      }
    },

    resetTurnstile() {
      if (window.turnstile && this.turnstileWidgetId) {
        try {
          window.turnstile.reset(this.turnstileWidgetId);
          console.log(" Turnstile widget reset");
          this.turnstileError = null;
        } catch (error) {
          console.error("Error resetting Turnstile:", error);
          this.reloadTurnstile();
        }
      }
    },

    async reloadTurnstile() {
      this.cleanupTurnstile();
      this.turnstileToken = null;
      this.turnstileError = null;
      this.turnstileRetryCount = 0;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await this.initializeTurnstile();
    },

    cleanupTurnstile() {
      if (window.turnstile && this.turnstileWidgetId) {
        try {
          window.turnstile.remove(this.turnstileWidgetId);
          console.log("🧹 Turnstile widget removed");
        } catch (error) {
          console.log("Error removing Turnstile widget:", error);
        }
        this.turnstileWidgetId = null;
      }
    },

    getLanguageCode() {
      const languageMap = {
        ar: "ar",
        en: "en",
        fa: "fa",
      };
      return languageMap[this.$i18n.locale] || "en";
    },

    updateDirection() {
      const isRTL = ["ar", "fa"].includes(this.$i18n.locale);
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = this.$i18n.locale;
    },

    updateTermsList(locale) {
      const termsKey =
        locale === "ar"
          ? "iAgreeToTermsOutside_ar"
          : locale === "en"
          ? "iAgreeToTermsOutside_en"
          : "iAgreeToTermsOutside_fa";

      const termsText = this.$t(termsKey);
      this.termsList = termsText
        .split("\n")
        .filter((term) => term.trim())
        .map((term) => term.replace(/^- /, ""));
    },

    onPassportFileChange(event) {
      const file = event.target.files[0];
      if (
        file &&
        !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
      ) {
        this.formErrors.ThePassport = this.$t("invalidFileExtension");
        this.form.ThePassport = null;
        event.target.value = "";
      } else {
        this.formErrors.ThePassport = "";
        this.form.ThePassport = file;
      }
    },

    onPowerPointChange(event) {
      const file = event.target.files[0];
      const validTypes = [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (file && !validTypes.includes(file.type)) {
        this.formErrors.PowerPoint = this.$t("invalidPowerPointExtension");
        this.form.PowerPoint = null;
        event.target.value = "";
      } else {
        this.formErrors.PowerPoint = "";
        this.form.PowerPoint = file;
      }
    },

    validateForm() {
      this.formErrors = {};
      let isValid = true;

      const requiredFields = [
        { field: "fullName", message: this.$t("requiredField") },
        { field: "Country", message: this.$t("requiredField") },
        { field: "ThePassport", message: this.$t("requiredFile") },
        { field: "PowerPoint", message: this.$t("requiredFile") },
      ];

      requiredFields.forEach(({ field, message }) => {
        if (!this.form[field]) {
          this.formErrors[field] = message;
          isValid = false;
        }
      });

      if (!this.form.termsAgreed) {
        this.formErrors.termsAgreed = this.$t("mustAgreeToTerms");
        isValid = false;
      }

      if (!this.turnstileToken) {
        this.turnstileError = this.$t("turnstileRequired");
        isValid = false;
      }

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        this.toast.error(this.$t("pleaseFillAllRequiredFields"));
        return;
      }

      this.isSubmitting = true;

      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          this.toast.error(this.$t("authTokenMissing"));
          return;
        }

        await this.verifyCaptcha(authToken);

        await this.submitFormData(authToken);
      } catch (error) {
        console.error(" Form submission error:", error);

        if (error.response?.status === 400) {
          this.toast.error(this.$t("invalidData"));
        } else if (error.response?.status === 401) {
          this.toast.error(this.$t("authTokenExpired"));
        } else {
          this.toast.error(this.$t("errorOccurred"));
        }
        this.resetTurnstile();
      } finally {
        this.isSubmitting = false;
      }
    },

    async verifyCaptcha(authToken) {
      console.log(" Verifying Turnstile token...");

      const formData = new FormData();
      formData.append("token", this.turnstileToken);

      const response = await axios.post(
        "https://api.int-mgm.org/api/Auth/VerifyCaptcha",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
          timeout: 15000,
        }
      );

      console.log(" Captcha verification response:", response.data);

      if (!response.data.success) {
        throw new Error("Captcha verification failed");
      }
    },

    async submitFormData(authToken) {
      console.log(" Submitting form data...");

      const formData = new FormData();

      formData.append("FullName", this.form.fullName);
      formData.append("Country", this.form.Country);
      formData.append("ThePassport", this.form.ThePassport);
      formData.append("PowerPoint", this.form.PowerPoint);
      formData.append("ConferenceVersionID", this.form.ConferenceVersionID);

      const noteField =
        this.$i18n.locale === "ar"
          ? "ArNote"
          : this.$i18n.locale === "en"
          ? "EnNote"
          : "PeNote";
      formData.append(noteField, this.form.Note || "");

      const additionalFields = {
        ArFacilityFullName: "",
        EnFacilityFullName: "",
        PeFacilityFullName: "",
        RelationshipFacilities: "0",
        TheFacilityPassport: "",
        ResidencyStartDate: "",
        ResidencyEndDate: "",
        IsProposedTrip: "false",
        TripDate: "",
        FlightDetails: "",
      };

      Object.entries(additionalFields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.post(
        "https://api.int-mgm.org/api/OutsideIraq/AddInformationOutsideIraq",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
          timeout: 30000,
        }
      );

      if (response.status === 200) {
        console.log(" Form submitted successfully");
        this.isSubmitted = true;
        this.toast.success(this.$t("formSubmittedSuccessfully"));
      }
    },

    resetForm() {
      this.form = {
        fullName: "",
        Country: "",
        ThePassport: null,
        PowerPoint: null,
        Note: "",
        ConferenceVersionID: 3,
        termsAgreed: false,
      };

      this.formErrors = {};
      this.isSubmitted = false;
      this.turnstileError = null;

      document.querySelectorAll('input[type="file"]').forEach((input) => {
        input.value = "";
      });

      this.resetTurnstile();
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap");

.container {
  max-width: 1400px;
  font-family: v-bind(
      '$i18n.locale === "ar" || $i18n.locale === "fa" ? "Cairo" : "Roboto"'
    ),
    sans-serif;
  direction: v-bind(
    '$i18n.locale === "ar" || $i18n.locale === "fa" ? "rtl" : "ltr"'
  );
}

.navbar-custom {
  background: linear-gradient(135deg, #195015 0%, #2c7a2c 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  z-index: 1000;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.logo-img {
  height: 100px;
  max-width: 130px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: all 0.4s ease;
}

.logo-container:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.logo-container:hover .logo-img {
  transform: scale(1.05);
}

.conference-header {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
  padding: 2rem 1rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.conference-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.conference-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.title-container {
  flex-grow: 1;
  text-align: center;
}

.conference-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.conference-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
}

.bg-gradient-primary {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
}

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #195015;
  margin-bottom: 1rem;
  border-bottom: 2px solid #195015;
  padding-bottom: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #195015;
  box-shadow: 0 0 0 0.2rem rgba(25, 80, 21, 0.25);
}

.btn-primary {
  background-color: #195015;
  border-color: #195015;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #2c7a2c;
  border-color: #2c7a2c;
  transform: scale(1.05);
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.invalid-feedback {
  display: block;
  font-size: 80%;
  color: #dc3545;
}

.terms-list {
  list-style-type: disc;
  padding-left: v-bind(
    '$i18n.locale === "ar" || $i18n.locale === "fa" ? "0" : "1.5rem"'
  );
  padding-right: v-bind(
    '$i18n.locale === "ar" || $i18n.locale === "fa" ? "1.5rem" : "0"'
  );
  margin-bottom: 1rem;
  color: #2c3e50;
}

.terms-list li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.6;
}

.success-message {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.success-message h4 {
  color: #195015;
  font-weight: 600;
}

.success-message p {
  color: #2c3e50;
  font-size: 1rem;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

@media (max-width: 768px) {
  .conference-header {
    padding: 1.5rem 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
  }

  .title-container {
    margin-bottom: 1rem;
  }

  .conference-title {
    font-size: 1.8rem;
  }

  .conference-subtitle {
    font-size: 1.1rem;
  }

  .logo-img {
    height: 50px;
    max-width: 100px;
  }

  .logo-container {
    margin-left: 0;
  }
}
.turnstile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 65px;
  margin: 1rem 0;
}

/* للغات RTL */
[dir="rtl"] .turnstile-container {
  direction: ltr; /* Turnstile يعمل بشكل أفضل مع LTR */
}
</style>
