<template>
  <div class="container mt-4 cb" dir="rtl">
    <h1 class="text-center mb-4">إدارة الإصدارات</h1>
    <div class="card">
      <div class="card-body">
    <form @submit.prevent="addConferenceVersion">
      <div class="row">
        <div class="col-md-3">
          <label for="arabicName" class="form-label">الاسم بالعربية</label>
          <input
            id="arabicName"
            type="text"
            v-model="form.arabicName"
            required
            class="form-control"
            placeholder="الاسم بالعربية"
          />
        </div>
        <div class="col-md-3">
          <label for="englishName" class="form-label">الاسم بالإنجليزية</label>
          <input
            id="englishName"
            type="text"
            v-model="form.englishName"
            required
            class="form-control"
            placeholder="الاسم بالإنجليزية"
          />
        </div>
        <div class="col-md-3">
          <label for="persianName" class="form-label">الاسم بالفارسية</label>
          <input
            id="persianName"
            type="text"
            v-model="form.persianName"
            required
            class="form-control"
            placeholder="الاسم بالفارسية"
          />
        </div>
        <div class="col-md-3">
          <label for="year" class="form-label">السنة</label>
          <input
            id="year"
            type="text"
            v-model="form.year"
            required
            class="form-control"
            placeholder="السنة"
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
          <th>الاسم بالعربية</th>
          <th>الاسم بالإنجليزية</th>
          <th>الاسم بالفارسية</th>
          <th>السنة</th>
          <th>الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in conferenceVersions" :key="item.id">
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>{{ item.arabicName }}</td>
          <td>{{ item.englishName }}</td>
          <td>{{ item.persianName }}</td>
          <td>{{ item.year }}</td>
          <td>
            <div class="btn-group">
            <button class="btn btn-warning btn-sm" @click="openEditModal(item)">
              تعديل
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteConferenceVersion(item.id)"
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
      <form @submit.prevent="updateConferenceVersion">
        <div class="mb-3">
          <label for="editArabicName" class="form-label">الاسم بالعربية</label>
          <input
            id="editArabicName"
            type="text"
            v-model="editForm.arabicName"
            required
            class="form-control"
            placeholder="الاسم بالعربية"
          />
        </div>
        <div class="mb-3">
          <label for="editEnglishName" class="form-label"
            >الاسم بالإنجليزية</label
          >
          <input
            id="editEnglishName"
            type="text"
            v-model="editForm.englishName"
            required
            class="form-control"
            placeholder="الاسم بالإنجليزية"
          />
        </div>
        <div class="mb-3">
          <label for="editPersianName" class="form-label"
            >الاسم بالفارسية</label
          >
          <input
            id="editPersianName"
            type="text"
            v-model="editForm.persianName"
            required
            class="form-control"
            placeholder="الاسم بالفارسية"
          />
        </div>
        <div class="mb-3">
          <label for="editYear" class="form-label">السنة</label>
          <input
            id="editYear"
            type="text"
            v-model="editForm.year"
            required
            class="form-control"
            placeholder="السنة"
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
export default {
  data() {
    return {
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,

      isLoading: false,
      editModal: false,
      form: {
        arabicName: "",
        englishName: "",
        persianName: "",
        year: "",
      },
      editForm: {
        id: null,
        arabicName: "",
        englishName: "",
        persianName: "",
        year: "",
      },
      conferenceVersions: [],
    };
  },
  methods: {
    async fetchConferenceVersions() {
      try {
        const response = await api.get(
          `ConferenceVersion/GetAllConferenceVersions?PageNumber=${this.currentPage}&PageSize=${this.pageSize}`
        );
        this.conferenceVersions = response.data.items;
        this.totalPages = response.data.totalPages;
        this.totalCount = response.data.totalCount;
        this.pageNumber = response.data.pageNumber;
      } catch (error) {
        console.error("Error fetching conference versions:", error);
      }
    },
    async addConferenceVersion() {
      this.isLoading = true;
      try {
        await api.post("ConferenceVersion/AddConferenceVersion", this.form);
        this.fetchConferenceVersions();
        this.resetForm();
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
    openEditModal(version) {
      this.editForm = { ...version };
      this.editModal = true;
    },
    async updateConferenceVersion() {
      this.isLoading = true;
      try {
        await api.put(
          `ConferenceVersion/UpdateConferenceVersion?id=${this.editForm.id}`,
          this.editForm
        );
        this.fetchConferenceVersions();
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
    async deleteConferenceVersion(id) {

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
        await api.delete(`ConferenceVersion/DeleteConferenceVersion?id=${id}`);
        this.fetchConferenceVersions();
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
        arabicName: "",
        englishName: "",
        persianName: "",
        year: "",
      };
    },
    resetEditForm() {
      this.editForm = {
        id: null,
        arabicName: "",
        englishName: "",
        persianName: "",
        year: "",
      };
    },
  },

  watch: {
    currentPage() {
      this.fetchConferenceVersions();
    },
  },

  created() {
    this.fetchConferenceVersions();
  },
};
</script>
