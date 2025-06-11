<template>
  <section class="section" id="submitResearch">
    <div class="container">

      <div class="row mb-4">
        <div class="col-lg-12">
          <div v-if="!isRegistrationActive" class="registration-closed-alert">
            <div class="alert alert-danger" role="alert">
              <i class="fa fa-exclamation-triangle me-2"></i>
              {{ $t("registrationClosed") }}
            </div>
          </div>
          <div v-else-if="endTimeRemaining" class="countdown-container">
            <div class="alert alert-info" role="alert">
              <i class="fa fa-clock me-2"></i>
              {{ $t("registrationClosesIn") }}:
              <div class="countdown-timer">
                <div class="countdown-item">
                  <span class="countdown-value">{{ endTimeRemaining.days }}</span>
                  <span class="countdown-label">{{ $t("days") }}</span>
                </div>
                <div class="countdown-item">
                  <span class="countdown-value">{{ endTimeRemaining.hours }}</span>
                  <span class="countdown-label">{{ $t("hours") }}</span>
                </div>
                <div class="countdown-item">
                  <span class="countdown-value">{{ endTimeRemaining.minutes }}</span>
                  <span class="countdown-label">{{ $t("minutes") }}</span>
                </div>
                <div class="countdown-item">
                  <span class="countdown-value">{{ endTimeRemaining.seconds }}</span>
                  <span class="countdown-label">{{ $t("seconds") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div class="row mb-4" v-if="setting.arabicTerms || setting.englishTerms || setting.persianTerms">
        <div class="col-lg-12">
          <div class="terms-agreement-container">
            <h4 class="terms-title mb-3">{{ $t("termsAndConditions") }}</h4>
            <div class="terms-content" v-html="getCurrentLanguageTerms"></div>
            <div class="form-check mt-3">
              <input class="form-check-input" type="checkbox" v-model="agreedToTerms" id="agreeToTerms">
              <label class="form-check-label mr-2 ml-2" for="agreeToTerms">
                {{ $t("iAgreeToTerms") }}
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Authenticity Pledge Downloads -->
      <div class="pledge-downloads" v-if="conferenceVersionID == 3">
        <div class="pledge-cards">
          <div class="pledge-card" v-for="(pledge, index) in pledgeFiles" :key="index">
            <div class="pledge-icon">
               <i :class="pledge.icon"></i>
            </div>
            <div class="pledge-info">
              <h5>{{ pledge.title }}</h5>
              <p>{{ pledge.description }}</p>
            </div>
            <a :href="pledge.url" class="pledge-download-btn" download>
              <i class="fas fa-download"></i>
              {{ $t("download") }}
            </a>
          </div>
        </div>
      </div>

      <!-- Terms Agreement Section -->
      

      <!-- Registration Status and Countdown -->
   

      <div class="row">
        <div class="col-lg-12">
          <h2 class="fw-bold mb-4">{{ $t("submitResearch") }}</h2>
          <p class="text-muted mb-5">{{ $t("formDescription") }}</p>

          <div :class="{ 'form-disabled': !isRegistrationActive || (setting.terms && !agreedToTerms) }">
            <form method="post" name="myForm" @submit.prevent="submitForm">
              <p id="error-msg" v-if="errorMessage" class="text-danger">
                {{ errorMessage }}
              </p>
              <div v-if="setting.terms && !agreedToTerms" class="alert alert-warning">
                <i class="fa fa-exclamation-triangle me-2"></i>
                {{ $t("pleaseAgreeToTerms") }}
              </div>
              <div id="simple-msg"></div>
              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="fullName" class="text-muted form-label">{{
                      $t("fullName")
                      }}</label>
                    <input v-model="form.fullName" name="fullName" id="fullName" type="text" class="form-control"
                      :placeholder="$t('fullNamePlaceholder')" :class="{ 'is-invalid': formErrors.fullName }" 
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.fullName" class="invalid-feedback">
                      {{ formErrors.fullName }}
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="email" class="text-muted form-label">{{
                      $t("email")
                      }}</label>
                    <input v-model="form.email" name="email" id="email" type="email" class="form-control"
                      :placeholder="$t('emailPlaceholder')" :class="{ 'is-invalid': formErrors.email }" 
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.email" class="invalid-feedback">
                      {{ formErrors.email }}
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="country" class="text-muted form-label">{{
                      $t("country")
                      }}</label>
                    <select
                      v-model="form.countryOfResidence"
                      id="country"
                      name="country"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.countryOfResidence }"
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)"
                    >
                      <option v-for="country in countries" :key="country.value" :value="country.value">
                        {{ country.text }}
                      </option>
                    </select>
                    <div v-if="formErrors.countryOfResidence" class="invalid-feedback">
                      {{ formErrors.country }}
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="workplace" class="text-muted form-label">{{
                      $t("workplace")
                      }}</label>
                    <input v-model="form.workplace" name="workplace" id="workplace" type="text" class="form-control"
                      :placeholder="$t('workplacePlaceholder')" :class="{ 'is-invalid': formErrors.workplace }" 
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.workplace" class="invalid-feedback">
                      {{ formErrors.workplace }}
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="whatsapp" class="text-muted form-label">{{
                      $t("whatsapp")
                      }}</label>
                    <div class="whatsapp-input-container">
                      <div class="whatsapp-input-group">
                        <div class="country-code-selector" @click="toggleCountryList">
                          <div class="selected-country">
                            <div class="country-flag">
                              <img :src="getFlagUrl(selectedCountry)" :alt="selectedCountry" />
                            </div>
                            <span class="selected-code">{{ selectedCountryCode }}</span>
                            <i class="fas fa-chevron-down" :class="{ 'rotate': showCountryList }"></i>
                          </div>
                          <div v-if="showCountryList" class="country-list" @click.stop>
                            <div class="search-box">
                              <i class="fas fa-search"></i>
                              <input 
                                type="text" 
                                v-model="countrySearch" 
                                :placeholder="$t('searchCountry')"
                                @input="filterCountries"
                                @click.stop
                              />
                            </div>
                            <div class="country-items">
                              <div v-for="country in filteredCountries" 
                                   :key="country.code" 
                                   class="country-item"
                                   @click="selectCountryCode(country.code, country.country)">
                                <div class="country-flag">
                                  <img :src="getFlagUrl(country.country)" :alt="country.name" />
                                </div>
                                <span class="country-code">{{ country.code }}</span>
                                <span class="country-name">{{ country.name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="input-wrapper">
                          <input 
                            type="text" 
                            v-model="form.whatsAppNumber"
                            class="form-control whatsapp-input"
                            :class="{ 'is-invalid': formErrors.whatsAppNumber }"
                            :placeholder="$t('phoneNumberPlaceholder')"
                            :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)"
                            @input="validateWhatsAppNumber"
                            @blur="validateWhatsAppNumber"
                          />
                          <i class="fab fa-whatsapp whatsapp-icon"></i>
                        </div>
                      </div>
                      <div v-if="formErrors.whatsAppNumber" class="invalid-feedback">
                        {{ formErrors.whatsAppNumber }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="degree" class="text-muted form-label">{{
                      $t("degree")
                      }}</label>
                    <input v-model="form.academicTitle" name="degree" id="degree" type="text" class="form-control"
                      :placeholder="$t('degreePlaceholder')" :class="{ 'is-invalid': formErrors.academicTitle }" 
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.academicTitle" class="invalid-feedback">
                      {{ formErrors.academicTitle }}
                    </div>
                  </div>
                </div>

                <!-- Languages Section -->
                <div class="col-lg-12">
                  <div class="mb-4">
                    <label class="text-muted form-label">{{ $t("languages") }}</label>
                    
                    <div class="language-list mb-3" v-if="form.languages.length > 0">
                      <div v-for="(lang, index) in form.languages" :key="index" class="language-item">
                        <div class="language-info">
                          <span class="language-name">{{ lang.name }}</span>
                          <span class="language-level">{{ getLevelText(lang.level) }}</span>
                        </div>
                        <button type="button" class="btn-remove-language" @click="removeLanguage(index)"
                          :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)">
                          <i class="fa fa-times"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div class="language-form">
                      <div class="row">
                        <div class="col-lg-6">
                          <select 
                            v-model="newLanguage.name" 
                            class="form-control mb-2" 
                            :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)"
                          >
                            <option value="" disabled>{{ $t('languagePlaceholder') }}</option>
                            <option 
                              v-for="lang in languages" 
                              :key="lang.code" 
                              :value="lang.name"
                            >
                              {{ $i18n.locale === 'ar' ? lang.name : lang.name_en }}
                            </option>
                          </select>
                        </div>
                        <div class="col-lg-6">
                          <BFormSelect 
                            v-model="newLanguage.level" 
                            :options="languageLevels" 
                            class="form-control mb-2"
                            :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)"
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        class="btn btn-sm btn-secondary mt-1"
                        @click="addLanguage"
                        :disabled="!newLanguage.name || newLanguage.level === 0 || !isRegistrationActive || (setting.terms && !agreedToTerms)"
                      >
                        {{ $t("addLanguage") }}
                      </button>
                    </div>
                    
                    <div v-if="formErrors.languages" class="text-danger mt-2">
                      {{ formErrors.languages }}
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-4">
                    <label for="submissionType" class="text-muted form-label">{{
                      $t("submissionType")
                      }}</label>
                    <BFormSelect v-model="form.submissionType" :options="submissionTypes" class="form-control"
                      id="submissionType" name="submissionType" :class="{ 'is-invalid': formErrors.submissionType }" 
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.submissionType" class="invalid-feedback">
                      {{ formErrors.submissionType }}
                    </div>
                  </div>
                </div>
                
                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="conferenceParticipation" class="text-muted form-label">{{ $t("conferenceParticipation")
                      }}</label>
                    <BFormSelect v-model="form.hasPreviousParticipation" :options="isHasPreviousParticipation"
                      class="form-control" id="hasPreviousParticipation" name="hasPreviousParticipation" :class="{
                        'is-invalid': formErrors.hasPreviousParticipation,
                      }" 
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.hasPreviousParticipation" class="invalid-feedback">
                      {{ formErrors.hasPreviousParticipation }}
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="mb-4">
                    <label for="isPublished" class="text-muted form-label">{{ $t("isPublished")
                      }}</label>
                    <BFormSelect v-model="form.isPublished" :options="isHasItBeenPublished"
                      class="form-control" id="isPublished" name="isPublished" :class="{
                        'is-invalid': formErrors.isPublished,
                      }" 
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.isPublished" class="invalid-feedback">
                      {{ formErrors.isPublished }}
                    </div>
                  </div>
                </div>

                <div v-if="form.isPublished === true" class="col-lg-6">
                  <div class="mb-4">
                    <label for="publishedAt" class="text-muted form-label">{{ $t("publishedAt") }}</label>
                    <input v-model="form.publishedAt" name="publishedAt" id="publishedAt" 
                      type="text" class="form-control" :placeholder="$t('publishedAtPlaceholder')"
                      :class="{ 'is-invalid': formErrors.publishedAt }"
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.publishedAt" class="invalid-feedback">
                      {{ formErrors.publishedAt }}
                    </div>
                  </div>
                </div>

                <div v-if="form.isPublished === true" class="col-lg-6">
                  <div class="mb-4">
                    <label for="publishedUrl" class="text-muted form-label">{{ $t("publishedUrl") }}</label>
                    <input v-model="form.publishedUrl" name="publishedUrl" id="publishedUrl" 
                      type="text" class="form-control" :placeholder="$t('publishedUrlPlaceholder')"
                      :class="{ 'is-invalid': formErrors.publishedUrl }"
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.publishedUrl" class="invalid-feedback">
                      {{ formErrors.publishedUrl }}
                    </div>
                  </div>
                </div>

                <!-- Previous Participation Details -->
                <div v-if="form.hasPreviousParticipation === true" class="col-lg-6">
                  <div class="mb-4">
                    <label for="wherePreviousParticipation" class="text-muted form-label">{{ $t("wherePreviousParticipation") }}</label>
                    <input v-model="form.wherePreviousParticipation" name="wherePreviousParticipation" id="wherePreviousParticipation" 
                      type="text" class="form-control" :placeholder="$t('wherePreviousParticipationPlaceholder')"
                      :class="{ 'is-invalid': formErrors.wherePreviousParticipation }"
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    <div v-if="formErrors.wherePreviousParticipation" class="invalid-feedback">
                      {{ formErrors.wherePreviousParticipation }}
                    </div>
                  </div>
                </div>

                <div v-if="form.hasPreviousParticipation === true" class="col-lg-6">
                  <div class="mb-4">
                    <label for="whenPreviousParticipation" class="text-muted form-label">{{ $t("whenPreviousParticipation") }}</label>
                    <input 
                      v-model="form.whenPreviousParticipation" 
                      name="whenPreviousParticipation" 
                      id="whenPreviousParticipation" 
                      type="number" 
                      class="form-control" 
                      :placeholder="$t('whenPreviousParticipationPlaceholder')"
                      :class="{ 'is-invalid': formErrors.whenPreviousParticipation }"
                      :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)"
                      min="1900"
                      :max="new Date().getFullYear()"
                      @input="validateYear"
                    />
                    <div v-if="formErrors.whenPreviousParticipation" class="invalid-feedback">
                      {{ formErrors.whenPreviousParticipation }}
                    </div>
                  </div>
                </div>

              <div class="row">
                <div class="col-lg-6  d-flex">
                  <div class="drop-zone w-100" id="dropZoneParticipation" @click="dropZoneParticipation()"
                    :class="{ 'disabled': !isRegistrationActive || (setting.terms && !agreedToTerms) }">
                    <div v-if="form.theParticipation == null">
                      {{ $t("uploadYourParticipation") }}
                      <input type="file" id="fileInputParticipation" class="file-input"
                        @change="uploadYourParticipationFile($event)" accept=".pdf,.doc,.docx" 
                        :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    </div>

                    <div v-else @change="uploadYourParticipationFile($event)">
                      <i class="fa fa-file-text-o mr-2 ml-2" aria-hidden="true"></i>
                      <span>{{
                        form.theParticipation ? form.theParticipation.name : ""
                        }}</span>
                          <input type="file" id="fileInputParticipation" class="file-input"
                        @change="uploadYourParticipationFile($event)" accept=".pdf,.doc,.docx" 
                        :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    </div>
                  </div>
                </div>
                <div class="col-lg-6  d-flex">
                  <div class="drop-zone w-100" id="dropZoneAuthenticityPledge" @click="dropZoneAuthenticityPledge()"
                    :class="{ 'disabled': !isRegistrationActive || (setting.terms && !agreedToTerms) }">
                    <div v-if="form.authenticityPledge == null">
                      {{ $t("authenticityPledge") }}
                      <input type="file" id="fileInputAuthenticityPledge" class="file-input"
                        @change="uploadYourAuthenticityPledge($event)" accept=".pdf" 
                        :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    </div>

                    <div v-else @change="uploadYourAuthenticityPledge($event)">
                      <i class="fa fa-file-text-o" aria-hidden="true"></i>
                      <span>{{
                        form.authenticityPledge
                          ? form.authenticityPledge.name
                          : ""
                      }}</span>
                        <input type="file" id="fileInputAuthenticityPledge" class="file-input"
                        @change="uploadYourAuthenticityPledge($event)" accept=".pdf" 
                        :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)" />
                    </div>
                  </div>
                  <div v-if="formErrors.authenticityPledge" class="invalid-feedback d-block mt-2">
                    {{ formErrors.authenticityPledge }}
                  </div>
                </div>
              </div>
                <div class="mb-4">
                  <button type="submit" id="submit" name="send" class="btn btn-primary"
                    :disabled="!isRegistrationActive || (setting.terms && !agreedToTerms)">
                    <BSpinner variant="success" v-if="isLoading" />
                    <span v-else>{{ $t("submit") }}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <!-- note  -->
          <div class="notes-container">
            <div class="notes-header">
              <i class="fas fa-info-circle"></i>
              <h5>{{ $t("formNote1") }}</h5>
            </div>
            <div class="notes-content">
              <div class="note-item" v-for="(note, index) in notesList" :key="index">
                <div class="note-icon">
                  <i :class="note.icon"></i>
                </div>
                <div class="note-text">
                  <p>{{ note.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import languages from '@/assets/data/languages.json';
import Swal from 'sweetalert2';
import countries from '@/assets/data/countries.json';
import phone_keys from '@/assets/data/phone_keys.json';

export default {
  props: {
    conferenceVersionID: {
      type: Number,
      required: true,
    },
    // setting
    setting: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    form: {
      submissionType: 0,
      fullName: "",
      email: "",
      workplace: "",
      countryOfResidence: "",
      academicTitle: "",
      whatsAppNumber: "",
      whatsAppCountry: "",
      LanguageName: "",
      linguisticLevel: 0,
      hasPreviousParticipation: 0,
      isPublished: 0,
      publishedAt: "",
      publishedUrl: "",
      wherePreviousParticipation: "",
      whenPreviousParticipation: "",
      theParticipation: null,
      authenticityPledge: null,
      languages: [],
      country: '',
    },
    newLanguage: {
      name: '',
      level: 0
    },
    formErrors: {
      authenticityPledge: '',
      country: '',
    },
    errorMessage: "",
    isLoading: false,
    agreedToTerms: false,
    endTimeRemaining: null,
    countdownInterval: null,
    languages: languages.languages,
    countries: countries.countries,
    notesList: [
      {
        icon: 'fas fa-file-word',
        text: this.$t('formNote2').split('\n')[0]
      },
      {
        icon: 'fas fa-file-pdf',
        text: this.$t('formNote2').split('\n')[1]
      },
      {
        icon: 'fas fa-file-powerpoint',
        text: this.$t('formNote2').split('\n')[2]
      }
    ],
    pledgeFiles: [
      {
        title: 'تعهد الأصالة العلمية.pdf',
        description: 'تحميل تعهد الأصالة العلمية باللغة العربية',
        url: 'https://api.int-mgm.org/images/Files/d3f582ca-4e62-4c3c-b263-4fe420ea27ff.pdf',
        icon: 'fas fa-file-pdf'   
      },
      {
        title: 'تعهد اصالت علمی.pdf',
        description: 'تحميل تعهد الأصالة العلمية باللغة الفارسية',
        url: 'https://api.int-mgm.org/images/Files/8e2bb2f9-32ea-4885-849a-3c340292230a.pdf',
        icon: 'fas fa-file-pdf'
      },
      {
        title: 'Declaration of Academic Integrity.pdf',
        description: 'Download the authenticity pledge in English',
        url: 'https://api.int-mgm.org/images/Files/a35c92c9-cff6-4b53-ba78-5d5ce8d10c97.pdf',
        icon: 'fas fa-file-pdf'
      },
      {
        title: 'العرض التقديمي للمؤتمر الثالث.powrpoint',
        description: 'تحميل العرض التقديمي للمؤتمر الثالث',
        url: 'https://docs.google.com/presentation/d/1oHFtZpF604LbMv74ey1V9GfakyyBBAt2/edit?usp=sharing&ouid=102953897949703831034&rtpof=true&sd=true',
        icon: 'fas fa-file-powerpoint'
      }
    ],
    countryCodes: phone_keys.keys,
    selectedCountryCode: '+964',
    selectedCountry: 'iq',
    showCountryList: false,
    countrySearch: '',
    filteredCountries: [],
  };
  },
  computed: {
    submissionTypes() {
      return [
        { text: this.$t("chooseSharingType"), value: 0 },
        { text: this.$t("scientificResearch"), value: 3 },
        { text: this.$t("scientificArticle"), value: 2 },
        { text: this.$t("scientificWord"), value: 1 },
      ];
    },
    languageLevels() {
      return [
        { text: this.$t("chooseLanguageLevels"), value: 0 },
        { text: this.$t("poor"), value: 1 },
        { text: this.$t("average"), value: 2 },
        { text: this.$t("good"), value: 3 },
        { text: this.$t("veryGood"), value: 4 },
  
      ];
    },
    isHasPreviousParticipation() {
      return [
        { text: this.$t("chooseOption"), value: 0 },
        { text: this.$t("yes"), value: true },
        { text: this.$t("no"), value: false },
      ];
    },
    isHasItBeenPublished() {
      return [
        { text: this.$t("chooseOption"), value: 0 },
        { text: this.$t("yes"), value: true },
        { text: this.$t("no"), value: false },
      ];
    },
    isRegistrationActive() {
      return this.setting && this.setting.isActive && (!this.setting.endTime || new Date(this.setting.endTime) > new Date());
    },
    getCurrentLanguageTerms() {
      const currentLocale = this.$i18n.locale;
      switch (currentLocale) {
        case 'ar':
          return this.setting.arabicTerms || '';
        case 'en':
          return this.setting.englishTerms || '';
        case 'fa':
          return this.setting.persianTerms || '';
        default:
          return this.setting.arabicTerms || '';
      }
    }
  },

  methods: {

    addLanguage() {
      if (this.newLanguage.name && this.newLanguage.level > 0) {
        this.form.languages.push({...this.newLanguage});
        this.newLanguage = { name: '', level: 0 };
      }
    },
    
    removeLanguage(index) {
      this.form.languages.splice(index, 1);
    },
    
    getLevelText(level) {
      const levelOption = this.languageLevels.find(option => option.value === level);
      return levelOption ? levelOption.text : '';
    },


    dropZoneParticipation() {
      if (this.isRegistrationActive && (!this.setting.terms || this.agreedToTerms)) {
        document.getElementById("fileInputParticipation").click();
      }
    },

    dropZoneAuthenticityPledge() {
      if (this.isRegistrationActive && (!this.setting.terms || this.agreedToTerms)) {
        document.getElementById("fileInputAuthenticityPledge").click();
      }
    },

    uploadYourParticipationFile(event) {
      this.form.theParticipation = event.target.files[0];
      console.log(this.form.theParticipation);
    },

    uploadYourAuthenticityPledge(event) {
      const file = event.target.files[0];
      if (file && file.type !== 'application/pdf') {
        this.formErrors.authenticityPledge = this.$t("onlyPdfFilesAllowed");
        event.target.value = '';
        return;
      }
      this.formErrors.authenticityPledge = '';
      this.form.authenticityPledge = file;
    },

    updateCountdown() {
      if (!this.setting || !this.setting.endTime) {
        this.endTimeRemaining = null;
        return;
      }

      const now = new Date();
      const endTime = new Date(this.setting.endTime);
      const difference = endTime - now;

      if (difference <= 0) {
        // End time has passed
        clearInterval(this.countdownInterval);
        this.endTimeRemaining = null;
        return;
      }

      // Calculate remaining time
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      this.endTimeRemaining = { days, hours, minutes, seconds };
    },

    validateYear(event) {
      const year = parseInt(event.target.value);
      const currentYear = new Date().getFullYear();
      
      if (year < 1900 || year > currentYear) {
        this.formErrors.whenPreviousParticipation = this.$t("invalidYear");
      } else {
        this.formErrors.whenPreviousParticipation = "";
      }
    },

    validateWhatsAppNumber() {
      if (!this.form.whatsAppNumber) {
        this.formErrors.whatsAppNumber = this.$t('requiredField');
        return false;
      }

      const fullNumber = this.selectedCountryCode + this.form.whatsAppNumber;
      
      // التحقق من أن الرقم يحتوي على أرقام فقط
      if (!/^\d+$/.test(this.form.whatsAppNumber)) {
        this.formErrors.whatsAppNumber = this.$t('invalidPhoneNumber');
        return false;
      }

      // التحقق من طول الرقم الكامل (بما في ذلك رمز الدولة)
      if (fullNumber.length < 10 || fullNumber.length > 15) {
        this.formErrors.whatsAppNumber = this.$t('invalidPhoneNumber');
        return false;
      }

      this.formErrors.whatsAppNumber = '';
      return true;
    },

    selectCountryCode(code, country) {
      this.selectedCountryCode = code;
      this.selectedCountry = country;
      this.form.whatsAppCountry = country;
      this.showCountryList = false;
      this.validateWhatsAppNumber();
    },

    toggleCountryList() {
      if (this.isRegistrationActive && (!this.setting.terms || this.agreedToTerms)) {
        this.showCountryList = !this.showCountryList;
        if (this.showCountryList) {
          this.filteredCountries = this.countryCodes;
          this.countrySearch = '';
        }
      }
    },

    filterCountries() {
      if (!this.countrySearch) {
        this.filteredCountries = this.countryCodes;
        return;
      }
      const search = this.countrySearch;
      this.filteredCountries = this.countryCodes.filter(country => 
        country.code.includes(search) || 
        country.name.includes(search)
      );
    },

    getFlagUrl(countryCode) {
      return `https://flagcdn.com/w20/${countryCode}.png`;
    },

    validateForm() {
      if (!this.isRegistrationActive) {
        this.$toast.open({
          message: this.$t("registrationClosed"),
          type: "error",
        });
        return false;
      }

      if (this.setting.terms && !this.agreedToTerms) {
        this.$toast.open({
          message: this.$t("pleaseAgreeToTerms"),
          type: "error",
        });
        return false;
      }

      this.formErrors = {};
      let valid = true;

      if (!this.form.fullName) {
        this.formErrors.fullName = this.$t("requiredField");
        valid = false;
      }
      if (!this.form.email || !/\S+@\S+\.\S+/.test(this.form.email)) {
        this.formErrors.email = this.$t("invalidEmail");
        valid = false;
      }
    
      if (!this.form.workplace) {
        this.formErrors.workplace = this.$t("requiredField");
        valid = false;
      }
      if (!this.form.whatsAppNumber) {
        this.formErrors.whatsAppNumber = this.$t("requiredField");
        valid = false;
      }
      if (!this.form.academicTitle) {
        this.formErrors.academicTitle = this.$t("requiredField");
        valid = false;
      }


     if (this.form.languages.length === 0) {
    this.formErrors.languages = this.$t("requiredField");
    valid = false;
  }

      if (this.form.submissionType === 0) {
        this.formErrors.submissionType = this.$t("requiredField");
        valid = false;
      }
      if (this.form.hasPreviousParticipation === 0) {
        this.formErrors.hasPreviousParticipation = this.$t("requiredField");
        valid = false;
      }
      if (this.form.isPublished === 0) {
        this.formErrors.hasItBeenPublished = this.$t("requiredField");
        valid = false;
      }
      if (!this.form.theParticipation) {
        this.$toast.open({
          message: this.$t("uploadYourParticipation"),
          type: "error",
        });
        valid = false;
      }
      if (!this.form.authenticityPledge) {
        this.$toast.open({
          message: this.$t("uploadYourAuthenticityPledge"),
          type: "error",
        });
        valid = false;
      }

      if (
        this.form.theParticipation &&
        ![
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ].includes(this.form.theParticipation.type)
      ) {
        Swal.fire({
          title: this.$i18n.locale === 'ar' ? 'خطأ' : 'Error',
          text: this.$t('onlyWordFilesAllowed'),
          icon: 'error',
          confirmButtonText: this.$i18n.locale === 'ar' ? 'حسناً' : 'OK',
          confirmButtonColor: '#dc3545',
        });
        return false;
      }

      if (
        this.form.authenticityPledge &&
        this.form.authenticityPledge.type !== "application/pdf"
      ) {
        this.formErrors.authenticityPledge = this.$t("onlyPdfFilesAllowed");
        valid = false;
      }

      if (this.form.hasPreviousParticipation === true) {
        if (!this.form.wherePreviousParticipation) {
          this.formErrors.wherePreviousParticipation = this.$t("requiredField");
          valid = false;
        }
        if (!this.form.whenPreviousParticipation) {
          this.formErrors.whenPreviousParticipation = this.$t("requiredField");
          valid = false;
        } else {
          const year = parseInt(this.form.whenPreviousParticipation);
          const currentYear = new Date().getFullYear();
          if (year < 1900 || year > currentYear) {
            this.formErrors.whenPreviousParticipation = this.$t("invalidYear");
            valid = false;
          }
        }
      }
      if (this.form.isPublished === true) {
        if (!this.form.publishedAt) {
          this.formErrors.publishedAt = this.$t("requiredField");
          valid = false;
        }
        if (!this.form.publishedAt) {
          this.formErrors.publishedAt = this.$t("requiredField");
          valid = false;
        } else {
          const year = parseInt(this.form.publishedAt);
          const currentYear = new Date().getFullYear();
          if (year < 1900 || year > currentYear) {
            this.formErrors.publishedAt = this.$t("invalidYear");
            valid = false;
          }
        }
      }

      return valid;
    },

    submitForm() {
      if (!this.validateForm()) {
        return;
      }

      const formData = new FormData();
      formData.append("FullName", this.form.fullName);
      formData.append("Email", this.form.email);
      formData.append("WorkPlace", this.form.workplace);
      formData.append("CountryOfResidence", this.form.countryOfResidence);
      formData.append("AcademicTitle", this.form.academicTitle);
      formData.append("WhatsAppNumber", this.selectedCountryCode + this.form.whatsAppNumber);
      formData.append("WhatsAppCountry", this.form.whatsAppCountry);
      formData.append("LanguageName", JSON.stringify(this.form.languages));
      formData.append("LinguisticLevel", this.form.linguisticLevel);
      formData.append("Participation", this.form.theParticipation);
      formData.append("IsPublished", this.form.isPublished);
      formData.append("PublishedAt", this.form.publishedAt);
      formData.append("PublishedUrl", this.form.publishedUrl);
      formData.append("TheAuthenticityPledge", this.form.authenticityPledge);
      formData.append("HasPreviousParticipation", this.form.hasPreviousParticipation);
      formData.append("WherePreviousParticipation", this.form.wherePreviousParticipation);
      formData.append("WhenPreviousParticipation", this.form.whenPreviousParticipation);
      formData.append("SharingType", this.form.submissionType);
      formData.append("ConferenceVersionID", this.conferenceVersionID);

      this.isLoading = true;
      axios
        .post(
          "https://api.int-mgm.org/api/Registration/AddInformation",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          this.isLoading = false;
          if (response && response.status === 200) {
            // Reset form
            this.form = {
              submissionType: 0,
              fullName: "",
              email: "",
              workplace: "",
              countryOfResidence: "",
              academicTitle: "",
              whatsAppNumber: "",
              whatsAppCountry: "",
              LanguageName: "",
              linguisticLevel: 0,
              hasPreviousParticipation: 0,
              wherePreviousParticipation: "",
              whenPreviousParticipation: "",
              theParticipation: null,
              authenticityPledge: null,
              languages: [],
              country: '',
            };
            
            // Show success message with SweetAlert
            Swal.fire({
              title: this.$i18n.locale === 'ar' ? 'نجاح' : 'Success',
              text: this.$i18n.locale === 'ar' 
                ? 'تم إضافة المعلومات والملفات بنجاح'
                : 'Information and files added successfully',
              icon: 'success',
              confirmButtonText: this.$i18n.locale === 'ar' ? 'حسناً' : 'OK',
              confirmButtonColor: '#195015',
              timer: 5000,
              timerProgressBar: true,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            });
          } else {
            this.showError(response?.data?.message || this.$t("formSubmissionFailed"));
          }
        })
        .catch((error) => {
          this.isLoading = false;
          if (error.response) {
            if (error.response.status === 422) {
              this.formErrors = error.response.data.errors || {};
              this.showError(this.$t("validationError"));
            } else {
              this.showError(error.response.data?.message || this.$t("formSubmissionFailed"));
            }
          } else {
            this.showError(this.$t("formSubmissionFailed"));
          }
        });
    },

    showError(message) {
      Swal.fire({
        title: this.$i18n.locale === 'ar' ? 'خطأ' : 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: this.$i18n.locale === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#dc3545',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    },
  },
  mounted() {
    // Start countdown update
    this.updateCountdown();
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
    this.filteredCountries = this.countryCodes;
    
    // إضافة مستمع للنقر خارج القائمة
    document.addEventListener('click', (e) => {
      if (this.showCountryList && !e.target.closest('.country-code-selector')) {
        this.showCountryList = false;
      }
    });
  },
  beforeUnmount() {
    // Clear interval when component is destroyed
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    document.removeEventListener('click', this.closeCountryList);
  }
};
</script>

<style scoped>
.fa-file-text-o:before {
  content: "\f0f6";
  color: #195015;
  margin: 5px;
}


#contact .section {
  padding: 50px 0;
  background-color: #f9f9f9;
}

#contact .container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.form-control {
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #195015;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.btn-primary {
  background-color: #195015;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.text-muted {
  color: #6c757d;
}

.fw-bold {
  font-weight: bold;
}

input::placeholder {
  color: #6c757d;
}

.row {
  margin-bottom: 20px;
}

.drop-zone {
  margin-bottom: 10px;
  height: 200px;
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #aaa;
  cursor: pointer;
  transition: border-color 0.2s;
}

.drop-zone.dragover {
  border-color: #195015;
  color: #195015;
}

.file-input {
  display: none;
}

.form-select {
  direction: ltr;
}

.fa-file-text-o:before {
  content: "\f0f6";
  color: #195015;
  margin: 5px;
}

#contact .section {
  padding: 50px 0;
  background-color: #f9f9f9;
}

