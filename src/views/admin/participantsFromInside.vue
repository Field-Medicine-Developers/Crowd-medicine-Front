<template>
  <div class="container my-5">
    <div class="conference-header text-center mb-5">
      <h1 class="conference-title">{{ $t('insideParticipantsList') }}</h1>
    </div>

    <!-- Language Selector -->
    <!-- <div class="language-selector mb-4">
      <label for="languageSelect" class="form-label">{{ $t('selectLanguage') }}</label>
      <select id="languageSelect" v-model="$i18n.locale" class="form-select w-auto" @change="fetchParticipants">
        <option value="ar">العربية</option>
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>
    </div> -->

    <div class="search-filters mb-4">
      <div class="row g-3">
        <div class="col-md-6">
          <b-form-group :label="$t('fullName')" label-for="searchFullName">
            <b-form-input
              id="searchFullName"
              v-model="searchFilters.fullName"
              :placeholder="$t('searchFullNamePlaceholder')"
              @input="debouncedFetchParticipants"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
    </div>

    <b-card no-body class="shadow-lg">
      <b-card-header class="bg-gradient-primary text-white py-3">
        <h4 class="mb-0">
          <i class="fa fa-users mr-2"></i>
          {{ $t('insideParticipantsList') }}
        </h4>
      </b-card-header>
      <b-card-body>
        <b-table
          :items="tableItems"
          :fields="tableFields"
          striped
          hover
          responsive
          :busy="isLoading"
          class="participants-table"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="mr-2">{{ $t('loading') }}</strong>
            </div>
          </template>

          <template #cell(fullName)="row">
            {{ row.item.fullName || '-' }}
          </template>

          <template #cell(governorate)="row">
            {{ getGovernorateName(row.item.governorate) }}
          </template>

          <template #cell(nationalCard)="row">
            <a v-if="row.item.nationalCardFullUrl" :href="row.item.nationalCardFullUrl" target="_blank" class="btn btn-sm btn-outline-primary">
              {{ $t('viewNationalCard') }}
            </a>
            <span v-else>{{ $t('noFile') }}</span>
          </template>

          <template #cell(powerPoint)="row">
            <a v-if="row.item.powerPointUrl" :href="row.item.powerPointUrl" target="_blank" class="btn btn-sm btn-outline-primary">
              {{ $t('viewPowerPoint') }}
            </a>
            <span v-else>{{ $t('noFile') }}</span>
          </template>

          <template #cell(note)="row">
            {{ row.item.note || '-' }}
          </template>

          <template #cell(actions)="row">
            <b-button variant="warning" size="sm" @click="openEditModal(row.item)" class="mr-2">
              {{ $t('edit') }}
            </b-button>
            <b-button variant="danger" size="sm" @click="openDeleteModal(row.item)">
              {{ $t('delete') }}
            </b-button>
          </template>
        </b-table>

        <b-pagination
          v-model="currentPage"
          :total-rows="pagination.totalCount"
          :per-page="pageSize"
          align="center"
          @change="onPageChange"
          class="mt-4"
        />
      </b-card-body>
    </b-card>

    <b-modal v-model="showEditModal" :title="$t('editParticipant')" size="lg" @ok="handleSave" :ok-title="$t('save')" :cancel-title="$t('cancel')">
      <b-form @submit.prevent="handleSave">
        <div class="row g-3">
          <div class="col-12">
            <h5 class="section-title">{{ $t('personalInformation') }}</h5>
          </div>
          <b-form-group
            class="col-md-6"
            :label="$t('fullName') + ' *'"
            label-for="fullName"
          >
            <b-form-input
              id="fullName"
              v-model="editForm.fullName"
              :placeholder="$t('fullNamePlaceholder')"
              required
              :state="formErrors.fullName ? false : null"
            ></b-form-input>
            <b-form-invalid-feedback v-if="formErrors.fullName">{{ formErrors.fullName }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="col-md-6"
            :label="$t('governorate') + ' *'"
            label-for="governorate"
          >
            <b-form-select
              id="governorate"
              v-model="editForm.governorate"
              :options="governorates"
              required
              :state="formErrors.governorate ? false : null"
            ></b-form-select>
            <b-form-invalid-feedback v-if="formErrors.governorate">{{ formErrors.governorate }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="col-md-6"
            :label="$t('TheNationalCard') + ' *'"
            label-for="nationalCardFile"
          >
            <b-form-file
              id="nationalCardFile"
              v-model="editForm.nationalCardFile"
              accept=".pdf,.png,.jpg,.jpeg"
              :state="formErrors.nationalCardFile ? false : null"
              @change="onNationalCardFileChange"
            ></b-form-file>
            <a v-if="editForm.nationalCardFullUrl" :href="editForm.nationalCardFullUrl" target="_blank" class="mt-2 d-block">{{ $t('viewCurrentNationalCard') }}</a>
            <b-form-invalid-feedback v-if="formErrors.nationalCardFile">{{ formErrors.nationalCardFile }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="col-md-6"
            :label="$t('powerPoint') + ' *'"
            label-for="powerPointFile"
          >
            <b-form-file
              id="powerPointFile"
              v-model="editForm.powerPointFile"
              accept=".ppt,.pptx"
              :state="formErrors.powerPointFile ? false : null"
              @change="onPowerPointFileChange"
            ></b-form-file>
            <a v-if="editForm.powerPointUrl" :href="editForm.powerPointUrl" target="_blank" class="mt-2 d-block">{{ $t('viewCurrentPowerPoint') }}</a>
            <b-form-invalid-feedback v-if="formErrors.powerPointFile">{{ formErrors.powerPointFile }}</b-form-invalid-feedback>
          </b-form-group>

          <div class="col-12">
            <h5 class="section-title">{{ $t('notes') }}</h5>
          </div>
          <b-form-group
            class="col-md-12"
            :label="$i18n.locale === 'ar' ? $t('ArNote') : $i18n.locale === 'en' ? $t('EnNote') : $t('PeNote')"
            label-for="note"
          >
            <b-form-textarea
              id="note"
              v-model="editForm.note"
              :placeholder="$t('NotePlaceholder')"
              rows="4"
            ></b-form-textarea>
          </b-form-group>
        </div>
      </b-form>
    </b-modal>

    <b-modal v-model="showDeleteModal" :title="$t('confirmDelete')" ok-variant="danger" :ok-title="$t('delete')" :cancel-title="$t('cancel')" @ok="handleDelete">
      <p>{{ $t('confirmDeleteMessage') }}</p>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import { BCard, BCardHeader, BCardBody, BTable, BPagination, BButton, BModal, BForm, BFormGroup, BFormInput, BFormFile, BFormSelect, BFormTextarea, BSpinner, BFormInvalidFeedback } from 'bootstrap-vue-next';
import { debounce } from 'lodash';

export default {
  name: 'ParticipantsInsideList',
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BTable,
    BPagination,
    BButton,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormFile,
    BFormSelect,
    BFormTextarea,
    BSpinner,
    BFormInvalidFeedback,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      pageSize: 10,
      pagination: {
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      tableItems: [],
      showEditModal: false,
      showDeleteModal: false,
      searchFilters: {
        fullName: '',
      },
      editForm: {
        id: null,
        fullName: '',
        governorate: '',
        nationalCardFile: null,
        nationalCardFullUrl: '',
        powerPointFile: null,
        powerPointUrl: '',
        note: '',
        conferenceVersionID: 3,
      },
      formErrors: {},
      deleteItem: null,
      governorates: [
        { value: '', text: this.$t('chooseGovernorate') },
        { value: 1, text: "بغداد" },
        { value: 2, text: "البصرة" },
        { value: 3, text: "الموصل" },
        { value: 4, text: "أربيل" },
        { value: 5, text: "السليمانية" },
        { value: 6, text: "كركوك" },
        { value: 7, text: "دهوك" },
        { value: 8, text: "القادسية" },
        { value: 9, text: "كربلاء" },
        { value: 10, text: "النجف" },
        { value: 11, text: "السماوة" },
        { value: 12, text: "الناصرية" },
        { value: 13, text: "الانبار" },
        { value: 14, text: "صلاح الدين" },
        { value: 15, text: "بابل" },
        { value: 16, text: "الكوت" },
        { value: 17, text: "ميسان" },
        { value: 18, text: "ديالى" }
      ],
    };
  },
  computed: {
    tableFields() {
      return [
        { key: 'fullName', label: this.$t('fullName'), sortable: true },
        { key: 'governorate', label: this.$t('governorate'), sortable: true },
        { key: 'nationalCard', label: this.$t('TheNationalCard') },
        { key: 'powerPoint', label: this.$t('powerPoint') },
        { key: 'note', label: this.$t('notes') },
        { key: 'actions', label: this.$t('actions') },
      ];
    },
  },
  created() {
    this.debouncedFetchParticipants = debounce(this.fetchParticipants, 500);
  },
  mounted() {
    this.fetchParticipants();
  },
  methods: {
    async fetchParticipants() {
      this.isLoading = true;
      try {
        const response = await axios.get('https://api.int-mgm.org/api/InsideIraq/GetAllInformationInsideIraq', {
          params: {
            PageNumber: this.currentPage,
            PageSize: this.pageSize,
            FullName: this.searchFilters.fullName || undefined,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: '*/*',
          },
        });
        this.tableItems = response.data.items.map(item => ({
          ...item,
          fullName: item.fullName || '-',
          note: item.note || '-',
        }));
        this.pagination = {
          totalCount: response.data.totalCount,
          totalPages: response.data.totalPages,
          hasPreviousPage: response.data.hasPreviousPage,
          hasNextPage: response.data.hasNextPage,
        };
      } catch (error) {
        this.toast.error(this.$t('errorOccurred'));
      } finally {
        this.isLoading = false;
      }
    },
    onPageChange(page) {
      this.currentPage = page;
      this.fetchParticipants();
    },
    getGovernorateName(governorateId) {
      const governorate = this.governorates.find(g => g.value === governorateId);
      return governorate ? governorate.text : '-';
    },
    onNationalCardFileChange(event) {
      const file = event.target.files[0];
      if (file && !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        this.formErrors.nationalCardFile = this.$t('invalidFileExtension');
        this.editForm.nationalCardFile = null;
        event.target.value = '';
      } else {
        this.formErrors.nationalCardFile = '';
        this.editForm.nationalCardFile = file;
      }
    },
    onPowerPointFileChange(event) {
      const file = event.target.files[0];
      if (file && !['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.type)) {
        this.formErrors.powerPointFile = this.$t('invalidPowerPointExtension');
        this.editForm.powerPointFile = null;
        event.target.value = '';
      } else {
        this.formErrors.powerPointFile = '';
        this.editForm.powerPointFile = file;
      }
    },
    openEditModal(item) {
      this.editForm = {
        id: item.id,
        fullName: item.fullName || '',
        governorate: item.governorate || '',
        nationalCardFile: null,
        nationalCardFullUrl: item.nationalCardFullUrl || '',
        powerPointFile: null,
        powerPointUrl: item.powerPointUrl || '',
        note: item.note || '',
        conferenceVersionID: item.conferenceVersionID,
      };
      this.formErrors = {};
      this.showEditModal = true;
    },
    async handleSave(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (!this.validateForm()) {
        this.toast.error(this.$t('requiredField'));
        return;
      }

      const formData = new FormData();
      formData.append('FullName', this.editForm.fullName || '');
      formData.append('Governorate', this.editForm.governorate || '');
      if (this.editForm.nationalCardFile) formData.append('TheNationalCard', this.editForm.nationalCardFile);
      if (this.editForm.powerPointFile) formData.append('PowerPoint', this.editForm.powerPointFile);
      if (this.$i18n.locale === 'ar') formData.append('note', this.editForm.note || '');
      else if (this.$i18n.locale === 'en') formData.append('EnNote', this.editForm.note || '');
      else if (this.$i18n.locale === 'fa') formData.append('PeNote', this.editForm.note || '');
      formData.append('ConferenceVersionID', this.editForm.conferenceVersionID);

      try {
        await axios.put(`https://api.int-mgm.org/api/InsideIraq/UpdateInformationInsideIraq?id=${this.editForm.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.toast.success(this.$t('formSubmittedSuccessfully'));
        this.showEditModal = false;
        this.fetchParticipants();
      } catch (error) {
        this.toast.error(this.$t('errorOccurred'));
      }
    },
    validateForm() {
      this.formErrors = {};
      let isValid = true;

      if (!this.editForm.fullName) {
        this.formErrors.fullName = this.$t('requiredField');
        isValid = false;
      }
      if (!this.editForm.governorate) {
        this.formErrors.governorate = this.$t('requiredField');
        isValid = false;
      }
      if (!this.editForm.nationalCardFullUrl && !this.editForm.nationalCardFile) {
        this.formErrors.nationalCardFile = this.$t('requiredField');
        isValid = false;
      }
      if (!this.editForm.powerPointUrl && !this.editForm.powerPointFile) {
        this.formErrors.powerPointFile = this.$t('requiredField');
        isValid = false;
      }

      return isValid;
    },
    openDeleteModal(item) {
      this.deleteItem = item;
      this.showDeleteModal = true;
    },
    async handleDelete() {
      try {
        await axios.delete(`https://api.int-mgm.org/api/InsideIraq/DeleteInformationInsideIraq?id=${this.deleteItem.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.toast.success(this.$t('deleteSuccess'));
        this.showDeleteModal = false;
        this.fetchParticipants();
      } catch (error) {
        this.toast.error(this.$t('errorOccurred'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap');

.container {
  max-width: 1400px;
  font-family: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "Cairo" : "Roboto"'), sans-serif;
  direction: v-bind('$i18n.locale === "ar" || $i18n.locale === "fa" ? "rtl" : "ltr"');
}

.conference-header {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
  padding: 2rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.conference-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.conference-description {
  font-size: 1rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
}

.search-filters {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bg-gradient-primary {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
}

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #195015;
  margin-bottom: 1rem;
  border-bottom: 2px solid #195015;
  padding-bottom: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #195015;
  box-shadow: 0 0 0 0.2rem rgba(25, 80, 21, 0.25);
}

.btn-primary {
  background-color: #195015;
  border-color: #195015;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #2c7a2c;
  border-color: #2c7a2c;
  transform: scale(1.05);
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #e0a800;
  transform: scale(1.05);
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #c82333;
  transform: scale(1.05);
}

.modal-content {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
  color: white;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.participants-table {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.participants-table :deep(thead th) {
  background-color: #f8f9fa;
  color: #195015;
  font-weight: 600;
}

.participants-table :deep(tbody tr:hover) {
  background-color: #f1f3f5;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.invalid-feedback {
  display: block;
  font-size: 80%;
  color: #dc3545;
}

@media (max-width: 768px) {
  .conference-title {
    font-size: 2rem;
  }

  .participants-table {
    font-size: 0.9rem;
  }

  .btn-warning,
  .btn-danger {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>