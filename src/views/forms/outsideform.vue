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
        <label for="languageSelect" class="form-label">{{ $t("selectLanguage") }}</label>
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
                  @input="validateFullName"
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
                <div class="terms-checkbox">
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
              </div>

              <div class="col-12">
                <div class="turnstile-section">
                  <h5 class="section-title">{{ $t("securityVerification") }}</h5>

                  <div v-if="$isDevelopment" class="debug-info mb-2">
                    <small class="text-muted">
                      Script: {{ turnstileScriptLoaded ? 'Loaded' : 'Not loaded' }} |
                      Widget: {{ turnstileLoaded ? 'Ready' : 'Not ready' }} |
                      Token: {{ turnstileToken ? 'Present' : 'Missing' }}
                    </small>
                  </div>

                  <div class="turnstile-container">
                    <div id="turnstile-widget" class="turnstile-widget"></div>

                    <div v-if="!turnstileLoaded && !turnstileError" class="text-center">
                      <b-spinner small class="me-2"></b-spinner>
                      <span>{{ $t("loadingVerification") }}</span>
                    </div>

                    <div v-else-if="turnstileError" class="alert alert-warning">
                      <div class="d-flex align-items-center justify-content-between">
                        <div>
                          <i class="fa fa-exclamation-triangle me-2"></i>
                          {{ turnstileError }}
                        </div>
                        <b-button
                          size="sm"
                          variant="outline-primary"
                          @click="handleReloadTurnstile"
                          :disabled="isSubmitting"
                        >
                          <i class="fa fa-refresh me-1"></i>
                          {{ $t("retry") }}
                        </b-button>
                      </div>
                    </div>

                    <div v-else-if="turnstileToken" class="alert alert-success">
                      <i class="fa fa-check-circle me-2"></i>
                      {{ $t("verificationComplete") }}
                    </div>
                  </div>

                  <div class="mt-2">
                    <small class="text-muted">
                      {{ $t("turnstileHelpText") }}
                    </small>
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
      turnstileSiteKey: "0x4AAAAAABgha0gsIlInCX7u",
      turnstileScriptLoaded: false,
      turnstileToken: null,
      turnstileWidgetId: null,
      turnstileLoaded: false,
      turnstileError: null,
      turnstileRetryCount: 0,
      maxRetries: 3,
      maxFileSize: 5 * 1024 * 1024,
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
        this.handleReloadTurnstile();
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
        if (window.turnstile) {
          this.turnstileScriptLoaded = true;
          this.turnstileLoaded = true;
          await this.initializeTurnstile();
          return;
        }

        console.log("Loading Turnstile script...");
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;

        const loadTimeout = setTimeout(() => {
          console.error("Turnstile script load timeout");
          this.turnstileError = this.$t("turnstileScriptFailed");
          this.toast.error(this.$t("turnstileScriptFailed"));
        }, 10000);

        script.onload = () => {
          clearTimeout(loadTimeout);
          console.log("Turnstile script loaded successfully");
          this.turnstileScriptLoaded = true;
          this.turnstileLoaded = true;
          setTimeout(() => this.initializeTurnstile(), 100);
        };

        script.onerror = () => {
          clearTimeout(loadTimeout);
          console.error("Failed to load Turnstile script");
          this.turnstileError = this.$t("turnstileScriptFailed");
          this.toast.error(this.$t("turnstileScriptFailed"));
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Turnstile:", error);
        this.turnstileError = this.$t("turnstileScriptFailed");
        this.toast.error(this.$t("turnstileScriptFailed"));
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
        console.log("Initializing Turnstile widget...");

        const siteKey = this.turnstileSiteKey.trim();
        if (!siteKey || siteKey.length < 10) {
          throw new Error("Invalid site key");
        }

        this.turnstileWidgetId = window.turnstile.render("#turnstile-widget", {
          sitekey: siteKey,
          theme: "auto",
          size: "normal",
          language: this.getLanguageCode(),
          callback: (token) => {
            console.log("Turnstile token received:", token);
            this.turnstileToken = token;
            this.turnstileError = null;
            this.turnstileRetryCount = 0;
          },
          "error-callback": (errorCode) => {
            console.error("Turnstile error:", errorCode);
            this.handleTurnstileError(errorCode);
          },
          "expired-callback": () => {
            console.log("Turnstile token expired");
            this.turnstileToken = null;
            this.turnstileError = this.$t("turnstileExpired");
            this.toast.error(this.$t("turnstileExpired"));
            this.resetTurnstile();
          },
          "timeout-callback": () => {
            console.log("Turnstile timeout");
            this.turnstileToken = null;
            this.turnstileError = this.$t("timeoutError");
            this.toast.error(this.$t("timeoutError"));
            this.resetTurnstile();
          },
          "unsupported-callback": () => {
            console.error("Turnstile unsupported");
            this.turnstileError = this.$t("turnstileUnsupported");
            this.toast.error(this.$t("turnstileUnsupported"));
          },
        });

        if (!this.turnstileWidgetId) {
          throw new Error("Failed to initialize Turnstile widget");
        }

        console.log("Turnstile initialized with ID:", this.turnstileWidgetId);
      } catch (error) {
        console.error("Error initializing Turnstile:", error);
        this.turnstileError = this.$t("turnstileInitFailed");
        this.toast.error(this.$t("turnstileInitFailed"));

        if (this.turnstileRetryCount < this.maxRetries) {
          this.turnstileRetryCount++;
          console.log(`Retrying Turnstile initialization (${this.turnstileRetryCount}/${this.maxRetries})...`);
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
        600010: this.$t("turnstileInternalError"),
        600020: this.$t("turnstileInternalError"),
        600030: this.$t("turnstileInternalError"),
      };

      const message = errorMessages[errorCode] || this.$t("turnstileUnknownError", { code: errorCode });
      this.turnstileError = message;
      this.toast.error(message);

      console.error("Turnstile Error Details:", {
        errorCode,
        message,
        siteKey: this.turnstileSiteKey,
        language: this.getLanguageCode(),
      });

      const retryableErrors = [300010, 300020, 300030, 600010, 600020];
      if (retryableErrors.includes(errorCode) && this.turnstileRetryCount < this.maxRetries) {
        this.turnstileRetryCount++;
        console.log(`Retrying after error ${errorCode} (${this.turnstileRetryCount}/${this.maxRetries})...`);
        setTimeout(() => this.resetTurnstile(), 3000);
      }
    },
    resetTurnstile() {
      if (window.turnstile && this.turnstileWidgetId) {
        try {
          window.turnstile.reset(this.turnstileWidgetId);
          console.log("Turnstile widget reset");
          this.turnstileError = null;
        } catch (error) {
          console.error("Error resetting Turnstile:", error);
          this.handleReloadTurnstile();
        }
      }
    },
    async handleReloadTurnstile() {
      this.cleanupTurnstile();
      this.turnstileToken = null;
      this.turnstileError = null;
      this.turnstileRetryCount = 0;
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.initializeTurnstile();
    },
    cleanupTurnstile() {
      if (window.turnstile && this.turnstileWidgetId) {
        try {
          window.turnstile.remove(this.turnstileWidgetId);
          console.log("Turnstile widget removed");
        } catch (error) {
          console.error("Error removing Turnstile widget:", error);
          const container = document.getElementById("turnstile-widget");
          if (container) {
            container.innerHTML = "";
          }
        }
        this.turnstileWidgetId = null;
      }
      this.turnstileToken = null;
    },
    getLanguageCode() {
      const languageMap = { ar: "ar", en: "en", fa: "fa" };
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
      this.termsList = this.$t(termsKey)
        .split("\n")
        .filter((term) => term.trim())
        .map((term) => term.replace(/^- /, ""));
    },
    onPassportFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
          this.formErrors.ThePassport = this.$t("invalidFileExtension");
          this.form.ThePassport = null;
          event.target.value = "";
        } else if (file.size > this.maxFileSize) {
          this.formErrors.ThePassport = this.$t("fileTooLarge");
          this.form.ThePassport = null;
          event.target.value = "";
        } else {
          this.formErrors.ThePassport = "";
          this.form.ThePassport = file;
        }
      }
    },
    onPowerPointChange(event) {
      const file = event.target.files[0];
      if (file) {
        const validTypes = [
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];
        if (!validTypes.includes(file.type)) {
          this.formErrors.PowerPoint = this.$t("invalidPowerPointExtension");
          this.form.PowerPoint = null;
          event.target.value = "";
        } else if (file.size > this.maxFileSize) {
          this.formErrors.PowerPoint = this.$t("fileTooLarge");
          this.form.PowerPoint = null;
          event.target.value = "";
        } else {
          this.formErrors.PowerPoint = "";
          this.form.PowerPoint = file;
        }
      }
    },
    validateFullName() {
      if (this.form.fullName && this.form.fullName.trim().length < 3) {
        this.formErrors.fullName = this.$t("fullNameInvalid");
      } else {
        this.formErrors.fullName = "";
      }
    },
    validateForm() {
      this.formErrors = {};
      let isValid = true;

      if (!this.form.fullName || this.form.fullName.trim().length < 3) {
        this.formErrors.fullName = this.$t("fullNameInvalid");
        isValid = false;
      }

      if (!this.form.Country) {
        this.formErrors.Country = this.$t("requiredField");
        isValid = false;
      }

      if (!this.form.ThePassport) {
        this.formErrors.ThePassport = this.$t("requiredFile");
        isValid = false;
      }

      if (!this.form.PowerPoint) {
        this.formErrors.PowerPoint = this.$t("requiredFile");
        isValid = false;
      }

      if (!this.form.termsAgreed) {
        this.formErrors.termsAgreed = this.$t("mustAgreeToTerms");
        isValid = false;
      }

      if (!this.turnstileToken) {
        this.turnstileError = this.$t("turnstileRequired");
        console.error("Turnstile validation failed:", {
          token: this.turnstileToken,
          widgetId: this.turnstileWidgetId,
          loaded: this.turnstileLoaded,
        });
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
        await this.submitFormData(authToken);
        this.isSubmitted = true;
        this.toast.success(this.$t("formSubmittedSuccessfully"));
      } catch (error) {
        console.error("Form submission error:", error);
        if (error.response?.status === 400) {
          this.toast.error(this.$t("invalidData"));
        } else if (error.response?.status === 401) {
          this.toast.error(this.$t("authTokenExpired"));
        } else if (error.code === "ERR_NETWORK") {
          this.toast.error(this.$t("networkError"));
          if (this.turnstileRetryCount < this.maxRetries) {
            this.turnstileRetryCount++;
            setTimeout(() => this.submitForm(), 1000);
          }
        } else {
          this.toast.error(this.$t("errorOccurred"));
        }
        this.resetTurnstile();
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitFormData(authToken) {
      console.log("Submitting form data...");
      const formData = new FormData();
      formData.append("FullName", this.form.fullName.trim());
      formData.append("Country", this.form.Country);
      formData.append("ThePassport", this.form.ThePassport);
      formData.append("PowerPoint", this.form.PowerPoint);
      formData.append("ConferenceVersionID", this.form.ConferenceVersionID);
      formData.append("CaptchaToken", this.turnstileToken);

      const noteField =
        this.$i18n.locale === "ar"
          ? "ArNote"
          : this.$i18n.locale === "en"
          ? "EnNote"
          : "PeNote";
      formData.append(noteField, this.form.Note.trim());

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

      try {
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
        if (response.status !== 200) {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
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
  font-family: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "Cairo" : "Roboto"'),
    sans-serif;
  direction: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "rtl" : "ltr"');
}

.conference-header {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
  padding: 2rem 1rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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
  padding-left: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "0" : "1.5rem"');
  padding-right: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "1.5rem" : "0"');
  margin-bottom: 1rem;
  color: #2c3e50;
}

.terms-list li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.6;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.terms-checkbox :deep(.custom-control-label) {
  margin-left: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "0.5rem" : "0"');
  margin-right: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "0" : "0.5rem"');
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

.turnstile-section {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.turnstile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  margin: 1rem 0;
  position: relative;
}

.turnstile-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 65px;
  width: 100%;
}

[dir="rtl"] .turnstile-container,
[dir="rtl"] .turnstile-widget {
  direction: ltr;
}

.turnstile-widget iframe {
  border: none !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.debug-info {
  padding: 0.5rem;
  background-color: #e9ecef;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.8rem;
}

.alert {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.btn-outline-primary {
  border-color: #195015;
  color: #195015;
}

.btn-outline-primary:hover {
  background-color: #195015;
  border-color: #195015;
  color: white;
}

.me-2 {
  margin-right: 0.5rem !important;
}

.me-1 {
  margin-right: 0.25rem !important;
}

[dir="rtl"] .me-2 {
  margin-right: 0 !important;
  margin-left: 0.5rem !important;
}

[dir="rtl"] .me-1 {
  margin-right: 0 !important;
  margin-left: 0.25rem !important;
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

  .turnstile-container {
    min-height: 70px;
  }

  .turnstile-section {
    padding: 0.75rem;
  }

  .debug-info {
    font-size: 0.7rem;
    padding: 0.25rem;
  }
}
</style>