#contact .container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.form-control {
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #195015;
  box-shadow: 0 0 5px #195015;
}

.btn-primary {
  background-color: #195015;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #195015;
}

.btn-primary:disabled {
  background-color: #97c4f1;
  cursor: not-allowed;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.text-muted {
  color: #6c757d;
}

.fw-bold {
  font-weight: bold;
}

input::placeholder {
  color: #6c757d;
}

.row {
  margin-bottom: 20px;
}

.drop-zone {
  margin-bottom: 10px;
  height: 200px;
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #aaa;
  cursor: pointer;
  transition: border-color 0.2s;
}

.drop-zone.dragover {
  border-color: #195015;
  color: #195015;
}

.drop-zone.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f8f8f8;
}

.file-input {
  display: none;
}

.form-select {
  direction: ltr;
}

.form-disabled {
  opacity: 0.7;
  pointer-events: none;
}

/* Terms Agreement Section */
.terms-agreement-container {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid rgba(72, 141, 131, 0.1);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.terms-agreement-container:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.terms-title {
  color: #195015;
  font-weight: 600;
  font-size: 1.4rem;
  border-bottom: 2px solid rgba(72, 141, 131, 0.2);
  padding-bottom: 12px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.terms-title:before {
  content: '';
  display: block;
  width: 4px;
  height: 24px;
  background-color: #195015;
  border-radius: 2px;
}

.terms-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  border: 1px solid rgba(72, 141, 131, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #2c3e50;
}

.terms-content::-webkit-scrollbar {
  width: 8px;
}

.terms-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.terms-content::-webkit-scrollbar-thumb {
  background: #195015;
  border-radius: 4px;
}

.terms-content::-webkit-scrollbar-thumb:hover {
  background: #3a7169;
}

.terms-content h1, 
.terms-content h2, 
.terms-content h3, 
.terms-content h4, 
.terms-content h5, 
.terms-content h6 {
  color: #195015;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.terms-content p {
  margin-bottom: 1.2rem;
  text-align: justify;
}

.terms-content ul, 
.terms-content ol {
  margin-bottom: 1.2rem;
  padding-right: 1.8rem;
}

.terms-content li {
  margin-bottom: 0.8rem;
  position: relative;
}

.terms-content li:before {
  content: '•';
  color: #195015;
  position: absolute;
  right: -1.2rem;
}

.terms-content strong, 
.terms-content b {
  color: #1d3557;
  font-weight: 600;
}

.terms-content a {
  color: #195015;
  text-decoration: none;
  transition: all 0.3s ease;
}

.terms-content a:hover {
  text-decoration: underline;
  color: #3a7169;
}

.terms-content blockquote {
  border-right: 4px solid #195015;
  margin-right: 0;
  padding: 1rem 1.5rem;
  color: #495057;
  background-color: #f8f9fa;
  border-radius: 0 8px 8px 0;
  font-style: italic;
}

.form-check {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: rgba(72, 141, 131, 0.05);
  border-radius: 8px;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.form-check:hover {
  background-color: rgba(72, 141, 131, 0.1);
}

.form-check-input {
  margin-right: 15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 2px solid #195015;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.form-check-input:checked {
  background-color: #195015;
  border-color: #195015;
}

.form-check-label {
  cursor: pointer;
  font-weight: 500;
  color: #2c3e50;
  font-size: 1.1rem;
  margin-right: 34px;
  margin-left: 34px;
  transition: all 0.3s ease;
}

.form-check:hover .form-check-label {
  color: #195015;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .terms-agreement-container {
    padding: 20px;
  }
  
  .terms-title {
    font-size: 1.2rem;
  }
  
  .terms-content {
    padding: 15px;
    font-size: 1rem;
  }
  
  .form-check {
    padding: 12px;
  }
  
  .form-check-label {
    font-size: 1rem;
  }
}

/* Countdown styles */
.countdown-container {
  margin-bottom: 20px;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #195015;
  color: white;
  border-radius: 5px;
  padding: 8px 12px;
  min-width: 70px;
}

.countdown-value {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.countdown-label {
  font-size: 0.8rem;
  margin-top: 5px;
  opacity: 0.8;
}

.registration-closed-alert {
  margin-bottom: 20px;
  text-align: center;
}

/* Language list styling */
.language-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  background-color: #f8f9fa;
}

.language-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 8px 12px;
  min-width: 200px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.language-info {
  display: flex;
  flex-direction: column;
}

.language-name {
  font-weight: 500;
  color: #333;
}

.language-level {
  font-size: 0.85rem;
  color: #6c757d;
}

.btn-remove-language {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.btn-remove-language:hover {
  color: #bd2130;
}

.btn-remove-language:disabled {
  color: #adb5bd;
  cursor: not-allowed;
}

/* Language form styling */
.language-form {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 5px;
}

.btn-secondary {
  background-color: rgb(0 90 76) !important;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
 
}

.btn-secondary:hover {
  background-color: rgb(0 90 76) !important;
  color: rgb(255, 255, 255);
}

.btn-secondary:disabled {
  background-color: #adb5bd;
  color: #fff !important;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .language-item {
    min-width: 100%;
  }
  
  .language-form .row {
    flex-direction: column;
  }
}

.success-toast {
  display: none;
}

.notes-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #195015;
}

.notes-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #0c5460;
}

