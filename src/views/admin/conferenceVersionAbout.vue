<template>
    <conferenceVersionSelect @fetch-id="fetchAbout" />

  <div class="container mt-4 cb" dir="rtl" v-if="isSelectedVersion">
    <h2 class="text-center mb-4">حول المؤتمر - {{ this.form.arabicName }}</h2>
    <div class="card">
      <div class="card-body">
    <form @submit.prevent="upDateAbout">
      <div class="row">
        <!-- Arabic, English, Persian Titles -->
        <div class="col-md-4">
          <label for="arabicName" class="form-label"
            >عنوان الموقع بالعربي</label
          >
          <input
            id="arabicName"
            type="text"
            v-model="form.arabicName"
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
            v-model="form.englishName"
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
            v-model="form.persianName"
            required
            class="form-control"
            placeholder="الاسم بالفارسية"
          />
        </div>
      </div>

      <div class="row">
        <label for="arabicDescription" class="form-label"
            >وصف الموقع بالعربي</label
          >

        <Editor
      v-model="form.arabicDescription"
   
    />
        <!-- Arabic, English, Persian Descriptions -->
        <div class="col-md-4">
          <label for="arabicDescription" class="form-label"
            >وصف الموقع بالعربي</label
          >
          <textarea
            id="arabicDescription"
            type="text"
            v-model="form.arabicDescription"
            required
            class="form-control"
            placeholder="الوصف بالعربية"
          ></textarea>
        </div>
        <div class="col-md-4">
          <label for="englishDescription" class="form-label"
            >وصف الموقع بالانكليزية</label
          >
          <textarea
            id="englishDescription"
            type="text"
            v-model="form.englishDescription"
            required
            class="form-control"
            placeholder="الوصف بالإنجليزية"
          ></textarea>
        </div>
        <div class="col-md-4">
          <label for="persianDescription" class="form-label"
            >وصف الموقع بالفارسية</label
          >
          <textarea
            id="persianDescription"
            type="text"
            v-model="form.persianDescription"
            required
            class="form-control"
            placeholder="الوصف بالفارسية"
          ></textarea>
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
    </div>
  </div>
</template>

<script>
import conferenceVersionSelect from "../../components/conferenceVersionSelect.vue"; 
import api from "../../js/api";

export default {
  name: "conferenceVersionSetting",
  components: {
    conferenceVersionSelect, 
  },
  data() {
    return {
      conferenceVersionsList: [],
      isSelectedVersion: false,
      isLoading: false,
  

      form: {
        arabicName: "",
        englishName: "",
        persianName: "",
        arabicDescription : "",
        englishDescription : "",
        persianDescription : "",
        conferenceVersionID : null, 
      },
    };
  },
  methods: {
   
    async fetchAbout(item) {

      if(item == null){
        this.$toast.open({
          message: "جيب عليك اختيار نسخة المؤتمر اولا",
          type: "error",
        });
      }
      this.form.conferenceVersionID = item; 
      this.isLoading = true;
      try {
        const response = await api.get("ConferenceAbout/GetConferenceAboutById?id=" + this.form.conferenceVersionID);
        console.log(response.data);
        this.isSelectedVersion = true;
        if (response.data.data == null) {
          return;
        }
        this.form.arabicName = response.data.data.arabicName;
        this.form.englishName = response.data.data.englishName;
        this.form.persianName = response.data.data.persianName;
        this.form.arabicDescription = response.data.data.arabicDescription;
        this.form.englishDescription = response.data.data.englishDescription;
        this.form.persianDescription = response.data.data.persianDescription;
      } catch (error) {
        console.error("Error fetching setting:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async translateText(en, fa) {
      console.log(en, fa);
      //   const text = this.form.arabicTitle;
      //   const apiKey = "8d70ab21-313a-47f3-afd1-eb3d57552068:fx"; // Replace with your DeepL API key
      //   const url = "https://api-free.deepl.com/v2/translate";

      //   try {
      //     this.isLoading = true;
      //     const responseEn = await axios.post(url, null, {
      //       params: {
      //         auth_key: apiKey,
      //         text: text,
      //         target_lang: "EN",
      //       },
      //     });
      //     this.form[en] = responseEn.data.translations[0].text;
      //     console.log(fa);
      //   } catch (error) {
      //     console.error("Error with DeepL API:", error);
      //   } finally {
      //     this.isLoading = false;
      //   }
    },

    async upDateAbout() {
      if(this.form.conferenceVersionID == null){
        this.$toast.open({
          message: "جيب عليك اختيار نسخة المؤتمر اولا",
          type: "error",
        });

      }


      const { value: accept } = await this.$swal({
        title: "هل تريد تعديل حول المؤتمر",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      });
      //
      if (!accept) return;

      this.isLoading = true;
     
      try {
        await api.post("ConferenceAbout/AddOrUpdateConferenceAbout", this.form);
        this.fetchAbout(this.form.conferenceVersionID); 
        this.$toast.open({
          message: "تم بنجاح",
          type: "success",
        });
      } catch (error) {
        this.$toast.open({
          message: "يوجد خطا ما",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
