<template>
  <conferenceVersionSelect @fetch-id="fetchCategories" />

  <div class="container mt-4 cb" v-if="conferenceVersionID !== null">
    <h1 class="text-center mb-4">اعضاء اللجان</h1>
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="addCommitteeItems" class="row g-3 mt-4">
          <div class="row">
            <!-- المؤتمر -->
            <div class="col-md-12 mt-3">
              <label class="form-label">القسم</label>
              <BFormSelect
                v-model="form.committeesCategoryId"
                :options="committeesCategories"
                @change="fetchCommitteeItemss()"
                class="form-select"
                required
              />
            </div>

            <!-- أعضاء اللجنة -->
            <div class="col-12 mt-4">
              <h5>أعضاء اللجنة</h5>
              <div
                v-for="(item, index) in form.CommitteeItemssItems"
                :key="index"
                class="border p-3 mb-3 rounded"
              >
                <div class="row">
                  <div class="col-md-4">
                    <label class="form-label">الاسم بالعربية</label>
                    <input
                      type="text"
                      v-model="item.arabicName"
                      required
                      class="form-control"
                      placeholder="الاسم بالعربية"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">الاسم بالإنجليزية</label>
                    <input
                      type="text"
                      v-model="item.englishName"
                      required
                      class="form-control"
                      placeholder="الاسم بالإنجليزية"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">الاسم بالفارسية</label>
                    <input
                      type="text"
                      v-model="item.persianName"
                      required
                      class="form-control"
                      placeholder="الاسم بالفارسية"
                    />
                  </div>

                  <div class="col-md-4 mt-3">
                    <label class="form-label">المسمى الوظيفي بالعربية</label>
                    <input
                      type="text"
                      v-model="item.arabicJobTitle"
                      required
                      class="form-control"
                      placeholder="المسمى الوظيفي بالعربية"
                    />
                  </div>
                  <div class="col-md-4 mt-3">
                    <label class="form-label">المسمى الوظيفي بالإنجليزية</label>
                    <input
                      type="text"
                      v-model="item.englishJobTitle"
                      required
                      class="form-control"
                      placeholder="المسمى الوظيفي بالإنجليزية"
                    />
                  </div>
                  <div class="col-md-4 mt-3">
                    <label class="form-label">المسمى الوظيفي بالفارسية</label>
                    <input
                      type="text"
                      v-model="item.persianJobTitle"
                      required
                      class="form-control"
                      placeholder="المسمى الوظيفي بالفارسية"
                    />
                  </div>

                  <div class="col-12 mt-2">
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="removeCommitteeItemsItem(index)"
                    >
                      حذف العضو
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="btn btn-secondary mt-2"
                @click="addCommitteeItemsItem"
              >
                إضافة عضو جديد
              </button>
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
              إضافة
            </BButton>
          </div>
        </form>
      </div>
    </div>

    <!-- CommitteeItemss List -->
    <div class="card mt-4">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>الاسم بالعربي</th>
                <th>الاسم بالإنجليزية</th>
                <th>الاسم بالفارسي</th>
                <th>المسمى الوظيفي بالعربي</th>
                <th>المسمى الوظيفي بالإنجليزية</th>
                <th>المسمى الوظيفي بالفارسي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in CommitteeItemss" :key="item.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ item.arabicName }}</td>
                <td>{{ item.englishName }}</td>
                <td>{{ item.persianName }}</td>
                <td>{{ item.arabicJobTitle }}</td>
                <td>{{ item.englishJobTitle }}</td>
                <td>{{ item.persianJobTitle }}</td>
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
                      @click="deleteCommitteeItems(item.id)"
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

        
      </div>
    </div>

    <!-- Edit Modal -->
    <BModal v-model="editModal" title="تعديل اللجنة" hide-footer size="lg">
      <form @submit.prevent="updateCommitteeItems" class="row g-3">
        <div class="row">
          <!-- المؤتمر -->
          <div class="col-md-12 mt-3">
            <label class="form-label">القسم</label>
            <BFormSelect
              v-model="editForm.committeesCategoryId"
              :options="committeesCategories"
              class="form-select"
              required
            />
          </div>

          <div class="col-12 mt-4">
            <h5>أعضاء اللجنة</h5>
            <div class="row">
              <div class="col-md-4">
                <label class="form-label">الاسم بالعربية</label>
                <input
                  type="text"
                  v-model="editForm.arabicName"
                  required
                  class="form-control"
                  placeholder="الاسم بالعربية"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">الاسم بالإنجليزية</label>
                <input
                  type="text"
                  v-model="editForm.englishName"
                  required
                  class="form-control"
                  placeholder="الاسم بالإنجليزية"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">الاسم بالفارسية</label>
                <input
                  type="text"
                  v-model="editForm.persianName"
                  required
                  class="form-control"
                  placeholder="الاسم بالفارسية"
                />
              </div>
              <div class="col-md-4 mt-3">
                <label class="form-label">المسمى الوظيفي بالعربية</label>
                <input
                  type="text"
                  v-model="editForm.arabicJobTitle"
                  required
                  class="form-control"
                  placeholder="المسمى الوظيفي بالعربية"
                />
              </div>
              <div class="col-md-4 mt-3">
                <label class="form-label">المسمى الوظيفي بالإنجليزية</label>
                <input
                  type="text"
                  v-model="editForm.englishJobTitle"
                  required
                  class="form-control"
                  placeholder="المسمى الوظيفي بالإنجليزية"
                />
              </div>
              <div class="col-md-4 mt-3">
                <label class="form-label">المسمى الوظيفي بالفارسية</label>
                <input
                  type="text"
                  v-model="editForm.persianJobTitle"
                  required
                  class="form-control"
                  placeholder="المسمى الوظيفي بالفارسية"
                />
              </div>
            </div>
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
    </BModal>
  </div>
