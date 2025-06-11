<template>
  <div class="container mt-4 cb" dir="rtl">
    <h2 class="text-center mb-4">اعدادت الموقع الرئيسي</h2>
    <form @submit.prevent="upDateSetting">
      <div class="row">
        <!-- Arabic, English, Persian Titles -->
        <div class="col-md-4">
          <label for="arabicName" class="form-label"
            >عنوان الموقع بالعربي</label
          >
          <input
            id="arabicName"
            type="text"
            v-model="form.arabicTitle"
            required
            class="form-control"
            placeholder="الاسم بالعربية"
            @input="translateText('englishTitle', 'persianName')"
          />
        </div>
        <div class="col-md-4">
          <label for="englishName" class="form-label"
            >عنوان الموقع بالانكليزية</label
          >
          <input
            id="englishName"
            type="text"
            v-model="form.englishTitle"
            required
            class="form-control"
            placeholder="الاسم بالإنجليزية"
          />
        </div>
        <div class="col-md-4">
          <label for="persianName" class="form-label"
            >عنوان الموقع بالفارسية</label
          >
          <input
            id="persianName"
            type="text"
            v-model="form.persianTitle"
            required
            class="form-control"
            placeholder="الاسم بالفارسية"
          />
        </div>
      </div>

      <!-- Arabic, English, Persian Hero Titles -->
      <div class="row mt-3">
        <div class="col-md-4">
          <label for="arabicHeroTitle" class="form-label"
            >عنوان هيور بالعربي</label
          >
          <input
            id="arabicHeroTitle"
            type="text"
            v-model="form.arabicHeroTitle"
            class="form-control"
            placeholder="عنوان هيرو بالعربي"
            @input="translateText('englishHeroTitle', 'persianHeroTitle')"
          />
      
        </div>
        <div class="col-md-4">
          <label for="englishHeroTitle" class="form-label"
            >عنوان هيور بالإنكليزي</label
          >
          <input
            id="englishHeroTitle"
            type="text"
            v-model="form.englishHeroTitle"
            class="form-control"
            placeholder="عنوان هيرو بالإنكليزي"
          />
        </div>
        <div class="col-md-4">
          <label for="persianHeroTitle" class="form-label"
            >عنوان هيور بالفارسية</label
          >
          <input
            id="persianHeroTitle"
            type="text"
            v-model="form.persianHeroTitle"
            class="form-control"
            placeholder="عنوان هيرو بالفارسية"
          />
        </div>
      </div>

      <!-- Arabic, English, Persian Hero Subtitles -->
      <div class="row mt-3">
        <div class="col-md-4 mb-3">
          <label for="arabicHeroSubTitle" class="form-label"
            >عنوان فرعي هيرو بالعربي</label
          >
          <div class="quill-container">
            <QuillEditor 
              ref="arabicHeroSubTitleEditor"
              v-model:content="form.arabicHeroSubTitle"
              contentType="html"
              :options="editorOptions"
            />
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <label for="englishHeroSubTitle" class="form-label"
            >عنوان فرعي هيرو بالإنكليزي</label
          >
          <div class="quill-container">
            <QuillEditor 
              ref="englishHeroSubTitleEditor"
              v-model:content="form.englishHeroSubTitle"
              contentType="html"
              :options="editorOptions"
            />
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <label for="persianHeroSubTitle" class="form-label"
            >عنوان فرعي هيرو بالفارسية</label
          >
          <div class="quill-container">
            <QuillEditor 
              ref="persianHeroSubTitleEditor"
              v-model:content="form.persianHeroSubTitle"
              contentType="html"
              :options="editorOptions"
            />
          </div>
        </div>
      </div>

      <!-- Logo and Hero Video -->
      <div class="row mt-3">
        <!-- Logo Section -->
        <div class="col-md-6 d-flex flex-column align-items-center">
          <h5 class="mb-3">شعار الموقع</h5>
          <div style="max-height: 200px; max-width: 100%" >
            <img
            :src="form.logoFullUrl"
            alt="شعار الموقع"
            class="img-thumbnail shadow-sm"
            style="max-height: 200px; max-width: 100%"
          />
          </div>
        
          <input
            id="logo"
            type="file"
            @change="handleLogoUpload"
            class="form-control mt-3"
            accept="image/*"
          />
        </div>

        <!-- Hero Video Section -->
        <div class="col-md-6 d-flex flex-column align-items-center">
          <h5 class="mb-3">فيديو الهيرو</h5>
          <div style="height: 200px; max-width: 100%" >
            <video
            controls
            :src="form.heroVedioFullUrl"
            class="rounded shadow-sm"
            style="height: 200px; max-width: 100%"
          ></video>
          </div>
         
          <input
            id="heroVideo"
            type="file"
            @change="handleHeroVideoUpload"
            class="form-control mt-3"
            accept="video/*"
          />
        </div>
      </div>

      <!-- Footer Texts -->
      <div class="row mt-4">
        <div class="col-md-4">
          <label for="arabicFooter" class="form-label">الحقوق بالعربي</label>
          <input
            id="arabicFooter"
            type="text"
            v-model="form.arabicFooter"
            class="form-control"
            placeholder="تذييل بالعربية"
            @input="translateText('englishFooter', 'persianFooter')"
          />
        </div>
        <div class="col-md-4">
          <label for="englishFooter" class="form-label"
            >الحقوق بالإنكليزي</label
          >
          <input
            id="englishFooter"
            type="text"
            v-model="form.englishFooter"
            class="form-control"
            placeholder="تذييل بالإنكليزي"
          />
        </div>
        <div class="col-md-4">
          <label for="persianFooter" class="form-label">الحقوق بالفارسية</label>
          <input
            id="persianFooter"
            type="text"
            v-model="form.persianFooter"
            class="form-control"
            placeholder="تذييل بالفارسية"
          />
        </div>
      </div>

      <!-- Location Details -->
      <div class="row mt-3">
        <div class="col-md-3">
          <label for="locationAddress" class="form-label">العنوان </label>
          <input
            id="arabicAddress"
            type="text"
            v-model="form.location.arabicAddress"
            class="form-control"
            placeholder=" "
            @input="translateText('englishAddress', 'persianAddress')"
          />
        </div>
        <div class="col-md-3">
          <label for="englishAddress" class="form-label"
            >العنوان بالانكليزية</label
          >
          <input
            id="englishAddress"
            type="text"
            v-model="form.location.englishAddress"
            class="form-control"
            placeholder=" "
          />
        </div>
        <div class="col-md-3">
          <label for="persianAddress" class="form-label"
            >العنوان بالفارسية
          </label>
          <input
            id="persianAddress"
            type="text"
            v-model="form.location.persianAddress"
            class="form-control"
            placeholder=" "
          />
        </div>
        <div class="col-md-3">
          <label for="arabicAddressDescription" class="form-label"
            >الوصف بالعربية
          </label>
          <input
            id="arabicAddressDescription"
            type="text"
            v-model="form.location.arabicAddressDescription"
            class="form-control"
            placeholder="وصف "
          />
        </div>

        <div class="col-md-3">
          <label for="englishAddressDescription" class="form-label"
            >الوصف بالانكليزية</label
          >
          <input
            id="englishAddressDescription"
            type="text"
            v-model="form.location.englishAddressDescription"
            class="form-control"
            placeholder="وصف "
          />
        </div>
        <div class="col-md-3">
          <label for="persianAddressDescription" class="form-label"
            >الوصف بالفارسية</label
          >
          <input
            id="persianAddressDescription"
            type="text"
            v-model="form.location.persianAddressDescription"
            class="form-control"
            placeholder="وصف "
          />
        </div>

        <div class="col-md-3">
          <label for="latitude" class="form-label">خط العرض</label>
          <input
            id="latitude"
            type="text"
            v-model="form.location.latitude"
            class="form-control"
            placeholder="خط العرض"
          />
        </div>
        <div class="col-md-3">
          <label for="longitude" class="form-label">خط الطول</label>
          <input
            id="longitude"
            type="text"
            v-model="form.location.longitude"
            class="form-control"
            placeholder="خط الطول"
          />
        </div>
      </div>

      <!-- Terms Section -->
      <div class="row mt-3 mb-3">
        <div class="col-md-12 mb-3">
          <label for="terms" class="form-label">{{ $t('termsAndConditions') }}</label>
          <div class="quill-container">
            <div class="mb-3">
              <ul class="nav nav-tabs" id="termsTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="arabic-tab" data-bs-toggle="tab" data-bs-target="#arabicTerms" type="button" role="tab" aria-controls="arabicTerms" aria-selected="true">
                   عربي 
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="english-tab" data-bs-toggle="tab" data-bs-target="#englishTerms" type="button" role="tab" aria-controls="englishTerms" aria-selected="false">
                  انكليزي
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="persian-tab" data-bs-toggle="tab" data-bs-target="#persianTerms" type="button" role="tab" aria-controls="persianTerms" aria-selected="false">
                  فارسي
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="termsTabsContent">
                <div class="tab-pane fade show active" id="arabicTerms" role="tabpanel" aria-labelledby="arabic-tab">
                  <QuillEditor 
                    ref="arabicTermsEditor"
                    v-model:content="form.arabicTerms"
                    contentType="html"
                    :options="editorOptions"
                  />
                </div>
                <div class="tab-pane fade" id="englishTerms" role="tabpanel" aria-labelledby="english-tab">
                  <QuillEditor 
                    ref="englishTermsEditor"
                    v-model:content="form.englishTerms"
                    contentType="html"
                    :options="editorOptions"
                  />
                </div>
                <div class="tab-pane fade" id="persianTerms" role="tabpanel" aria-labelledby="persian-tab">
                  <QuillEditor 
                    ref="persianTermsEditor"
                    v-model:content="form.persianTerms"
                    contentType="html"
                    :options="editorOptions"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-4 text-center">
        <BButton
          type="submit"
          variant="primary"
          :loading="isLoading"
          loading-text="يرجى الانتظار"
          :disabled="isLoading"
        >
          تعديل
        </BButton>
      </div>
    </form>
  </div>
