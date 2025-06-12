<template>
  <div>
    <conferenceVersionSelect @fetch-id="fetchData" />

    <div class="container mt-4">
      <form class="row g-3 align-items-end" @submit.prevent="onFilter">
        <div class="col-md-2">
          <label class="form-label">حالة القبول</label>
          <select v-model="filter.isAccepted" class="form-control">
            <option value="">الكل</option>
            <option value="true">مقبول</option>
            <option value="false">غير مقبول</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">من تاريخ</label>
          <input v-model="filter.fromDate" type="date" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">إلى تاريخ</label>
          <input v-model="filter.toDate" type="date" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">الدولة</label>
          <input
            v-model="filter.country"
            type="text"
            class="form-control"
            placeholder="أدخل اسم الدولة"
          />
        </div>
        <div class="col-md-1">
          <button type="submit" class="btn btn-primary w-100">بحث</button>
        </div>
      </form>
    </div>

    <!-- Statistics Cards -->
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4">
          <div class="stat-card">
            <div class="stat-card-body">
              <div class="stat-card-icon">
                <i class="fa fa-users"></i>
              </div>
              <div class="stat-card-info">
                <h3>{{ statistics.totalRegistrations }}</h3>
                <p>إجمالي التسجيلات</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stat-card">
            <div class="stat-card-body">
              <div class="stat-card-icon">
                <i class="fa fa-check-circle"></i>
              </div>
              <div class="stat-card-info">
                <h3>{{ statistics.acceptedRegistrations }}</h3>
                <p>التسجيلات المقبولة</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-card-body">
              <div class="stat-card-icon">
                <i class="fa fa-times-circle"></i>
              </div>
              <div class="stat-card-info">
                <h3>{{ statistics.rejectedRegistrations }}</h3>
                <p>التسجيلات المرفوضة</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 mt-2">
          <div class="stat-card">
            <div class="stat-card-body">
              <div class="stat-card-icon">
                <i class="fa fa-hourglass-half"></i>
              </div>
              <div class="stat-card-info">
                <h3>{{ statistics.pendingRegistrations }}</h3>
                <p>التسجيلات قيد الانتظار</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 mt-2">
          <div class="stat-card">
            <div class="stat-card-body">
              <div class="stat-card-icon">
                <i class="fa fa-globe"></i>
              </div>
              <div class="stat-card-info">
                <h3>{{ statistics.registrationsByCountry.length }}</h3>
                <p>عدد الدول</p>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      <div
        class="row mt-4"
        v-if="
          statistics.registrationsByConference.length ||
          statistics.registrationsByCountry.length
        "
      >
        <div class="col-md-6">
          <div class="chart-card">
            <h4 class="chart-title">التسجيلات حسب المؤتمر</h4>
            <canvas ref="conferenceChart"></canvas>
          </div>
        </div>
        <div class="col-md-6">
          <div class="chart-card">
            <h4 class="chart-title">التسجيلات حسب الدولة</h4>
            <canvas ref="countryChart"></canvas>
          </div>
        </div>
      </div>
    </div>

   
    <div class="container mt-4 cb">
      <div class="row">
        <div class="col-12">
          <b-card no-body class="shadow-lg">
            <b-card-header class="bg-gradient-primary text-white py-3">
              <h4 class="mb-0">
                <i class="fa fa-users mr-2"></i>
                البحوث العلمية
              </h4>
            </b-card-header>
            <b-card-body>
              <div v-if="isLoading" class="text-center">
                <b-spinner
                  variant="primary"
                  label="جاري التحميل..."
                  class="my-4"
                ></b-spinner>
              </div>

              <BTableSimple responsive class="table-modern">
                <BThead>
                  <BTr>
                    <BTh>#</BTh>
                    <BTh>الاسم الكامل</BTh>
                    <BTh>البريد الإلكتروني</BTh>
                    <BTh>مكان العمل</BTh>
                    <BTh>البلد</BTh>
                    <BTh>المؤتمر</BTh>
                    <BTh>الحالة</BTh>
                    <BTh>الإجراءات</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(item, index) in items" :key="item.id">
                    <BTd>{{ (currentPage - 1) * pageSize + index + 1 }}</BTd>
                    <BTd>{{ item.fullName }}</BTd>
                    <BTd>{{ item.email }}</BTd>
                    <BTd>{{ item.workPlace }}</BTd>
                    <BTd>{{ getCountryName(item.countryOfResidence) }}</BTd>
                    <BTd>{{
                      item.conferenceVersion?.arabicName || "غير محدد"
                    }}</BTd>
                    <BTd>
                      <span
                        v-if="item.isAccepted === true"
                        class="badge bg-success"
                        >مقبول</span
                      >
                      <span
                        v-else-if="item.isAccepted === false"
                        class="badge bg-danger"
                        >مرفوض</span
                      >
                      <span v-else class="badge bg-secondary"
                        >قيد الانتظار</span
                      >
                    </BTd>
                    <BTd class="action-buttons">
                      <b-button
                        size="sm"
                        :variant="
                          item.isAccepted ? 'outline-danger' : 'outline-success'
                        "
                        @click="toggleAcceptedStatus(item)"
                        class="action-btn"
                      >
                        <i
                          :class="
                            item.isAccepted ? 'fa fa-times' : 'fa fa-check'
                          "
                        ></i>
                      </b-button>
                      <b-button
                        size="sm"
                        variant="outline-primary"
                        @click="openModal(item)"
                        class="action-btn"
                      >
                        <i class="fa fa-eye"></i>
                      </b-button>
                      <b-button
                        size="sm"
                        variant="outline-warning"
                        @click="openEditModal(item)"
                        class="action-btn"
                      >
                        <i class="fa fa-edit"></i>
                      </b-button>
                      <b-button
                        size="sm"
                        variant="outline-danger"
                        @click="deleteRegistration(item)"
                        class="action-btn"
                      >
                        <i class="fa fa-trash"></i>
                      </b-button>
                    </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>

              <div class="d-flex justify-content-center mt-3">
                <b-pagination
                  v-if="totalPages > 1"
                  v-model="currentPage"
                  :total-rows="totalCount"
                  :per-page="pageSize"
                  variant="primary"
                  class="mt-3"
                  @change="onPageChange"
                ></b-pagination>
              </div>
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>

    <b-modal
      id="details-modal"
      ref="detailsModal"
      title="تفاصيل الإدخال"
      title-class="text-primary"
      header-class="border-bottom-0"
      hide-footer
      hide-header-close
    >
      <div v-if="selectedItem" class="text-right">
        <div class="mb-3 item-info">
          <strong class="text-muted">الاسم الكامل:</strong>
          <span>{{ selectedItem.fullName }}</span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">البريد الإلكتروني:</strong>
          <span>{{ selectedItem.email }}</span>
        </div>
