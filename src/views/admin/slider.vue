<template>
  <div class="container mt-4 cb">
    <h1 class="text-center mb-4">عارض الصور</h1>

    <!-- Add Form Card -->
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="addSlider" class="row g-3">
          <div class="row">
            <div class="col-12 mb-4">
              <div class="text-center mt-4">
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="صورة العارض"
                  class="img-fluid rounded mb-2"
                  style="max-height: 200px"
                />
                <img
                  v-else
                  src="../../assets/images/placeholder-image.webp"
                  alt="صورة العارض"
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
                  required
                />
              </div>
            </div>
             
            <div class="col-md-12">
              <label class="mt-2 mb-2">المؤتمر</label>
              <div class="">
                <BFormSelect
                  v-model="form.conferenceVersionID"
                  :options="conferenceVersionsList"
                  class="form-select"
                  required
                />
              </div>
            </div>
          </div>
          
          <div class="col-12">
            <BButton
              type="submit"
              variant="primary"
              :loading="isLoading"
              loading-text="يرجى الانتظار"
              :disabled="isLoading"
            >
              إضافة
            </BButton>
          </div>
        </form>
      </div>
    </div>


    <!-- Slider List -->
    <div class="card mt-4">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>الصورة</th>
                <th>المؤتمر</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in Sliders" :key="item.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>
                  <img
                    v-if="item.imageFullUrl"
                    :src="item.imageFullUrl"
                    alt="صورة العارض"
                    class="img-thumbnail"
                    style="height: 50px"
                  />
                  <img
                    v-else
                    src="../../assets/images/placeholder-image.webp"
                    alt="صورة العارض"
                    class="img-thumbnail"
                    style="height: 50px"
                  />
                </td>
                <td>{{ item.conferenceVersion != null ? item.conferenceVersion.arabicName : "-" }}</td>
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
                      @click="deleteSlider(item.id)"
                      title="حذف"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <b-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-rows="totalCount"
          :per-page="pageSize"
          align="center"
          class="mt-3"
          @change="fetchSliders"
        ></b-pagination>
      </div>
    </div>

    <!-- Edit Modal -->
    <BModal 
      v-model="editModal" 
      title="تعديل الصورة"  
      hide-footer 
      hide-header 
      size="lg"
    >
      <form @submit.prevent="updateSlider" class="row g-3">
        <div class="row">
          <div class="col-12 mb-4">
            <div class="text-center mt-4">
              <img
                v-if="editForm.featuredImageFullUrl"
                :src="editForm.featuredImageFullUrl"
                alt="صورة العارض"
                class="img-fluid rounded mb-2"
                style="max-height: 200px"
              />
              <img
                v-else
                src="../../assets/images/placeholder-image.webp"
                alt="صورة العارض"
                class="img-fluid rounded mb-2"
                style="max-height: 200px"
              />
            </div>
            <div>
              <label for="editFeaturedImageFile" class="mt-2 mb-2">الصورة المميزة</label>
              <input
                id="editFeaturedImageFile"
                type="file"
                class="form-control"
                @change="onFileEditChange"
                accept="image/*"
              />
            </div>
          </div>

          <div class="col-md-12">
            <label class="mt-2 mb-2">المؤتمر</label>
            <div class="">
              <BFormSelect
                v-model="editForm.conferenceVersionID"
                :options="conferenceVersionsList"
                class="form-select"
              />
            </div>
          </div>
        </div>

        <div class="col-12">
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
    </BModal>
  </div>
</template>

<script>
import api from "../../js/api";
import { debounce } from 'lodash';

export default {
  data() {
    return {
      previewImage: null,
      searchQuery: "",
      previewModal: false,
      selectedSlider: null,
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      isLoading: false,
      editModal: false,
      form: {
        TheImage: null,
        conferenceVersionID: null,
      },
      editForm: {
        id: null,
        conferenceVersionID: null,
        featuredImageFullUrl: null,
        featuredImageFile: null,
      },
      Sliders: [],
      conferenceVersionsList: [],
    };
  },

  created() {
    // Initialize debounced search
    this.debounceSearch = debounce(() => {
      this.currentPage = 1;
      this.fetchSliders();
    }, 500);
  },

  methods: {
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.TheImage = file;
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

    async fetchSliders() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `Slider/GetAllSliders?PageNumber=${this.currentPage}&PageSize=${this.pageSize}`
        );
        this.Sliders = response.data.items;
        this.totalPages = response.data.totalPages;
        this.totalCount = response.data.totalCount;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب الصور");
      } finally {
        this.isLoading = false;
      }
    },

    async addSlider() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append('TheImage', this.form.TheImage);
        if (this.form.conferenceVersionID) {
          formData.append('conferenceVersionID', this.form.conferenceVersionID);
        }

        await api.post("Slider/AddSlider", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await this.fetchSliders();
        this.resetForm();
        this.$toast.success("تم إضافة الصورة بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء إضافة الصورة");
      } finally {
        this.isLoading = false;
      }
    },

    async updateSlider() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        if (this.editForm.featuredImageFile) {
          formData.append('TheImage', this.editForm.featuredImageFile);
        }
        if (this.editForm.conferenceVersionID) {
          formData.append('conferenceVersionID', this.editForm.conferenceVersionID);
        }

        await api.put(`Slider/UpdateSlider?id=${this.editForm.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await this.fetchSliders();
        this.editModal = false;
        this.$toast.success("تم تحديث الصورة بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء تحديث الصورة");
      } finally {
        this.isLoading = false;
      }
    },

    async deleteSlider(id) {
      const { value: accept } = await this.$swal({
        title: "هل تريد حذف الصورة؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      });

      if (!accept) return;

      this.isLoading = true;
      try {
        await api.delete(`Slider/DeleteSlider?id=${id}`);
        await this.fetchSliders();
        this.$toast.success("تم حذف الصورة بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء حذف الصورة");
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.form = {
        TheImage: null,
        conferenceVersionID: null,
      };
      this.previewImage = null;
    },

    openEditModal(slider) {
      this.editForm = {
        id: slider.id,
        conferenceVersionID: slider.conferenceVersionID,
        featuredImageFullUrl: slider.featuredImageFullUrl,
        featuredImageFile: null,
      };
      this.editModal = true;
    },
  },

  mounted() {
    this.fetchConferenceVersions();
    this.fetchSliders();
  },


};
</script>

<style>
.slider-preview img {
  width: 100%;
  height: auto;
}

.btn-group {
  direction: ltr;
}
</style>