.notes-header i {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  color: #195015;
}

.notes-header h5 {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.notes-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  display: flex;
  align-items: flex-start;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.note-item:hover {
  transform: translateX(5px);
}

.note-icon {
  background: #e3f2fd;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.note-icon i {
  color: #195015;
  font-size: 1.2rem;
}

.note-text {
  color: #495057;
  line-height: 1.6;
  margin: 4px;
}

.note-text p {
  margin: 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .notes-container {
    padding: 1rem;
  }
  
  .note-item {
    padding: 0.75rem;
  }
  
  .note-icon {
    width: 35px;
    height: 35px;
  }
}

.pledge-downloads {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pledge-title {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.pledge-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.pledge-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
}

.pledge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.pledge-icon {
  width: 60px;
  height: 60px;
  background: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.pledge-icon i {
  font-size: 1.8rem;
  color: #195015;
}

.pledge-info {
  margin-bottom: 1.5rem;
}

.pledge-info h5 {
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.pledge-info p {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.pledge-download-btn {
  background: #195015;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.pledge-download-btn:hover {
  background: #138496;
  color: white;
  text-decoration: none;
}

.pledge-download-btn i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .pledge-cards {
    grid-template-columns: 1fr;
  }
  
  .pledge-card {
    padding: 1.25rem;
  }
  
  .pledge-icon {
    width: 50px;
    height: 50px;
  }
  
  .pledge-icon i {
    font-size: 1.5rem;
  }
}

.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}

.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.25rem 0 0 0.25rem;
}

.input-group .form-control {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
  margin-bottom: 0;
  border-radius: 0 0.25rem 0.25rem 0;
}

.input-group .form-control:focus {
  z-index: 3;
}

.vue-phone-number-input {
  border-radius: 0.25rem;
  width: 100%;
}

.vue-phone-number-input .input-tel {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  height: 38px;
  padding: 0.375rem 0.75rem;
  font-size: 14px;
}

.vue-phone-number-input .input-tel:focus {
  border-color: #195015;
  box-shadow: 0 0 0 0.2rem rgba(25, 80, 21, 0.25);
}

.vue-phone-number-input.is-invalid .input-tel {
  border-color: #dc3545;
}

.vue-phone-number-input .country-selector {
  border: 1px solid #ced4da;
  border-radius: 0.25rem 0 0 0.25rem;
  background-color: #f8f9fa;
  height: 38px;
}

.vue-phone-number-input .country-selector__button {
  padding: 0.375rem 0.75rem;
  min-width: 120px;
  height: 100%;
  display: flex;
  align-items: center;
}

.vue-phone-number-input .country-selector__list {
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 5px;
}

.vue-phone-number-input .country-selector__list-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.vue-phone-number-input .country-selector__list-item:hover {
  background-color: #f8f9fa;
}

.vue-phone-number-input .country-selector__list-item--active {
  background-color: #195015;
  color: #fff;
}

.vue-phone-number-input .country-selector__list-item--selected {
  background-color: #e9ecef;
  font-weight: 500;
}

.vue-phone-number-input .country-selector__list-item-flag {
  margin-right: 8px;
  width: 20px;
  height: 15px;
  object-fit: cover;
}

/* RTL Support */
[dir="rtl"] .vue-phone-number-input {
  text-align: right;
}

[dir="rtl"] .vue-phone-number-input .country-selector {
  border-radius: 0 0.25rem 0.25rem 0;
}

[dir="rtl"] .vue-phone-number-input .input-tel {
  border-radius: 0.25rem 0 0 0.25rem;
}

[dir="rtl"] .vue-phone-number-input .country-selector__list-item-flag {
  margin-right: 0;
  margin-left: 8px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .vue-phone-number-input .country-selector__button {
    min-width: 100px;
  }
  
  .vue-phone-number-input .country-selector__list-item {
    padding: 6px 8px;
  }
  
  .vue-phone-number-input .input-tel {
    font-size: 13px;
  }
}

/* Invalid Feedback */
.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}

.whatsapp-input-container {
  position: relative;
  width: 100%;
}

.whatsapp-input-group {
  display: flex;
  align-items: stretch;
  width: 100%;
  position: relative;
}

.country-code-selector {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 0.25rem 0 0 0.25rem;
  cursor: pointer;
  min-width: 120px;
  user-select: none;
  transition: all 0.3s ease;
}

.country-code-selector:hover {
  background-color: #e9ecef;
}

.selected-country {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.selected-code {
  font-weight: 500;
  margin-right: 8px;
  color: #195015;
}

.fa-chevron-down {
  transition: transform 0.3s ease;
  color: #6c757d;
}

.fa-chevron-down.rotate {
  transform: rotate(180deg);
}

.country-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}

.search-box i {
  color: #6c757d;
  margin-right: 8px;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
}

.country-items {
  max-height: 250px;
  overflow-y: auto;
}

.country-items::-webkit-scrollbar {
  width: 6px;
}

.country-items::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.country-items::-webkit-scrollbar-thumb {
  background: #195015;
  border-radius: 3px;
}

.country-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.country-item:hover {
  background-color: #f8f9fa;
}

.country-code {
  font-weight: 500;
  color: #195015;
  margin-right: 8px;
  min-width: 60px;
}

.country-name {
  color: #495057;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  flex: 1;
}

.whatsapp-input {
  flex: 1;
  border-radius: 0 0.25rem 0.25rem 0;
  border-left: none;
  padding-right: 40px;
  transition: all 0.3s ease;
}

.whatsapp-input:focus {
  border-color: #195015;
  box-shadow: 0 0 0 0.2rem rgba(25, 80, 21, 0.15);
}

.whatsapp-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #25D366;
  font-size: 1.2rem;
}

