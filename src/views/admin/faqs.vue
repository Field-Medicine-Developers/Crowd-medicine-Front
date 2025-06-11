<template>
  <conferenceVersionSelect @fetch-id="fetchFaqs" />

  <div class="container mt-4 cb" dir="rtl" v-if="conferenceVersionID !== null">
    <h1 class="text-center mb-4">الاسئلة والاجوبة</h1>
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="addFaqs">
          <div class="row">
            <div class="col-md-4">
              <label for="arabicQuestion" class="form-label"
                >السؤال بالعربية</label
              >
              <input
                id="arabicQuestion"
                type="text"
                v-model="form.arabicQuestion"
                required
                class="form-control"
                placeholder="السؤال بالعربية"
              />
            </div>
            <div class="col-md-4">
              <label for="englishQuestion" class="form-label"
                >السؤال بالانكليزية</label
              >
              <input
                id="englishQuestion"
                type="text"
                v-model="form.englishQuestion"
                required
                class="form-control"
                placeholder="السؤال بالإنجليزية"
              />
            </div>
            <div class="col-md-4">
              <label for="persianQuestion" class="form-label"
                >السؤال بالفارسية</label
              >
              <input
                id="persianQuestion"
                type="text"
                v-model="form.persianQuestion"
                required
                class="form-control"
                placeholder="السؤال بالفارسية"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <label for="arabicAnswer" class="form-label"
                >الجواب بالعربية</label
              >
              <input
                id="arabicAnswer"
                type="text"
                v-model="form.arabicAnswer"
                required
                class="form-control"
                placeholder="الجواب بالعربية"
              />
            </div>
            <div class="col-md-4">
              <label for="englishAnswer" class="form-label"
                >الجواب بالانكليزية</label
              >
              <input
                id="englishAnswer"
                type="text"
                v-model="form.englishAnswer"
                required
                class="form-control"
                placeholder="الجواب بالإنجليزية"
              />
            </div>
            <div class="col-md-4">
              <label for="persianAnswer" class="form-label"
                >الجواب بالفارسية</label
              >
              <input
                id="persianAnswer"
                type="text"
                v-model="form.persianAnswer"
                required
                class="form-control"
                placeholder="الجواب بالفارسية"
              />
            </div>
          </div>
          <BButton
            type="submit"
            variant="primary"
            :loading="isLoading"
            loading-text="يرجى الانتظار"
            :disabled="isLoading"
            >اضافة</BButton
          >
        </form>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-body">
        <table class="table table-striped table-hover mt-3">
          <thead>
            <tr>
              <th>الرقم</th>
              <th>السؤال بالعربية</th>
              <th>السؤال بالإنجليزية</th>
              <th>السؤال بالفارسية</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in Faqs" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.arabicQuestion }}</td>
              <td>{{ item.englishQuestion }}</td>
              <td>{{ item.persianQuestion }}</td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-warning btn-sm"
                    @click="openEditModal(item)"
                  >
                    تعديل
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteFaqs(item.id)"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <b-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-rows="totalCount"
          :per-page="pageSize"
          variant="primary"
          class="mt-3"
          @change="fetchData"
        ></b-pagination>
      </div>
    </div>
    <BModal v-model="editModal" hide-footer hide-header>
      <form @submit.prevent="updateFaqs">
        <div class="row">
          <div class="col-md-4">
          <div class="mb-3">
          <label for="editArabicQuestion" class="form-label">الاسم بالعربية</label>
          <input
            id="editArabicQuestion"
            type="text"
            v-model="editForm.arabicQuestion"
            required
            class="form-control"
            placeholder="السؤال بالعربية"
          />
        </div>
      </div>
      <div class="col-md-4">
        <div class="mb-3">
          <label for="editEnglishQuestion" class="form-label"
            >السؤال بالإنجليزية</label
          >
          <input
            id="editEnglishQuestion"
            type="text"
            v-model="editForm.englishQuestion"
            required
            class="form-control"
            placeholder="السؤال بالإنجليزية"
          />
        </div>
        </div>
        <div class="col-md-4">
        <div class="mb-3">
          <label for="editPersianQuestion" class="form-label"
            >السؤال بالفارسية</label
          >
          <input
            id="editPersianQuestion"
            type="text"
            v-model="editForm.persianQuestion"
            required
            class="form-control"
            placeholder="السؤال بالفارسية"
          />
        </div>
        </div>
        </div>
          <div class="row">
            <div class="col-md-4">
              <label for="arabicAnswer" class="form-label"
                >الجواب بالعربية</label
              >
              <input
                id="arabicAnswer"
                type="text"
                v-model="editForm.arabicAnswer"
                required
                class="form-control"
                placeholder="الجواب بالعربية"
              />
            </div>
            <div class="col-md-4">
              <label for="englishAnswer" class="form-label"
                >الجواب بالانكليزية</label
              >
              <input
                id="englishAnswer"
                type="text"
                v-model="editForm.englishAnswer"
                required
                class="form-control"
                placeholder="الجواب بالإنجليزية"
              />
            </div>
            <div class="col-md-4">
              <label for="persianAnswer" class="form-label"
                >الجواب بالفارسية</label
              >
              <input
                id="persianAnswer"
                type="text"
                v-model="editForm.persianAnswer"
                required
                class="form-control"
                placeholder="الجواب بالفارسية"
              />
            </div>
          </div>

        <BButton
          type="submit"
          variant="primary"
          :loading="isLoading"
          loading-text="يرجى الانتظار"
          >حفظ التغييرات</BButton
        >
      </form>
    </BModal>
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
      conferenceVersionID: null,
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      isLoading: false,
      editModal: false,
      form: {
       
        conferenceVersionID: null,
      },
      editForm: {
        id: null,

       
        conferenceVersionID: null,
      },
      Faqs: [],
    };
  },
  methods: {
    async fetchFaqs(id) {
      this.conferenceVersionID = id;
      this.form.conferenceVersionID = id;
      try {
        const response = await api.get(
          `Questions/GetAllQuestions?PageNumber=${this.currentPage}&PageSize=${this.pageSize}&conferenceVersionID=${id}`
        );
        this.Faqs = response.data.items;
      } catch (error) {
        console.error("Error fetching conference versions:", error);
      }
    },
    async addFaqs() {
      this.isLoading = true;
      try {
        await api.post("Questions/AddQuestion", this.form);
        this.$toast.open({
          message: "تم بنجاح",
          type: "success",
        });
        this.fetchFaqs(this.conferenceVersionID);
      } catch (error) {
        this.$toast.open({
          message: "يوجد خطا ما",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
    openEditModal(version) {
      this.editForm = { ...version };
      this.editModal = true;
    },
    async updateFaqs() {
      this.isLoading = true;
      try {
        await api.put(
          `Questions/UpdateQuestion?id=${this.editForm.id}`,
          this.editForm
        );
        this.fetchFaqs(this.conferenceVersionID);
        this.editModal = false;
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
    async deleteFaqs(id) {
      const { value: accept } = await this.$swal({
        title: "هل انت متأكد من الحذف",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      });
      //
      if (!accept) return;

      this.isLoading = true;
      try {
        await api.delete(`Questions/DeleteQuestion?id=${id}`);
        this.fetchFaqs(this.conferenceVersionID);
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
    resetForm() {
      this.form = {
        conferenceVersionID: this.conferenceVersionID,
     
      };
    },
    resetEditForm() {
      this.editForm = {
        id: null,

      
      };
    },
  },

  watch: {
    currentPage() {
      this.fetchFaqs(this.conferenceVersionID);
    },
  },
};
</script>
<style>
 .btn-group {
    direction: ltr;
}
</style>