<div class="mb-3 item-info">
  <strong class="text-muted">البلد:</strong>
  <span>{{ getCountryName(selectedItem.countryOfResidence) }}</span>
</div>
        <div class="mb-3 item-info">
          <strong class="text-muted">مكان العمل:</strong>
          <span>{{ selectedItem.workPlace }}</span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">اللقب الأكاديمي:</strong>
          <span>{{ selectedItem.academicTitle }}</span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">رقم الواتساب:</strong>
          <a
            :href="
              'https://wa.me/' +
              selectedItem.whatsAppNumber.replace(/[^0-9]/g, '')
            "
            target="_blank"
            class="text-primary"
            style="text-decoration: none"
          >
            <i class="fa fa-whatsapp mr-1"></i>
            {{ selectedItem.whatsAppNumber }}
          </a>
        </div>
<div class="mb-3 ">
  <strong class="text-muted">اللغات:</strong>
  <div
    v-if="
      selectedItem.languageName &&
      isLanguageArray(selectedItem.languageName)
    "
    class="language-display"
  >
    <div
      v-for="(lang, index) in parseLanguages(selectedItem.languageName)"
      :key="index"
      class="language-item"
    >
      <span class="language-name m-2">{{ lang.name }}</span> :
      <span class="language-level">{{ getLanguageLevelText(lang.level) || 'غير محدد' }}</span>
    </div>
  </div>
  <span v-else>{{ selectedItem.languageName || "-" }}</span>