/* RTL Support */
[dir="rtl"] .country-code-selector {
  border-radius: 0 0.25rem 0.25rem 0;
}

[dir="rtl"] .whatsapp-input {
  border-radius: 0.25rem 0 0 0.25rem;
  border-left: 1px solid #ced4da;
  border-right: none;
  padding-right: 12px;
  padding-left: 40px;
}

[dir="rtl"] .selected-code {
  margin-right: 0;
  margin-left: 8px;
}

[dir="rtl"] .country-code {
  margin-right: 0;
  margin-left: 12px;
}

[dir="rtl"] .search-box i {
  margin-right: 0;
  margin-left: 8px;
}

[dir="rtl"] .whatsapp-icon {
  right: auto;
  left: 12px;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .country-code-selector {
    min-width: 100px;
  }
  
  .country-code {
    min-width: 50px;
  }
  
  .country-name {
    font-size: 0.8rem;
  }
  
  .whatsapp-icon {
    font-size: 1rem;
  }
}

/* Invalid State */
.whatsapp-input.is-invalid {
  border-color: #dc3545;
  background-image: none;
}

.whatsapp-input.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.country-flag {
  width: 20px;
  height: 15px;
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.country-flag img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}

.selected-country {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.country-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.country-item:hover {
  background-color: #f8f9fa;
}

.country-code {
  font-weight: 500;
  color: #195015;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
  padding: 4px 8px;
}

.search-box input:focus {
  outline: none;
}

/* RTL Support */
[dir="rtl"] .country-flag {
  margin-right: 0;
  margin-left: 8px;
}

[dir="rtl"] .country-item {
  flex-direction: row-reverse;
}
.drop-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  min-height: 120px;
  cursor: pointer;
  background-color: #f9f9f9;
}
.drop-zone.disabled {
  pointer-events: none;
  opacity: 0.5;
}

</style>
