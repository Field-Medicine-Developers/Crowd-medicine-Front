<template>
  <conferenceVersionSelect @fetch-id="fetchCategories" />

  <div class="container mt-4 cb" dir="rtl" v-if="conferenceVersionID !== null">
    <h1 class="text-center mb-4">اقسام اللجان</h1>
    <div class="card">
      <div class="card-body">
    <form @submit.prevent="addCategories">
      <div class="row">
        <div class="col-md-4">
          <label for="arabicName" class="form-label">الاسم بالعربية</label>
          <input
            id="arabicName"
            type="text"
            v-model="form.arabicTitle"
            required
            class="form-control"
            placeholder="الاسم بالعربية"
          />
        </div>
        <div class="col-md-4">
          <label for="englishName" class="form-label">الاسم بالإنجليزية</label>
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
          <label for="persianName" class="form-label">الاسم بالفارسية</label>
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
          <th>الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in categories" :key="item.id">
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>{{ item.arabicTitle }}</td>
          <td>{{ item.englishTitle }}</td>
          <td>{{ item.persianTitle }}</td>
          <td>
            <div class="btn-group">
            <button class="btn btn-warning btn-sm" @click="openEditModal(item)">
              تعديل
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteCategories(item.id)">
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
      <form @submit.prevent="updateCategories">
        <div class="mb-3">
          <label for="editArabicName" class="form-label">الاسم بالعربية</label>
          <input
            id="editArabicName"
            type="text"
            v-model="editForm.arabicTitle"
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
            v-model="editForm.englishTitle"
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
            v-model="editForm.persianTitle"
            required
            class="form-control"
            placeholder="الاسم بالفارسية"
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
      conferenceVersionID : null,
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      isLoading: false,
      editModal: false,
      form: {
        arabicTitle: "",
        englishTitle: "",
        persianTitle: "",
        conferenceVersionID : null,
      },
      editForm: {
        id: null,
        arabicTitle: "",
        englishTitle: "",
        persianTitle: "",
        conferenceVersionID : null,
      },
      categories: [],
    };
  },
  methods: {
    async fetchCategories(id) {
      this.conferenceVersionID = id;
      this.form.conferenceVersionID = id;
      try {
        const response = await api.get(
          `Committees/GetCommitteesCategoryById?PageNumber=${this.currentPage}&PageSize=${this.pageSize}&conferenceVersionID=${id}`
        );
        this.categories = response.data.items;
      } catch (error) {
        console.error("Error fetching conference versions:", error);
      }
    },
    async addCategories() {
      this.isLoading = true;
      try {
        await api.post("Committees/AddCommitteesCategory", this.form);
        this.$toast.open({
          message: "تم بنجاح",
          type: "success",
        });
        this.fetchCategories(this.conferenceVersionID);
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
    async updateCategories() {
      this.isLoading = true;
      try {
        await api.put(
          `Committees/UpdateCommitteesCategory?id=${this.editForm.id}`,
          this.editForm
        );
        this.fetchCategories(this.conferenceVersionID);
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
    async deleteCategories(id) {

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
        await api.delete(`Committees/DeleteCommitteesCategory?id=${id}`);
        this.fetchCategories(this.conferenceVersionID);
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
        arabicTitle: "",
        englishTitle: "",
        persianTitle: "",
        year: "",
      };
    },
    resetEditForm() {
      this.editForm = {
        id: null,
        arabicTitle: "",
        englishTitle: "",
        persianTitle: "",
        year: "",
      };
    },
  },

  watch: {
    currentPage() {
      this.fetchCategories(this.conferenceVersionID);
    },
  },
};
</script>
<style>
 .btn-group {
    direction: ltr;
}
</style>
