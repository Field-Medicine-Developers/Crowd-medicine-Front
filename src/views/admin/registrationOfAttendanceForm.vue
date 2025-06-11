<template>
  <div class="container my-5">
    <div class="conference-header text-center mb-5">
      <h1 class="conference-title">{{ $t('audienceRegistration') }}</h1>
    </div>
    <div class="search-filters mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <b-form-group :label="$t('fullName')" label-for="searchFullName">
            <b-form-input
              id="searchFullName"
              v-model="searchFilters.fullName"
              :placeholder="$t('searchFullNamePlaceholder')"
              @input="debouncedFetchAudience"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-4">
          <b-form-group :label="$t('conferenceVersion')" label-for="searchConferenceVersion">
            <b-form-select
              id="searchConferenceVersion"
              v-model="searchFilters.conferenceVersionId"
              :options="conferenceVersions"
              @change="debouncedFetchAudience"
            ></b-form-select>
          </b-form-group>
        </div>
        <div class="col-md-4 text-end">
          <b-button variant="primary" @click="openAddModal">
            <i class="fa fa-user-plus mr-2"></i>{{ $t('addAudience') }}
          </b-button>
        </div>
      </div>
    </div>
    <b-card no-body class="shadow-lg">
      <b-card-header class="bg-gradient-primary text-white py-3">
        <h4 class="mb-0">
          <i class="fa fa-users mr-2"></i>
          {{ $t('audienceList') }}
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

          <template #cell(phoneNumber)="row">
            {{ row.item.phoneNumber || '-' }}
          </template>

          <template #cell(email)="row">
            {{ row.item.email || '-' }}
          </template>

          <template #cell(country)="row">
            {{ getCountryName(row.item.country) }}
          </template>

          <template #cell(governorate)="row">
            {{ getGovernorateName(row.item.governorate) }}
          </template>

          <template #cell(academicTitle)="row">
            {{ row.item.academicTitle || '-' }}
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

    <b-modal
      v-model="showAddEditModal"
      :title="isEditMode ? $t('editAudience') : $t('addAudience')"
      size="lg"
      @ok="handleSave"
      :ok-title="isEditMode ? $t('save') : $t('submit')"
      :cancel-title="$t('cancel')"
    >
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
              v-model="form.fullName"
              :placeholder="$t('fullNamePlaceholder')"
              required
              :state="formErrors.fullName ? false : null"
            ></b-form-input>
            <b-form-invalid-feedback v-if="formErrors.fullName">{{ formErrors.fullName }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="col-md-6"
            :label="$t('phoneNumber') + ' *'"
            label-for="phoneNumber"
          >
            <b-form-input
              id="phoneNumber"
              v-model="form.phoneNumber"
              :placeholder="$t('phoneNumberPlaceholder')"
              required
              :state="formErrors.phoneNumber ? false : null"
            ></b-form-input>
            <b-form-invalid-feedback v-if="formErrors.phoneNumber">{{ formErrors.phoneNumber }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="col-md-6"
            :label="$t('email') + ' *'"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('emailPlaceholder')"
              required
              :state="formErrors.email ? false : null"
            ></b-form-input>
            <b-form-invalid-feedback v-if="formErrors.email">{{ formErrors.email }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="col-md-6"
            :label="$t('country') + ' *'"
            label-for="country"
          >
            <b-form-select
              id="country"
              v-model="form.country"
              :options="countries"
              required
              :state="formErrors.country ? false : null"
            ></b-form-select>
            <b-form-invalid-feedback v-if="formErrors.country">{{ formErrors.country }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            v-if="form.country === 'IQ'"
            class="col-md-6"
            :label="$t('governorate')"
            label-for="governorate"
          >
            <b-form-select
              id="governorate"
              v-model="form.governorate"
              :options="governorates"
              :state="formErrors.governorate ? false : null"
            ></b-form-select>
            <b-form-invalid-feedback v-if="formErrors.governorate">{{ formErrors.governorate }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="col-md-6"
            :label="$t('academicTitle') + ' *'"
            label-for="academicTitle"
          >
            <b-form-input
              id="academicTitle"
              v-model="form.academicTitle"
              :placeholder="$t('academicTitlePlaceholder')"
              required
              :state="formErrors.academicTitle ? false : null"
            ></b-form-input>
            <b-form-invalid-feedback v-if="formErrors.academicTitle">{{ formErrors.academicTitle }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
      </b-form>
    </b-modal>

    <b-modal
      v-model="showDeleteModal"
      :title="$t('confirmDelete')"
      ok-variant="danger"
      :ok-title="$t('delete')"
      :cancel-title="$t('cancel')"
      @ok="handleDelete"
    >
      <p>{{ $t('confirmDeleteMessage') }}</p>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import { BCard, BCardHeader, BCardBody, BTable, BPagination, BButton, BModal, BForm, BFormGroup, BFormInput, BFormSelect, BSpinner, BFormInvalidFeedback } from 'bootstrap-vue-next';
import { debounce } from 'lodash';
import countries from '@/assets/data/countries.json';

export default {
  name: 'AudienceRegistration',
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
    BFormSelect,
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
      showAddEditModal: false,
      showDeleteModal: false,
      isEditMode: false,
      searchFilters: {
        fullName: '',
        conferenceVersionId: 3,
      },
      form: {
        id: null,
        fullName: '',
        phoneNumber: '',
        email: '',
        country: '',
        governorate: '',
        academicTitle: '',
        conferenceVersionID: 3,
      },
      formErrors: {},
      deleteItem: null,
      countries: [
        { value: '', text: this.$t('chooseCountry') },
        ...countries.countries,
      ],
      governorates: [
        { value: '', text: this.$t('chooseGovernorate') },
        { value: 1, text: 'بغداد' },
        { value: 2, text: 'البصرة' },
        { value: 3, text: 'نينوى' },
        { value: 4, text: 'أربيل' },
        { value: 5, text: 'النجف' },
        { value: 6, text: 'كربلاء' },
        { value: 7, text: 'ديالى' },
        { value: 8, text: 'الأنبار' },
        { value: 9, text: 'واسط' },
        { value: 10, text: 'ميسان' },
        { value: 11, text: 'ذي قار' },
        { value: 12, text: 'المثنى' },
        { value: 13, text: 'القادسية' },
        { value: 14, text: 'بابل' },
        { value: 15, text: 'صلاح الدين' },
        { value: 16, text: 'كركوك' },
        { value: 17, text: 'دهوك' },
        { value: 18, text: 'السليمانية' },
      ],
      conferenceVersions: [
        { value: '', text: this.$t('chooseConferenceVersion') },
        { value: 1, text: this.$t('firstConference') },
        { value: 2, text: this.$t('secondConference') },
        { value: 3, text: this.$t('thirdConference') },
      ],
    };
  },
  computed: {
    tableFields() {
      return [
        { key: 'fullName', label: this.$t('fullName'), sortable: true },
        { key: 'phoneNumber', label: this.$t('phoneNumber'), sortable: true },
        { key: 'email', label: this.$t('email'), sortable: true },
        { key: 'country', label: this.$t('country'), sortable: true },
        { key: 'governorate', label: this.$t('governorate'), sortable: true },
        { key: 'academicTitle', label: this.$t('academicTitle'), sortable: true },
        { key: 'actions', label: this.$t('actions') },
      ];
    },
  },
  watch: {
    'form.country'(newValue) {
      if (newValue !== 'IQ') {
        this.form.governorate = ''; 
      }
    },
  },
  created() {
    this.debouncedFetchAudience = debounce(this.fetchAudience, 500);
  },
  mounted() {
    this.fetchAudience();
  },
  methods: {
    async fetchAudience() {
      this.isLoading = true;
      try {
        const response = await axios.get('https://api.int-mgm.org/api/Registration/GetAllAudience', {
          params: {
            PageNumber: this.currentPage,
            PageSize: this.pageSize,
            FullName: this.searchFilters.fullName || undefined,
            ConferenceVersionId: this.searchFilters.conferenceVersionId || undefined,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        });
        this.tableItems = response.data.items.map(item => ({
          ...item,
          fullName: item.fullName || '-',
          phoneNumber: item.phoneNumber || '-',
          email: item.email || '-',
          academicTitle: item.academicTitle || '-',
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
      this.fetchAudience();
    },
    getCountryName(countryCode) {
      const country = this.countries.find(c => c.value === countryCode);
      return country ? country.text : '-';
    },
    getGovernorateName(governorateId) {
      const governorate = this.governorates.find(g => g.value === governorateId);
      return governorate ? governorate.text : '-';
    },
    openAddModal() {
      this.isEditMode = false;
      this.form = {
        id: null,
        fullName: '',
        phoneNumber: '',
        email: '',
        country: '',
        governorate: '',
        academicTitle: '',
        conferenceVersionID: 3,
      };
      this.formErrors = {};
      this.showAddEditModal = true;
    },
    openEditModal(item) {
      this.isEditMode = true;
      this.form = {
        id: item.id,
        fullName: item.fullName || '',
        phoneNumber: item.phoneNumber || '',
        email: item.email || '',
        country: item.country || '',
        governorate: item.governorate || '',
        academicTitle: item.academicTitle || '',
        conferenceVersionID: item.conferenceVersionID,
      };
      this.formErrors = {};
      this.showAddEditModal = true;
    },
    async handleSave(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (!this.validateForm()) {
        this.toast.error(this.$t('requiredField'));
        return;
      }

      const payload = {
        fullName: this.form.fullName,
        phoneNumber: this.form.phoneNumber,
        email: this.form.email,
        country: this.form.country,
        governorate: this.form.country === 'IQ' ? this.form.governorate || 0 : 0,
        academicTitle: this.form.academicTitle,
        conferenceVersionID: this.form.conferenceVersionID,
      };

      try {
        if (this.isEditMode) {
          await axios.put(`https://api.int-mgm.org/api/Registration/UpdateAudience?id=${this.form.id}`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          this.toast.success(this.$t('formUpdatedSuccessfully'));
        } else {
          await axios.post('https://api.int-mgm.org/api/Registration/AddAudience', payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          this.toast.success(this.$t('success'));
        }
        this.showAddEditModal = false;
        this.fetchAudience();
      } catch (error) {
        this.toast.error(this.$t('errorOccurred'));
      }
    },
    validateForm() {
      this.formErrors = {};
      let isValid = true;

      if (!this.form.fullName) {
        this.formErrors.fullName = this.$t('requiredField');
        isValid = false;
      }
      if (!this.form.phoneNumber) {
        this.formErrors.phoneNumber = this.$t('requiredField');
        isValid = false;
      }
      if (!this.form.email) {
        this.formErrors.email = this.$t('requiredField');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.formErrors.email = this.$t('invalidEmail');
        isValid = false;
      }
      if (!this.form.country) {
        this.formErrors.country = this.$t('requiredField');
        isValid = false;
      }
      if (this.form.country === 'IQ' && !this.form.governorate) {
        this.formErrors.governorate = this.$t('requiredField');
        isValid = false;
      }
      if (!this.form.academicTitle) {
        this.formErrors.academicTitle = this.$t('requiredField');
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
        await axios.delete(`https://api.int-mgm.org/api/Registration/DeleteAudience?id=${this.deleteItem.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.toast.success(this.$t('deleteSuccess'));
        this.showDeleteModal = false;
        this.fetchAudience();
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
  border-radius:1px;
  transition: all 0.3s ease;
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