</div>
        <div class="mb-3 item-info">
          <strong class="text-muted">نوع المشاركة:</strong>
          <span>
            {{
              submissionTypes.find((t) => t.value === selectedItem.sharingType)
                ?.text || "-"
            }}
          </span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">هل شارك سابقًا:</strong>
          <span>
            {{
              isHasPreviousParticipation.find(
                (t) => t.value === selectedItem.hasPreviousParticipation
              )?.text || "-"
            }}
          </span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">هل تم نشره:</strong>
          <span>
            {{
              isPublished.find((t) => t.value === selectedItem.isPublished)
                ?.text || "-"
            }}
          </span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">سنة النشر:</strong>
          <span>{{ selectedItem.publishedAt || "-" }}</span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">رابط البحث:</strong>
          <span>{{ selectedItem.publishedUrl || "-" }}</span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">مكان المشاركة السابقة:</strong>
          <span>{{ selectedItem.wherePreviousParticipation || "-" }}</span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">تاريخ المشاركة السابقة:</strong>
          <span>
            {{
              selectedItem.whenPreviousParticipation
                ? selectedItem.whenPreviousParticipation + " م"
                : "-"
            }}
          </span>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">تعهد الأصالة بعد التوقيع:</strong>
          <a
            :href="selectedItem.authenticityPledgeUrl"
            target="_blank"
            class="text-primary"
          >
            عرض المستند
          </a>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">المشاركة:</strong>
          <a
            :href="selectedItem.theParticipationUrl"
            target="_blank"
            class="text-primary"
          >
            عرض المستند
          </a>
        </div>
        <div class="mb-3 item-info">
          <strong class="text-muted">تاريخ الإنشاء:</strong>
          <span>{{ selectedItem.createdAt.split("T")[0] }}</span>
        </div>
      </div>
      <b-button
        size="sm"
        variant="outline-primary"
        @click="() => $refs.detailsModal.hide()"
      >
        <i class="fa fa-times mr-1"></i>
        إغلاق
      </b-button>
    </b-modal>

    <b-modal
      id="edit-modal"
      ref="editModal"
      title="تعديل الإدخال"
      title-class="text-primary"
      header-class="border-bottom-0"
      hide-footer
      size="lg"
    >
      <form @submit.prevent="submitEditForm" v-if="editItem">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label"
              >الاسم الكامل <span class="text-danger">*</span></label
            >
            <input
              v-model="editItem.fullName"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label"
              >البريد الإلكتروني <span class="text-danger">*</span></label
            >
            <input
              v-model="editItem.email"
              type="email"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">البلد</label>
            <select
              v-model="editItem.countryOfResidence"
              class="form-control"
              :class="{ 'is-invalid': formErrors.countryOfResidence }"
            >
              <option value="">اختر الدولة</option>
              <option
                v-for="country in countries"
                :key="country.value"
                :value="country.value"
              >
                {{ country.text }}
              </option>
            </select>
            <div v-if="formErrors.countryOfResidence" class="invalid-feedback">
              {{ formErrors.countryOfResidence }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">مكان العمل</label>
            <input
              v-model="editItem.workPlace"
              type="text"
              class="form-control"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">اللقب الأكاديمي</label>
            <input
              v-model="editItem.academicTitle"
              type="text"
              class="form-control"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">رقم الواتساب</label>
            <input
              v-model="editItem.whatsAppNumber"
              type="text"
              class="form-control"
              placeholder="أدخل رقم الهاتف مع مفتاح الدولة"
              :class="{ 'is-invalid': formErrors.whatsAppNumber }"
            />
            <div v-if="formErrors.whatsAppNumber" class="invalid-feedback">
              {{ formErrors.whatsAppNumber }}
            </div>
          </div>
          <div class="col-md-12 mb-3">
            <label class="form-label">اللغات</label>
            <div
              class="language-list mb-3"
              v-if="editItem.languages.length > 0"
            >
              <div
                v-for="(lang, index) in editItem.languages"
                :key="index"
                class="language-item"
              >
                <div class="language-info">
                  <span class="language-name">{{ lang.name }}</span>
                  <span class="language-level">{{
                    getLanguageLevelText(lang.level)
                  }}</span>
                </div>
                <button
                  type="button"
                  class="btn-remove-language"
                  @click="removeLanguage(index)"
                >
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>
            <div class="language-form">
              <div class="row">
                <div class="col-md-6">
                  <select v-model="newLanguage.name" class="form-control mb-2">
                    <option value="" disabled>اختر اللغة</option>
                    <option
                      v-for="lang in languages"
                      :key="lang.code"
                      :value="lang.name"
                    >
                      {{ $i18n.locale === "ar" ? lang.name : lang.name_en }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <select v-model="newLanguage.level" class="form-control mb-2">
                    <option
                      v-for="level in languageLevels"
                      :key="level.value"
                      :value="level.value"
                    >
                      {{ level.text }}
                    </option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-secondary mt-1"
                @click="addLanguage"
                :disabled="!newLanguage.name || newLanguage.level === 0"
              >
                إضافة لغة
              </button>
            </div>
            <div v-if="formErrors.languages" class="text-danger mt-2">
              {{ formErrors.languages }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">نوع المشاركة</label>
            <select v-model="editItem.sharingType" class="form-control">
              <option
                v-for="type in submissionTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.text }}
              </option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">هل شارك سابقًا</label>
            <select
              v-model="editItem.hasPreviousParticipation"
              class="form-control"
            >
              <option
                v-for="option in isHasPreviousParticipation"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">مكان المشاركة السابقة</label>
            <input
              v-model="editItem.wherePreviousParticipation"
              type="text"
              class="form-control"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">تاريخ المشاركة السابقة</label>
            <input
              v-model="editItem.whenPreviousParticipation"
              type="text"
              class="form-control"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">هل تم نشره</label>
            <select v-model="editItem.isPublished" class="form-control">
              <option
                v-for="option in isPublished"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">سنة النشر</label>
            <input
              v-model="editItem.publishedAt"
              type="text"
              class="form-control"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">رابط البحث</label>
            <input
              v-model="editItem.publishedUrl"
              type="text"
              class="form-control"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">حالة القبول</label>
            <select v-model="editItem.isAccepted" class="form-control">
              <option :value="true">مقبول</option>
              <option :value="false">غير مقبول</option>
              <option :value="null">قيد الانتظار</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">المشاركة (ملف)</label>
            <input
              type="file"
              class="form-control"
              @change="onParticipationFileChange"
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">تعهد الأصالة (ملف)</label>
            <input
              type="file"
              class="form-control"
              @change="onAuthenticityPledgeFileChange"
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3 gap-2">
          <b-button
            variant="outline-secondary"
            @click="() => $refs.editModal.hide()"
          >
            إلغاء
          </b-button>
          <b-button type="submit" variant="primary" :disabled="isSubmitting">
            <b-spinner small v-if="isSubmitting" class="mr-1"></b-spinner>
            حفظ التغييرات
          </b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import api from "../../js/api";
import conferenceVersionSelect from "../../components/conferenceVersionSelect.vue";
import Chart from "chart.js/auto";
import countries from "@/assets/data/countries.json";
import languages from "@/assets/data/languages.json";
import Swal from "sweetalert2";

export default {
  components: {
    conferenceVersionSelect,
  },

  mounted() {
    if (!this.getAuthToken()) {
      this.$router.push("/login");
    }
    this.fetchAllData();
  },

  beforeUnmount() {
    if (this.conferenceChart) {
      this.conferenceChart.destroy();
      this.conferenceChart = null;
    }
    if (this.countryChart) {
      this.countryChart.destroy();
      this.countryChart = null;
    }
  },

  data() {
    return {
      submissionTypes: [
        { text: this.$t("scientificResearch"), value: 3 },
        { text: this.$t("scientificArticle"), value: 2 },
        { text: this.$t("scientificWord"), value: 1 },
      ],
      languageLevels: [
        { text: this.$t("poor"), value: 1 },
        { text: this.$t("average"), value: 2 },
        { text: this.$t("good"), value: 3 },
        { text: this.$t("veryGood"), value: 4 },
      ],
      isHasPreviousParticipation: [
        { text: this.$t("yes"), value: true },
        { text: this.$t("no"), value: false },
      ],
      isPublished: [
        { text: this.$t("yes"), value: true },
        { text: this.$t("no"), value: false },
      ],
      countries: countries.countries,
      countryMap: countries.countries.reduce((map, country) => {
        map[country.value] = country.text;
        return map;
      }, {}),
      languages: languages.languages,
      userFullName: "اسم المستخدم",
      items: [],
      allRegistrations: [],
      isLoading: false,
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      pageSize: 10,
      selectedItem: null,
      editItem: null,
      participationFile: null,
      authenticityPledgeFile: null,
      isSubmitting: false,
      conferenceVersionID: null,
      statistics: {
        totalRegistrations: 0,
        acceptedRegistrations: 0,
        rejectedRegistrations: 0,
        pendingRegistrations: 0,
        registrationsByConference: [],
        registrationsByCountry: [],
      },
      conferenceChart: null,
      countryChart: null,
      filter: {
        isAccepted: "",
        fromDate: "",
        toDate: "",
        country: "",
      },
      formErrors: {},
      newLanguage: {
        name: "",
        level: 0,
      },
    };
  },

  methods: {
    isLanguageArray(value) {
      if (!value) return false;
      try {
        if (Array.isArray(value)) return true;
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          Object.prototype.hasOwnProperty.call(parsed[0], "name")
        );
      } catch (e) {
        return false;
      }
    },

    parseLanguages(value) {
      if (!value) return [];
      try {
        if (Array.isArray(value)) return value;
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    },

    getLanguageLevelText(value) {
      const level = this.languageLevels.find((l) => l.value === value);
      return level ? level.text : "";
    },

    addLanguage() {
      if (this.newLanguage.name && this.newLanguage.level > 0) {
        this.editItem.languages.push({ ...this.newLanguage });
        this.newLanguage = { name: "", level: 0 };
      }
    },

    removeLanguage(index) {
      this.editItem.languages.splice(index, 1);
    },

    async fetchAllData() {
      this.isLoading = true;
      try {
        const params = [
          `PageNumber=${this.currentPage}`,
          `PageSize=${this.pageSize}`,
        ];
        if (this.filter.isAccepted !== "")
          params.push(`isAccepted=${this.filter.isAccepted}`);
        if (this.filter.fromDate)
          params.push(`fromDate=${this.filter.fromDate}`);
        if (this.filter.toDate) params.push(`toDate=${this.filter.toDate}`);
        if (this.filter.country)
          params.push(`country=${encodeURIComponent(this.filter.country)}`);

        const response = await api.get(
          `Registration/GetAllInformation?${params.join("&")}`,
          {
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
              Accept: "text/plain",
            },
          }
        );

        const { items, totalPages, totalCount } = response.data;
        this.items = items;
        this.totalPages = totalPages;
        this.totalCount = totalCount;

        if (totalCount > 0) {
          await this.fetchAllRegistrationsForStatistics(
            params.filter(
              (p) => !p.startsWith("PageNumber") && !p.startsWith("PageSize")
            )
          );
        } else {
          this.allRegistrations = items;
          this.calculateStatistics();
        }
      } catch (error) {
        this.$toast.open({
          message: "حدث خطأ أثناء جلب البيانات",
          type: "error",
        });
        this.resetStatistics();
      } finally {
        this.isLoading = false;
      }
    },

    async fetchData(id, filter = this.filter) {
      if (!id) {
        this.$toast.warning("يرجى اختيار إصدار المؤتمر أولاً");
        this.resetStatistics();
        return;
      }

      this.conferenceVersionID = id;
      this.isLoading = true;
      try {
        const params = [
          `PageNumber=${this.currentPage}`,
          `PageSize=${this.pageSize}`,
          `conferenceVersionID=${id}`,
        ];
        if (filter.isAccepted !== "")
          params.push(`isAccepted=${filter.isAccepted}`);
        if (filter.fromDate) params.push(`fromDate=${filter.fromDate}`);
        if (filter.toDate) params.push(`toDate=${filter.toDate}`);
        if (filter.country)
          params.push(`country=${encodeURIComponent(filter.country)}`);

        const response = await api.get(
          `Registration/GetAllInformation?${params.join("&")}`,
          {
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
              Accept: "text/plain",
            },
          }
        );

        const { items, totalPages, totalCount } = response.data;
        this.items = items;
        this.totalPages = totalPages;
        this.totalCount = totalCount;

        if (totalCount > 0) {
          await this.fetchAllRegistrationsForStatistics(
            params.filter(
              (p) => !p.startsWith("PageNumber") && !p.startsWith("PageSize")
            )
          );
        } else {
          this.allRegistrations = items;
          this.calculateStatistics();
        }
      } catch (error) {
        this.$toast.open({
          message: "حدث خطأ أثناء جلب البيانات",
          type: "error",
        });
        this.resetStatistics();
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllRegistrationsForStatistics(baseParams) {
      try {
        const response = await api.get(
          `Registration/GetAllInformation?${baseParams.join(
            "&"
          )}&PageSize=1000`,
          {
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
              Accept: "text/plain",
            },
          }
        );

        this.allRegistrations = response.data.items || [];
        this.calculateStatistics();
      } catch (error) {
        this.allRegistrations = [];
        this.calculateStatistics();
      }
    },

    calculateStatistics() {
      if (!this.allRegistrations || this.allRegistrations.length === 0) {
        this.resetStatistics();
        return;
      }

      const registrationsByCountry = {};
      let totalRegistrations = this.allRegistrations.length;
      let acceptedRegistrations = this.allRegistrations.filter(
        (item) => item.isAccepted === true
      ).length;
      let rejectedRegistrations = this.allRegistrations.filter(
        (item) => item.isAccepted === false
      ).length;
      let pendingRegistrations = this.allRegistrations.filter(
        (item) => item.isAccepted === null
      ).length;

      this.allRegistrations.forEach((item) => {
        const countryCode = item.countryOfResidence || "غير محدد";
        const countryName = this.countryMap[countryCode] || countryCode;
        registrationsByCountry[countryName] =
          (registrationsByCountry[countryName] || 0) + 1;
      });

      const registrationsByCountryArray = Object.keys(
        registrationsByCountry
      ).map((country) => ({
        country,
        count: registrationsByCountry[country],
      }));

      const registrationsByConference = [];
      if (this.conferenceVersionID) {
        const confName =
          this.allRegistrations[0]?.conferenceVersion?.arabicName || "غير محدد";
        registrationsByConference.push({
          conferenceVersionName: confName,
          count: totalRegistrations,
          conferenceVersionID: this.conferenceVersionID,
        });
      } else {
        const registrationsByConferenceMap = {};
        this.allRegistrations.forEach((item) => {
          const confName = item.conferenceVersion?.arabicName || "غير محدد";
          const confId = item.conferenceVersion?.id || 0;
          registrationsByConferenceMap[confId] = registrationsByConferenceMap[
            confId
          ] || {
            conferenceVersionName: confName,
            count: 0,
            conferenceVersionID: confId,
          };
          registrationsByConferenceMap[confId].count += 1;
        });
        Object.values(registrationsByConferenceMap).forEach((conf) => {
          registrationsByConference.push(conf);
        });
      }

      this.statistics = {
        totalRegistrations,
        acceptedRegistrations,
        rejectedRegistrations,
        pendingRegistrations,
        registrationsByConference,
        registrationsByCountry: registrationsByCountryArray,
      };

      if (
        this.statistics.registrationsByConference.length ||
        this.statistics.registrationsByCountry.length
      ) {
        this.$nextTick(() => {
          this.updateCharts();
        });
      }
    },

    resetStatistics() {
      this.statistics = {
        totalRegistrations: 0,
        acceptedRegistrations: 0,
        rejectedRegistrations: 0,
        pendingRegistrations: 0,
        registrationsByConference: [],
        registrationsByCountry: [],
      };
      this.allRegistrations = [];
    },

    updateCharts() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.conferenceChart) {
            this.conferenceChart.destroy();
            this.conferenceChart = null;
          }
          if (this.countryChart) {
            this.countryChart.destroy();
            this.countryChart = null;
          }

          const conferenceCanvas = this.$refs.conferenceChart;
          const countryCanvas = this.$refs.countryChart;

          if (!conferenceCanvas && !countryCanvas) {
            return;
          }

          if (
            conferenceCanvas &&
            this.statistics.registrationsByConference.length
          ) {
            const conferenceCtx = conferenceCanvas.getContext("2d");
            if (!conferenceCtx) {
              return;
            }

            this.conferenceChart = new Chart(conferenceCtx, {
              type: "bar",
              data: {
                labels:
                  this.statistics.registrationsByConference.map(
                    (item) => item.conferenceVersionName
                  ) || [],
                datasets: [
                  {
                    label: "التسجيلات",
                    data:
                      this.statistics.registrationsByConference.map(
                        (item) => item.count
                      ) || [],
                    backgroundColor: "#195015",
                    borderColor: "#195015",
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "عدد التسجيلات",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "إصدار المؤتمر",
                    },
                  },
                },
              },
            });
          } else {
            console.warn(!conferenceCanvas ? "dfffffff " : "dddddddd ");
          }
          if (countryCanvas && this.statistics.registrationsByCountry.length) {
            const countryCtx = countryCanvas.getContext("2d");
            if (!countryCtx) {
              console.warn("sssssss");
              return;
            }

            this.countryChart = new Chart(countryCtx, {
              type: "pie",
              data: {
                labels:
                  this.statistics.registrationsByCountry.map(
                    (item) => item.country
                  ) || [],
                datasets: [
                  {
                    data:
                      this.statistics.registrationsByCountry.map(
                        (item) => item.count
                      ) || [],
                    backgroundColor: [
                      "#195015",
                      "#2c7a2c",
                      "#3f9f3f",
                      "#52c452",
                      "#65e965",
                      "#78ff78",
                    ],
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              },
            });
          } else {
            console.warn(!countryCanvas ? "rrrrr canvas  " : "لhhhhhhh");
          }
        }, 1000);
      });
    },
    getCountryName(countryCode) {
  if (!countryCode) return "-";
  const country = this.countries.find((c) => c.value === countryCode);
  return country ? country.text : countryCode;
},

    openModal(item) {
      this.selectedItem = { ...item };
      this.$refs.detailsModal.show();
    },

    openEditModal(item) {
      this.editItem = {
        ...item,
        languages: this.parseLanguages(item.languageName),
        whatsAppNumber: item.whatsAppNumber || "",
      };
      this.participationFile = null;
      this.authenticityPledgeFile = null;
      this.formErrors = {};
      this.newLanguage = { name: "", level: 0 };
      this.$refs.editModal.show();
    },

    onParticipationFileChange(event) {
      this.participationFile = event.target.files[0];
    },

    onAuthenticityPledgeFileChange(event) {
      this.authenticityPledgeFile = event.target.files[0];
    },

    async submitEditForm() {
      if (!this.editItem) {
        this.$toast.error("لا توجد بيانات للتعديل");
        return;
      }
      if (!this.editItem.fullName || !this.editItem.email) {
        this.$toast.error("الاسم الكامل والبريد الإلكتروني مطلوبان");
        return;
      }
      if (!this.editItem.id) {
        this.$toast.error("معرف التسجيل غير موجود");
        return;
      }
      if (this.editItem.languages.length === 0) {
        this.formErrors.languages = "يجب إضافة لغة واحدة على الأقل";
        return;
      }
      if (
        this.editItem.whatsAppNumber &&
        !/^\+?\d{8,15}$/.test(this.editItem.whatsAppNumber)
      ) {
        this.formErrors.whatsAppNumber =
          "رقم الواتساب غير صالح (يجب أن يحتوي على 8-15 رقمًا وقد يبدأ بـ +)";
        return;
      }

      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append("FullName", this.editItem.fullName || "");
        formData.append("Email", this.editItem.email || "");
        formData.append(
          "CountryOfResidence",
          this.editItem.countryOfResidence || ""
        );
        formData.append("WorkPlace", this.editItem.workPlace || "");
        formData.append("AcademicTitle", this.editItem.academicTitle || "");
        formData.append("WhatsAppNumber", this.editItem.whatsAppNumber || "");
        formData.append(
          "LanguageName",
          JSON.stringify(this.editItem.languages) || ""
        );
        formData.append("LinguisticLevel", this.editItem.linguisticLevel || 0);
        formData.append("SharingType", this.editItem.sharingType || 0);
        formData.append(
          "HasPreviousParticipation",
          this.editItem.hasPreviousParticipation || false
        );
        formData.append(
          "WherePreviousParticipation",
          this.editItem.wherePreviousParticipation || ""
        );
        formData.append(
          "WhenPreviousParticipation",
          this.editItem.whenPreviousParticipation || ""
        );
        formData.append(
          "IsAccepted",
          this.editItem.isAccepted !== null ? this.editItem.isAccepted : ""
        );
        formData.append("IsPublished", this.editItem.isPublished || false);
        formData.append("PublishedAt", this.editItem.publishedAt || "");
        formData.append("PublishedUrl", this.editItem.publishedUrl || "");
        formData.append(
          "ConferenceVersionID",
          this.editItem.conferenceVersionID || this.conferenceVersionID || 0
        );

        if (this.participationFile) {
          formData.append("Participation", this.participationFile);
        }
        if (this.authenticityPledgeFile) {
          formData.append("TheAuthenticityPledge", this.authenticityPledgeFile);
        }

        const response = await api.put(
          `/Registration/UpdateInformation?id=${this.editItem.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          this.$toast.success("تم تعديل البيانات بنجاح");
          this.$refs.editModal.hide();
          if (this.conferenceVersionID) {
            this.fetchData(this.conferenceVersionID, this.filter);
          } else {
            this.fetchAllData();
          }
        } else {
          throw new Error("استجابة غير متوقعة من الخادم");
        }
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء تعديل البيانات");
      } finally {
        this.isSubmitting = false;
      }
    },

    async deleteRegistration(item) {
      if (!item.id) {
        this.$toast.error("معرف التسجيل غير موجود");
        return;
      }

      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من استعادة هذا التسجيل بعد الحذف!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "نعم، احذف!",
        cancelButtonText: "إلغاء",
      });

      if (result.isConfirmed) {
        try {
          await api.delete(`/Registration/DeleteInformation?id=${item.id}`, {
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
          });
          this.$toast.success("تم حذف التسجيل بنجاح");
          if (this.conferenceVersionID) {
            this.fetchData(this.conferenceVersionID, this.filter);
          } else {
            this.fetchAllData();
          }
        } catch (error) {
          this.$toast.error("حدث خطأ أثناء حذف التسجيل");
        }
      }
    },

    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },

    getAuthToken() {
      return localStorage.getItem("token");
    },

    onFilter() {
      this.currentPage = 1;
      if (this.conferenceVersionID) {
        this.fetchData(this.conferenceVersionID, this.filter);
      } else {
        this.fetchAllData();
      }
    },

    onPageChange(page) {
      this.currentPage = page;
      if (this.conferenceVersionID) {
        this.fetchData(this.conferenceVersionID, this.filter);
      } else {
        this.fetchAllData();
      }
    },

    async toggleAcceptedStatus(item) {
      if (!item.id) {
        this.$toast.error("معرف التسجيل غير موجود");
        return;
      }
      const newStatus = !item.isAccepted;
      try {
        await api.put(
          `Registration/UpdateAcceptedStatusInformation?id=${item.id}&isAccepted=${newStatus}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${this.getAuthToken()}`,
            },
          }
        );
        this.$toast.success(
          newStatus ? "تمت الموافقة بنجاح" : "تم إلغاء الموافقة"
        );
        if (this.conferenceVersionID) {
          this.fetchData(this.conferenceVersionID, this.filter);
        } else {
          this.fetchAllData();
        }
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء تحديث الحالة");
      }
    },
  },

  watch: {
    currentPage() {
      if (this.conferenceVersionID) {
        this.fetchData(this.conferenceVersionID, this.filter);
      } else {
        this.fetchAllData();
      }
    },
  },

  created() {
    this.userFullName = localStorage.getItem("userFullName") || "اسم المستخدم";
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

.container {
  max-width: 1400px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .stat-card-body {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .stat-card-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #e6f0fa 0%, #f8f9fa 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 28px;
      color: #195015;
    }
  }

  .stat-card-info {
    h3 {
      font-size: 26px;
      font-weight: 700;
      margin: 0;
      color: #1a3c34;
    }

    p {
      margin: 5px 0 0;
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.chart-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  height: 400px;

  .chart-title {
    color: #1a3c34;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 18px;
  }
}

.table-modern {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  direction: rtl;

  thead {
    background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
  }

  th {
    color: #363030;
    font-weight: 600;
    font-size: 16px;
    padding: 16px;
    border: none;
    text-align: right;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  td {
    padding: 14px 16px;
    border: none;
    font-size: 15px;
    color: #2c3e50;
    vertical-align: middle;
    text-align: right;
  }

  tbody tr {
    transition: background 0.3s ease, transform 0.2s ease;

    &:nth-child(even) {
      background: #f8f9fa;
    }

    &:hover {
      background: #e6f0fa;
      transform: scale(1.01);
    }
  }

  .badge {
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    transition: transform 0.2s ease;

    &.bg-success {
      background-color: #28a745;
    }
    &.bg-danger {
      background-color: #dc3545;
    }
    &.bg-secondary {
      background-color: #6c757d;
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
  }

  .action-btn {
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    i {
      font-size: 16px;
    }
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 10px;
      font-size: 14px;
    }

    .action-btn {
      padding: 5px 8px;
      font-size: 12px;
    }
  }

  @media (max-width: 576px) {
    th:nth-child(3),
    td:nth-child(3),
    th:nth-child(4),
    td:nth-child(4) {
      display: none;
    }

    .action-buttons {
      gap: 6px;
    }
  }
}

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.bg-gradient-primary {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
}

.pagination {
  justify-content: center;
  margin-top: 20px;

  .page-item .page-link {
    border-radius: 8px;
    margin: 0 5px;
    color: #195015;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e6f0fa;
      color: #1a3c34;
    }
  }

  .page-item.active .page-link {
    background-color: #195015;
    border-color: #195015;
    color: #ffffff;
  }
}

.modal-content {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(90deg, #195015 0%, #2c7a2c 100%);
  color: #ffffff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-title {
  font-weight: 600;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #195015;
    box-shadow: 0 0 0 0.2rem rgba(25, 80, 21, 0.25);
  }
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.btn-primary {
  background-color: #195015;
  border-color: #195015;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2c7a2c;
    border-color: #2c7a2c;
    transform: scale(1.05);
  }
}

.btn-outline-secondary {
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    transform: scale(1.05);
  }
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  border-bottom: 1px solid #e9ecef;

  strong {
    flex: 0 0 40%;
  }

  span,
  a {
    flex: 0 0 60%;
    text-align: left;
  }
}

.language-display {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.language-item {
  display: flex;
  gap: 10px;
}

.gap-2 {
  gap: 8px;
}

.language-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  background-color: #f8f9fa;
}

.language-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 8px 12px;
  min-width: 200px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.language-info {
  display: flex;
  flex-direction: column;
}

.language-name {
  font-weight: 500;
  color: #333;
}

.language-level {
  font-size: 0.85rem;
  color: #000000;
}

.btn-remove-language {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.btn-remove-language:hover {
  color: #bd2130;
}

.btn-remove-language:disabled {
  color: #adb5bd;
  cursor: not-allowed;
}

.language-form {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 5px;
}

.btn-secondary {
  background-color: #195015 !important;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  color: white;
}

.btn-secondary:hover {
  background-color: #2c7a2c !important;
}

.btn-secondary:disabled {
  background-color: #adb5bd !important;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .language-item {
    min-width: 100%;
  }

  .language-form .row {
    flex-direction: column;
  }
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
</style>
