<template>
  <div class="container mt-4 cb">
    <h1 class="text-center mb-4">المدونة</h1>

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="addBlog" class="row g-3">
          <div class="row">
            <div class="col-12 mb-4">
              <div class="text-center mt-4">
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="صورة المقال"
                  class="img-fluid rounded mb-2"
                  style="max-height: 200px"
                />
                <img
                  v-else
                  src="../../assets//images/placeholder-image.webp"
                  alt="صورة المقال"
                  class="img-fluid rounded mb-2"
                  style="max-height: 200px"
                />

              </div>
              <div>
                <label for="featuredImageFile" class="mt-2 mb-2">الصورة المميزة</label>
                <input
                  id="featuredImageFile"
                  type="file"
                  class="form-control"
                  @change="onFileChange"
                  accept="image/*"
                />
              </div>
            </div>

            <!-- Title Fields -->
            <div class="col-md-4">
              <label for="arabicBlogTitle" class="mt-2 mb-2" >العنوان بالعربية</label>

              <div>
                <input
                  id="arabicBlogTitle"
                  type="text"
                  v-model="form.arabicBlogTitle"
                  class="form-control"
                  placeholder="العنوان بالعربية"
                  required
                />
              </div>
            </div>

            <div class="col-md-4">
              <label for="englishBlogTitle" class="mt-2 mb-2">العنوان بالإنجليزية</label>
              <div class="">
                <input
                  id="englishBlogTitle"
                  type="text"
                  v-model="form.englishBlogTitle"
                  class="form-control"
                  placeholder="العنوان بالإنجليزية"
                  required
                />
              </div>
            </div>

            <div class="col-md-4">
              <label for="PersianBlogTitle" class="mt-2 mb-2">العنوان بالفارسية</label>

              <div class="">
                <input
                  id="PersianBlogTitle"
                  type="text"
                  v-model="form.persianBlogTitle"
                  class="form-control"
                  placeholder="العنوان بالفارسية"
                  required
                />
              </div>
            </div>

            <!-- Content Fields -->
            <div class="col-md-4">
              <label for="arabicContent" class="mt-2 mb-2">المحتوى بالعربية</label>
              <div class="">
                <textarea
                  id="arabicContent"
                  v-model="form.arabicContent"
                  class="form-control"
                  style="height: 150px"
                  placeholder="المحتوى بالعربية"
                  required
                ></textarea>
              </div>
            </div>

            <div class="col-md-4">
              <label for="englishContent" class="mt-2 mb-2">المحتوى بالإنجليزية</label>
              <div class="">
                <textarea
                  id="englishContent"
                  v-model="form.englishContent"
                  class="form-control"
                  style="height: 150px"
                  placeholder="المحتوى بالإنجليزية"
                  required
                ></textarea>
              </div>
            </div>

            <div class="col-md-4">
              <label for="persianContent" class="mt-2 mb-2">المحتوى بالفارسية</label>
              <div class="">
                <textarea
                  id="persianContent"
                  v-model="form.persianContent"
                  class="form-control"
                  style="height: 150px"
                  placeholder="المحتوى بالفارسية"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Select Fields -->
            <div class="col-md-6">
              <label class="mt-2 mb-2">المؤتمر (اختياري)</label>
              <div class="">
                <BFormSelect
                  v-model="form.conferenceVersionID"
                  :options="conferenceVersionsList"
                  class="form-select"
                />
              </div>
            </div>

            <div class="col-md-6">
              <label class="mt-2 mb-2">القسم</label>

              <div class="">
                <BFormSelect
                  v-model="form.categoryId"
                  :options="categories"
                  class="form-select"
                  required
                />
              </div>
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

    <!-- Blog List -->
    <div class="card mt-4">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>الصورة</th>
                <th>العنوان بالعربية</th>
                <th>العنوان بالإنجليزية</th>
                <th>العنوان بالفارسية</th>
                <th>القسم</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in Blogs" :key="item.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>

                  <img
                    v-if="item.featuredImageFullUrl"
                    :src="item.featuredImageFullUrl"
                    alt="صورة المقال"
                    class="img-thumbnail"
                    style="height: 50px"
                  />
                  <img
                    v-else
                    src="../../assets//images/placeholder-image.webp"
                    alt="صورة المقال"
                    class="img-thumbnail"
                    style="height: 50px"
                  />
                </td>
                <td>{{ item.arabicBlogTitle }}</td>
                <td>{{ item.englishBlogTitle }}</td>
                <td>{{ item.persianContent }}</td>
                <td>{{ getCategoryName(item.categoryId) }}</td>
                <td>
                  <div class="btn-group">
                    <button
                      class="btn btn-sm btn-warning"
                      @click="openEditModal(item)"
                      title="تعديل"
                    >
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteBlog(item.id)"
                      title="حذف"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-info"
                      @click="previewBlog(item)"
                      title="معاينة"
                    >
                      <i class="fa fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <b-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-rows="totalCount"
          :per-page="pageSize"
          align="center"
          class="mt-3"
          @change="fetchBlogs"
        ></b-pagination>
      </div>
    </div>

    <!-- Edit Modal -->
    <BModal v-model="editModal" title="تعديل المقال"  hide-footer hide-header size="lg">

      <form @submit.prevent="updateBlog" class="row g-3">
          <div class="row">
            <div class="col-12 mb-4">
              <div class="text-center mt-4">
                <img
                  v-if="editForm.featuredImageFullUrl"
                  :src="editForm.featuredImageFullUrl"
                  alt="صورة المقال"
                  class="img-fluid rounded mb-2"
                  style="max-height: 200px"
                />
                <img
                  v-else
                  src="../../assets//images/placeholder-image.webp"
                  alt="صورة المقال"
                  class="img-fluid rounded mb-2"
                  style="max-height: 200px"
                />

              </div>
              <div>
                <label for="featuredImageFile">الصورة المميزة</label>
                <input
                  id="featuredImageFile"
                  type="file"
                  class="form-control"
                  @change="onFileEditChange"
                  accept="image/*"
                />
              </div>
            </div>

            <!-- Title Fields -->
            <div class="col-md-4">
              <label for="arabicBlogTitle">العنوان بالعربية</label>

              <div>
                <input
                  id="arabicBlogTitle"
                  type="text"
                  v-model="editForm.arabicBlogTitle"
                  class="form-control"
                  placeholder="العنوان بالعربية"
                  required
                />
              </div>
            </div>

            <div class="col-md-4">
              <label for="englishBlogTitle">العنوان بالإنجليزية</label>
              <div class="">
                <input
                  id="englishBlogTitle"
                  type="text"
                  v-model="editForm.englishBlogTitle"
                  class="form-control"
                  placeholder="العنوان بالإنجليزية"
                  required
                />
              </div>
            </div>

            <div class="col-md-4">
              <label for="PersianBlogTitle">العنوان بالفارسية</label>

              <div class="">
                <input
                  id="PersianBlogTitle"
                  type="text"
                  v-model="editForm.persianBlogTitle"
                  class="form-control"
                  placeholder="العنوان بالفارسية"
                  required
                />
              </div>
            </div>

            <!-- Content Fields -->
            <div class="col-md-4">
              <label for="arabicContent">المحتوى بالعربية</label>
              <div class="">
                <textarea
                  id="arabicContent"
                  v-model="editForm.arabicContent"
                  class="form-control"
                  style="height: 150px"
                  placeholder="المحتوى بالعربية"
                  required
                ></textarea>
              </div>
            </div>

            <div class="col-md-4">
              <label for="englishContent">المحتوى بالإنجليزية</label>
              <div class="">
                <textarea
                  id="englishContent"
                  v-model="editForm.englishContent"
                  class="form-control"
                  style="height: 150px"
                  placeholder="المحتوى بالإنجليزية"
                  required
                ></textarea>
              </div>
            </div>

            <div class="col-md-4">
              <label for="persianContent">المحتوى بالفارسية</label>
              <div class="">
                <textarea
                  id="persianContent"
                  v-model="editForm.persianContent"
                  class="form-control"
                  style="height: 150px"
                  placeholder="المحتوى بالفارسية"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Select Fields -->
            <div class="col-md-6">
              <label>المؤتمر (اختياري)</label>
              <div class="">
                <BFormSelect
                  v-model="editForm.conferenceVersionID"
                  :options="conferenceVersionsList"
                  class="form-select"
                />
              </div>
            </div>

            <div class="col-md-6">
              <label>القسم</label>

              <div class="">
                <BFormSelect
                  v-model="editForm.categoryId"
                  :options="categories"
                  class="form-select"
                  required
                />
              </div>
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

    </BModal>

    <!-- Preview Modal -->
    <BModal v-model="previewModal" title="معاينة المقال" hide-footer hide-header>
      <div class="blog-preview">
        <img :src="selectedBlog?.featuredImageFullUrl" class="img-fluid mb-3" />
        <label>المحتوى بالعربية</label>
        <p>{{ selectedBlog?.arabicContent }}</p>
        <hr>
        <label>المحتوى بالإنجليزية</label>
        <p>{{ selectedBlog?.englishContent }}</p>
        <hr>
        <label>المحتوى بالفارسية</label>
        <p>{{ selectedBlog?.persianContent }}</p>
      </div>
    </BModal>
  </div>
