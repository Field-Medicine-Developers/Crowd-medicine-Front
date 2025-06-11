<template>
      <conferenceVersionSelect @fetch-id="fetchtips" />

  <div class="container mt-4 cb" v-if="conferenceVersionID !== null">

    <h1 class="text-center mb-4">المحاور</h1>
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="AddOrUpdate" class="row g-3 mt-4">
          <div class="row">
            <div class="col-md-4">
              <label class="form-label">العنوان بالعربية</label>
              <input
                type="text"
                v-model="tips.arabicName"
                required
                class="form-control"
                placeholder="العنوان بالعربية"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">العنوان بالإنجليزية</label>
              <input
                type="text"
                v-model="tips.englishName"
                required
                class="form-control"
                placeholder="العنوان بالإنجليزية"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">العنوان بالفارسية</label>
              <input
                type="text"
                v-model="tips.persianName"
                required
                class="form-control"
                placeholder="العنوان بالفارسية"
              />
            </div>
            <div class="col-md-4 mt-3">
              <label class="form-label">الوصف بالعربية</label>
              <textarea
                v-model="tips.arabicDescription"
                required
                class="form-control"
                rows="3"
                placeholder="الوصف بالعربية"
              ></textarea>
            </div>
            <div class="col-md-4 mt-3">
              <label class="form-label">الوصف بالإنجليزية</label>
              <textarea
                v-model="tips.englishDescription"
                required
                class="form-control"
                rows="3"
                placeholder="الوصف بالإنجليزية"
              ></textarea>
            </div>
            <div class="col-md-4 mt-3">
              <label class="form-label">الوصف بالفارسية</label>
              <textarea
                v-model="tips.persianDescription"
                required
                class="form-control"
                rows="3"
                placeholder="الوصف بالفارسية"
              ></textarea>
            </div>

        
          </div>
          
          <div class="col-12 mt-4">
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
import api from "../../js/api";
import conferenceVersionSelect from "../../components/conferenceVersionSelect.vue";

export default {
  components: {
    conferenceVersionSelect,
  },
  data() {
    return {
      isLoading: false,
      tips: {
        arabicName: "",
        englishName: "",
        persianName: "",
        arabicDescription: "",
        englishDescription: "",
        persianDescription: "",
        conferenceVersionID: null,
      },
      conferenceVersionID: null,
    };
  },
  methods: {
    async fetchtips(id) {
      this.conferenceVersionID = id;
      this.tips.conferenceVersionID = id;
      if (!id) {
        this.$toast.error("يرجى اختيار إصدار المؤتمر أولاً");
        return;
      }
      this.isLoading = true;
      try {
        const response = await api.get(
          `Tips/GetAllTips?conferenceVersionID=${id}`
        );
        const data = response.data.data ;
        if(data != null){
          this.tips.arabicName = data.arabicName || "";
          this.tips.englishName = data.englishName || "";
          this.tips.persianName = data.persianName || "";
          this.tips.arabicDescription = data.arabicDescription || "";
          this.tips.englishDescription = data.englishDescription || "";
          this.tips.persianDescription = data.persianDescription || "";
        }
        
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب اللجان");
      } finally {
        this.isLoading = false;
      }
    },

    async AddOrUpdate() {
      if (!this.conferenceVersionID) {
        this.$toast.error("يرجى اختيار إصدار المؤتمر قبل المتابعة");
        return;
      }
      this.isLoading = true;
      try {
        await api.post(
          `Tips/AddTips`,
          {
            ...this.tips,
          }
        );
        this.$toast.success("تم تعديل اللجنة بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء تعديل اللجنة");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>



<style>
.btn-group {
  direction: ltr;
}

.modal-dialog {
  max-width: 80% !important;
}
</style>