</template>
<script>
import api from "../../js/api";
import { debounce } from "lodash";
import conferenceVersionSelect from "../../components/conferenceVersionSelect.vue";

export default {
  components: {
    conferenceVersionSelect,
  },
  data() {
    return {
      searchQuery: "",
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      conferenceVersionID: null,
      isLoading: false,
      editModal: false,
      form: {
        committeesCategoryId: null,
        CommitteeItemssItems: [],
      },
      editForm: {
        id: null,
        committeesCategoryId: null,
      },
      CommitteeItemss: [],
      committeesCategories: [],
    };
  },

  created() {
    // Initialize debounced search
    this.debounceSearch = debounce(() => {
      this.currentPage = 1;
      this.fetchCommitteeItemss(this.form.committeesCategoryId);
    }, 500);

    // Add initial empty CommitteeItems item
    this.addCommitteeItemsItem();
  },

  methods: {
    getEmptyCommitteeItemsItem() {
      return {
        arabicName: "",
        englishName: "",
        persianName: "",
        arabicJobTitle: "",
        englishJobTitle: "",
        persianJobTitle: "",
      };
    },

    addCommitteeItemsItem() {
      this.form.CommitteeItemssItems.push(this.getEmptyCommitteeItemsItem());
    },

    removeCommitteeItemsItem(index) {
      if (this.form.CommitteeItemssItems.length > 1) {
        this.form.CommitteeItemssItems.splice(index, 1);
      }
    },

    addEditCommitteeItemsItem() {
      this.editForm.CommitteeItemssItems.push(
        this.getEmptyCommitteeItemsItem()
      );
      console.log(this.editForm.CommitteeItemssItems);
    },

    removeEditCommitteeItemsItem(index) {
      if (this.editForm.CommitteeItemssItems.length > 1) {
        this.editForm.CommitteeItemssItems.splice(index, 1);
      }
    },

    async fetchCategories(id) {
      this.conferenceVersionID = id;
      this.form.conferenceVersionID = id;
      try {
        const response = await api.get(
          `Committees/GetCommitteesCategoryById?PageNumber=1&PageSize=100&conferenceVersionID=${id}`
        );
        if (response.data.items.length > 0) {
          this.committeesCategories = response.data.items.map((value) => ({
            text: `${value.arabicTitle}`,
            value: value.id,
          }));
        }
      } catch (error) {
        console.error("Error fetching conference versions:", error);
      }
    },

    async fetchCommitteeItemss() {
      
      if (!this.form.committeesCategoryId) {
        this.$toast.warning("يرجى اختيار القسم أولاً");
        return;
      }

      this.isLoading = true;
      try {
        const response = await api.get(
          `Committees/GetCommitteesItemByCategoryId?PageNumber=${this.currentPage}&PageSize=10000&categoryId=${this.form.committeesCategoryId}`
        );
        
        if (response.data && response.data.items) {
          this.CommitteeItemss = response.data.items;
          this.totalPages = response.data.totalPages;
          this.totalCount = response.data.totalCount;
          
          // Reset to first page if current page is greater than total pages
          if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
            await this.fetchCommitteeItemss();
          }
        }
      } catch (error) {
        console.error("Error fetching committee items:", error);
        this.$toast.error("حدث خطأ أثناء جلب اللجان");
      } finally {
        this.isLoading = false;
      }
    },

    async addCommitteeItems() {
  this.isLoading = true;
  try {
    for (const item of this.form.CommitteeItemssItems) {
      item.committeesCategoryId = this.form.committeesCategoryId;
      await api.post("Committees/AddCommitteesItem", item);
    }
    await this.fetchCommitteeItemss();
    this.resetForm();
    this.$toast.success("تم إضافة اللجنة بنجاح");
  } catch (error) {
    this.$toast.error("حدث خطأ أثناء إضافة اللجنة");
    console.error(error);
  } finally {
    this.isLoading = false;
  }
},

    async updateCommitteeItems() {
      this.isLoading = true;
      try {
        await api.put(
          `Committees/UpdateCommitteesItem?id=${this.editForm.id}`,
          {
            ...this.editForm,
            conferenceVersionID: Number(this.editForm.conferenceVersionID),
          }
        );

        await this.fetchCommitteeItemss();
        this.editModal = false;
        this.$toast.success("تم تحديث اللجنة بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء تحديث اللجنة");
      } finally {
        this.isLoading = false;
      }
    },

    async deleteCommitteeItems(id) {
      const { value: accept } = await this.$swal({
        title: "هل تريد حذف العضو؟",
        text: "لن تتمكن من استرجاع هذه اللجنة بعد الحذف",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
      });

      if (!accept) return;

      this.isLoading = true;
      try {
        await api.delete(`Committees/DeleteCommitteesItem?id=${id}`);
        await this.fetchCommitteeItemss();
        this.$toast.success("تم حذف اللجنة بنجاح");
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء حذف اللجنة");
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.form = {
        CommitteeItemssItems: [this.getEmptyCommitteeItemsItem()],
      };
    },

    openEditModal(CommitteeItems) {
      console.log(CommitteeItems);
      this.editForm = {
        ...CommitteeItems,
      };
      console.log(CommitteeItems.committeesCategoryId);
      this.editForm.committeesCategoryId = CommitteeItems.committeesCategoryId;
      this.editModal = true;
    },
  },

  mounted() {},
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