</template>

<script>
import api from "../../js/api";

export default {
  data() {
    return {
      previewImage: null,
      searchQuery: "",
      previewModal: false,
      selectedBlog: null,
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      categories: [],
      isLoading: false,
      editModal: false,
      form: {
        arabicBlogTitle: "",
        englishBlogTitle: "",
        persianBlogTitle: "",
        arabicContent: "",
        englishContent: "",
        persianContent: "",
        featuredImageFile: null,
        categoryId: null,
        conferenceVersionID: null,
      },
      editForm: {
        id: null,
        arabicBlogTitle: "",
        englishBlogTitle: "",
        persianBlogTitle: "",
        arabicContent: "",
        englishContent: "",
        persianContent: "",
        featuredImageFile: null,
        categoryId: null,
        conferenceVersionID: null,
        featuredImageFullUrl: "",
      },
      Blogs: [],
      conferenceVersionsList: [],
    };
  },
  methods: {
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.featuredImageFile = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },

    async onFileEditChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.editForm.featuredImageFile = file;
        this.editForm.featuredImageFullUrl = URL.createObjectURL(file);
      }
    },

    getCategoryName(categoryId) {
      const category = this.categories.find((cat) => cat.value === categoryId);
      return category ? category.text : "";
    },

    previewBlog(blog) {
      this.selectedBlog = blog;
      this.previewModal = true;
    },

    async fetchCategories() {
      try {
        const response = await api.get(
          `Category/GetAllCategories?PageNumber=1&PageSize=100`
        );
        this.categories = response.data.items.map((value) => ({
          text: value.arabicName,
          value: value.id,
        }));
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب الأقسام");
      }
    },

    async fetchConferenceVersions() {
      try {
        const response = await api.get(
          "ConferenceVersion/GetAllConferenceVersions?PageNumber=1&PageSize=100"
        );
        this.conferenceVersionsList = response.data.items.map((value) => ({
          text: `${value.arabicName} - ${value.year}`,
          value: value.id,
        }));
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب قائمة المؤتمرات");
      }
    },

    async fetchBlogs() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `Blog/GetAllBlogs?PageNumber=${this.currentPage}&PageSize=${this.pageSize}&search=${this.searchQuery}`
        );
        this.Blogs = response.data.items;
        this.totalPages = response.data.totalPages;
        this.totalCount = response.data.totalCount;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب المقالات");
      } finally {
        this.isLoading = false;
      }
    },

    async addBlog() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        Object.keys(this.form).forEach((key) => {
          formData.append(key, this.form[key]);
        });

        await api.post("Blog/AddBlog", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.fetchBlogs();
        this.resetForm();
        this.$toast.success("تم إضافة المقال بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء إضافة المقال");
      } finally {
        this.isLoading = false;
      }
    },

    async updateBlog() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        Object.keys(this.editForm).forEach((key) => {
          formData.append(key, this.editForm[key]);
        });

        await api.put(`Blog/UpdateBlog?id=${this.editForm.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.fetchBlogs();
        this.editModal = false;
        this.$toast.success("تم تحديث المقال بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء تحديث المقال");
      } finally {
        this.isLoading = false;
      }
    },

    async deleteBlog(id) {
      const { value: accept } = await this.$swal({
        title: "هل تريد حذف المقال؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      });

      if (!accept) return;

      this.isLoading = true;
      try {
        await api.delete(`Blog/DeleteBlog?id=${id}`);
        this.fetchBlogs();
        this.$toast.success("تم حذف المقال بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء حذف المقال");
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.form = {
        arabicBlogTitle: "",
        englishBlogTitle: "",
        persianBlogTitle: "",
        arabicContent: "",
        englishContent: "",
        persianContent: "",
        featuredImageFile: null,
        categoryId: null,
        conferenceVersionID: null,
      };
      this.previewImage = null;
    },

    openEditModal(blog) {
      this.editForm = { ...blog };
      this.editModal = true;
    },
  },
  mounted() {
    this.fetchCategories();
    this.fetchConferenceVersions();
    this.fetchBlogs();
  },
};
</script>

<style>
.blog-preview img {
  width: 100%;
  height: auto;
}

.btn-group {
  direction: ltr;
}
</style>
