<template>
  <conferenceVersionSelect @fetch-id="fetchFiles" />
  <!-- v-if="conferenceVersionID !== null" -->
  <div class="container mt-4 cb" dir="rtl">
    <h1 class="text-center mb-4">الملفات</h1>
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="addFiles" enctype="multipart/form-data">
          <div class="row">
          
        
            <div class="col-md-4 mt-3">
              <label for="arabicDescription" class="form-label"
                >الوصف بالعربية</label
              >
              <textarea
                id="arabicDescription"
                v-model="form.arabicDescription"
                class="form-control"
                placeholder="الوصف بالعربية"
              ></textarea>
            </div>
            <div class="col-md-4 mt-3">
              <label for="englishDescription" class="form-label"
                >الوصف بالإنجليزية</label
              >
              <textarea
                id="englishDescription"
                v-model="form.englishDescription"
                class="form-control"
                placeholder="الوصف بالإنجليزية"
              ></textarea>
            </div>
            <div class="col-md-4 mt-3">
              <label for="persianDescription" class="form-label"
                >الوصف بالفارسية</label
              >
              <textarea
                id="persianDescription"
                v-model="form.persianDescription"
                class="form-control"
                placeholder="الوصف بالفارسية"
              ></textarea>
            </div>
            <div class="col-md-12 mt-3">
              <label for="icon" class="form-label">الملف</label>
              <input
                id="icon"
                type="file"
                @change="onFileChange"
                class="form-control"
              
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
              <th>الملف</th>
              <th>الوصف بالعربية</th>
              <th>الوصف بالإنجليزية</th>
              <th>الوصف بالفارسية</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in categories" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>
                <a
                  :href="item.theFileFullUrl"
                  alt="icon"
                  style="width: 50px; height: 50px"
                  target="_blank"
                >عرض الملف</a>
              </td>
              <td>{{ item.arabicDescription }}</td>
              <td>{{ item.englishDescription }}</td>
              <td>{{ item.persianDescription }}</td>
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
                    @click="deleteFiles(item.id)"
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
      <form @submit.prevent="updateFiles">
    
        <div class="mb-3">
          <label for="editArabicDescription" class="form-label"
            >الوصف بالعربية</label
          >
          <textarea
            id="editArabicDescription"
            v-model="editForm.arabicDescription"
            required
            class="form-control"
            rows="3"
            placeholder="الوصف بالعربية"
          ></textarea>
        </div>
        <div class="mb-3">
          <label for="editEnglishDescription" class="form-label"
            >الوصف بالإنجليزية</label
          >
          <textarea
            id="editEnglishDescription"
            v-model="editForm.englishDescription"
            required
            class="form-control"
            rows="3"
            placeholder="الوصف بالإنجليزية"
          ></textarea>
        </div>
        <div class="mb-3">
          <label for="editPersianDescription" class="form-label"
            >الوصف بالفارسية</label
          >
          <textarea
            id="editPersianDescription"
            v-model="editForm.persianDescription"
            required
            class="form-control"
            rows="3"
            placeholder="الوصف بالفارسية"
          ></textarea>
        </div>
        <div class="mb-3">
          <label for="editIcon" class="form-label">الأيقونة</label>
          <input
            id="editIcon"
            type="file"
            @change="onFileEditChange"
            class="form-control"
           
          />
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
        arabicDescription: "",
        englishDescription: "",
        persianDescription: "",
       
        newFile: null,
        conferenceVersionID: null,
      },
      editForm: {
        id: null,
        arabicDescription: "",
        englishDescription: "",
        persianDescription: "",
      
        newFile: null,
        conferenceVersionID: null,
      },
      categories: [],
    };
  },
  methods: {
    onFileChange(event) {
      this.form.newFile = event.target.files[0];
    },

    onFileEditChange(event) {
      this.editForm.newFile = event.target.files[0];
    },
    async addFiles() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("ArabicDescription", this.form.arabicDescription);
        formData.append("EnglishDescription", this.form.englishDescription);
        formData.append("PersianDescription", this.form.persianDescription);
        formData.append("TheFiles", this.form.newFile);
        formData.append("ConferenceVersionID", this.conferenceVersionID);

        await api.post("Files/AddFiles", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.$toast.open({
          message: "تم بنجاح",
          type: "success",
        });
        this.fetchFiles(this.conferenceVersionID);
        this.resetForm();
      } catch (error) {
        this.$toast.open({
          message: "يوجد خطأ ما",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },

    async fetchFiles(id) {
      this.conferenceVersionID = id;
      this.form.conferenceVersionID = id;
      try {
        const response = await api.get(
          `Files/GetAllFiles?PageNumber=${this.currentPage}&PageSize=${this.pageSize}&conferenceVersionID=${id}`
        );
        this.categories = response.data.items;
      } catch (error) {
        console.error("Error fetching conference versions:", error);
      }
    },

    openEditModal(version) {
      this.editForm = { ...version };
      this.editModal = true;
    },
    async updateFiles() {
      this.isLoading = true;

      const formData = new FormData();
        formData.append("ArabicDescription", this.editForm.arabicDescription);
        formData.append("EnglishDescription", this.editForm.englishDescription);
        formData.append("PersianDescription", this.editForm.persianDescription);
        formData.append("ArabicDescription", this.editForm.arabicDescription);
        formData.append("EnglishDescription", this.editForm.englishDescription);
        formData.append("PersianDescription", this.editForm.persianDescription);
        formData.append("TheFiles", this.editForm.newFile);
        formData.append("ConferenceVersionID", this.conferenceVersionID);
      try {
        await api.put(
          `Files/UpdateFiles?id=${this.editForm.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        this.$toast.open({
          message: "تم بنجاح",
          type: "success",
        });
        this.fetchFiles(this.conferenceVersionID);
        this.editModal = false;
      } catch (error) {
        this.$toast.open({
          message: "يوجد خطا ما",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }

    },
    async deleteFiles(id) {
      const { value: accept } = await this.$swal({
        Description: "هل انت متأكد من الحذف",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      });
      //
      if (!accept) return;

      this.isLoading = true;
      try {
        await api.delete(`Files/DeleteFiles?id=${id}`);
        this.fetchFiles(this.conferenceVersionID);
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
        arabicDescription: "",
        englishDescription: "",
        persianDescription: "",
      
        newFile: null,
        conferenceVersionID: null,
      };
    },
    resetEditForm() {
      this.editForm = {
        id: null,
        arabicDescription: "",
        englishDescription: "",
        persianDescription: "",
       
        newFile: null,
        conferenceVersionID: null,
      };
    },
  },

  watch: {
    currentPage() {
      this.fetchFiles(this.conferenceVersionID);
    },
  },
};
</script>
<style>
.btn-group {
  direction: rtl;
}
</style>