</template>

<script>
// import axios from "axios";
import api from "../../js/api";
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { Tab } from 'bootstrap';

export default {
  components: {
    QuillEditor
  },
  data() {
    return {
      isLoading: false,
      editModal: false,
      editorOptions: {
        placeholder: 'أدخل النص هنا',
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
          ],
        },
      },
      form: {
        arabicTitle: "",
        englishTitle: "",
        persianTitle: "",
        arabicHeroTitle: "",
        englishHeroTitle: "",
        persianHeroTitle: "",
        arabicHeroSubTitle: "",
        englishHeroSubTitle: "",
        persianHeroSubTitle: "",
        logo: null,
        heroVedio: null,
        arabicFooter: "",
        englishFooter: "",
        persianFooter: "",
        terms: "",
        location: {
          arabicAddress: "",
          englishAddress: "",
          persianAddress: "",
          arabicAddressDescription: "",
          englishAddressDescription: "",
          persianAddressDescription: "",
          latitude: "",
          longitude: "",
        },
        arabicTerms: '',
        englishTerms: '',
        persianTerms: '',
      },
    };
  },
  methods: {
    async fetchSetting() {
      this.isLoading = true;
      try {
        const response = await api.get("Setting/GetAllSetting");
    
        console.log(response.data);
        if(response.data.data != null){
          this.form = {
            ...response.data.data,
            arabicTerms: response.data.data.arabicTerms || '',
            englishTerms: response.data.data.englishTerms || '',
            persianTerms: response.data.data.persianTerms || '',
          };
        }
    
      } catch (error) {
        console.error("Error fetching setting:", error);
        this.$toast.open({
          message: "حدث خطأ أثناء جلب البيانات",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },

    handleLogoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.logo = file;
      }
    },
    handleHeroVideoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.heroVedio = file;
      }
    },

    async translateText(en, fa) {
      console.log(en, fa);
      // Translation implementation would go here
      // Currently commented out in your original code
    },

    async upDateSetting() {
      const { value: accept } = await this.$swal({
        title: "هل تريد تعديل الاعدادات؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      });
      
      if (!accept) return;
      
      this.isLoading = true;
      const formData = new FormData();
      formData.append("ArabicTitle", this.form.arabicTitle);
      formData.append("EnglishTitle", this.form.englishTitle);
      formData.append("PersianTitle", this.form.persianTitle);

      formData.append("ArabicHeroTitle", this.form.arabicHeroTitle);
      formData.append("EnglishHeroTitle", this.form.englishHeroTitle);
      formData.append("PersianHeroTitle", this.form.persianHeroTitle);

      formData.append("ArabicHeroSubTitle", this.form.arabicHeroSubTitle);
      formData.append("EnglishHeroSubTitle", this.form.englishHeroSubTitle);
      formData.append("PersianHeroSubTitle", this.form.persianHeroSubTitle);

      if (this.form.logo) {
        formData.append("LogoFile", this.form.logo);
      }
      
      if (this.form.heroVedio) {
        formData.append("HeroVedioFile", this.form.heroVedio);
      }

      formData.append("ArabicFooter", this.form.arabicFooter);
      formData.append("EnglishFooter", this.form.englishFooter);
      formData.append("PersianFooter", this.form.persianFooter);
      
      // Add language-specific terms to form data
      formData.append("ArabicTerms", this.form.arabicTerms);
      formData.append("EnglishTerms", this.form.englishTerms);
      formData.append("PersianTerms", this.form.persianTerms);

      formData.append(
        "Location.ArabicAddress",
        this.form.location.arabicAddress
      );
      formData.append(
        "Location.EnglishAddress",
        this.form.location.englishAddress
      );
      formData.append(
        "Location.PersianAddress",
        this.form.location.persianAddress
      );

      formData.append(
        "Location.ArabicAddressDescription",
        this.form.location.arabicAddressDescription
      );
      formData.append(
        "Location.EnglishAddressDescription",
        this.form.location.englishAddressDescription
      );
      formData.append(
        "Location.PersianAddressDescription",
        this.form.location.persianAddressDescription
      );

      formData.append("Location.Latitude", this.form.location.latitude);
      formData.append("Location.Longitude", this.form.location.longitude);

      try {
        await api.post("Setting/AddOrUpdateSetting", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.fetchSetting();

        this.$toast.open({
          message: "تم بنجاح",
          type: "success",
        });
      } catch (error) {
        console.error("Error updating settings:", error);
        this.$toast.open({
          message: "يوجد خطا ما",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
    initializeTabs() {
      const tabEls = document.querySelectorAll('#termsTabs button[data-bs-toggle="tab"]');
      tabEls.forEach(tabEl => {
        new Tab(tabEl);
      });
    },
  },
  created() {
    this.fetchSetting();
  },
  mounted() {
    this.initializeTabs();
  },
};
</script>

<style scoped>
.quill-container {
  position: relative;
  margin-bottom: 30px;
}

.ql-editor {
  min-height: 150px;
  max-height: 250px;
  overflow-y: auto;
}

/* Add spacing between editor sections */
.mb-5 {
  margin-bottom: 5rem !important;
}

.nav-tabs {
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1rem;
}

.nav-tabs .nav-link {
  color: #495057;
  border: 1px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  padding: 0.5rem 1rem;
}

.nav-tabs .nav-link:hover {
  border-color: #e9ecef #e9ecef #dee2e6;
}

.nav-tabs .nav-link.active {
  color: #495057;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}

.tab-content {
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-top: none;
  border-radius: 0 0 0.25rem 0.25rem;
}
</style>