<template>
  <div>
    <div v-if="isLoading" class="loader">
      <div class="loader__spinner"></div>
    </div>
    <!-- <NewsTicker :newsList="blogs" :logo="setting.logoFullUrl" /> -->
    <HomePageHero :setting="setting" />

    <!-- Conference About Section -->
    <section class="about-section" id="about">
      <div class="about-container">
        <div class="about-header">
          <div class="about-title-container">
            <i class="fa fa-info-circle about-icon"></i>
            <h2 class="about-title">{{ $t("aboutConference") }}</h2>
          </div>
          <div class="about-decoration">
            <span class="about-dot"></span>
            <span class="about-dot"></span>
            <span class="about-dot"></span>
          </div>
        </div>

        <div class="about-divider"></div>

        <div class="about-content">
          <div class="about-description" >
            {{ $t("aboutdescription") }}
          </div>
        </div>
      </div>
    </section>

    <!-- Conference Goals and Themes Section -->
    <section class="goals-themes-section" id="goals-themes">
      <div class="goals-themes-container">
        <div class="goals-themes-header">
          <div class="goals-themes-title-container">
            <i class="fa fa-bullseye goals-themes-icon"></i>
            <h2 class="goals-themes-title">
              {{ getCurrentLanguageGoalsTitle }}
            </h2>
          </div>
          <div class="goals-themes-decoration">
            <span class="goals-themes-dot"></span>
            <span class="goals-themes-dot"></span>
            <span class="goals-themes-dot"></span>
          </div>
        </div>

        <div class="goals-themes-divider"></div>

        <div class="goals-themes-content">
          <div class="goals-list">
            <div class="goal-item">
              <i class="fa fa-check-circle goal-icon"></i>
              <p class="goal-text">{{ getCurrentLanguageGoals }}</p>
            </div>
          </div>
          
          <div class="goals-themes-header">
            <div class="goals-themes-title-container">
              <i class="fa fa-bullseye goals-themes-icon"></i>
              <h2 class="goals-themes-title">
                {{ $t("conferenceTopics") }}
              </h2>
            </div>
            <div class="goals-themes-decoration">
              <span class="goals-themes-dot"></span>
              <span class="goals-themes-dot"></span>
              <span class="goals-themes-dot"></span>
            </div>
          </div>
          <div class="goals-themes-divider"></div>

          <div class="themes-section">
           
            <div class="themes-list">
              <div
                class="theme-item"
                v-for="(theme, index) in conferenceTopics"
                :key="index"
              >
                <img
                  :src="theme.iconFullUrl"
                  :alt="getCurrentLanguageThemeName(theme)"
                  class="theme-icon"
                />
                <div class="theme-content">
                  <h4 class="theme-name">
                    {{ getCurrentLanguageThemeName(theme) }}
                  </h4>
                  <p class="theme-description">
                    {{ getCurrentLanguageThemeDescription(theme) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Terms Section -->
    <section
      class="terms-section"
      id="terms"
      v-if="
        (setting.arabicTerms || setting.englishTerms || setting.persianTerms) &&
        setting.id === 3
      "
    >
      <div class="terms-container">
        <div class="terms-header">
          <div class="terms-title-container">
            <i class="fa fa-file-text-o terms-icon"></i>
            <h2 class="terms-title">
              {{ $t("conditionsforScientificResearch") }}
            </h2>
          </div>
          <div class="terms-decoration">
            <span class="terms-dot"></span>
            <span class="terms-dot"></span>
            <span class="terms-dot"></span>
          </div>
        </div>

        <div class="terms-divider"></div>

        <div class="terms-content" id="terms-content">
          <div class="terms-body" v-html="getCurrentLanguageTerms"></div>
        </div>
      </div>
    </section>

    <!-- <Blog :blogsList="blogs" :isHome="true" id="blog" /> -->
    <ConferenceVersions
      :conferenceVersions="ConferenceVersions"
      id="conferenceVersions"
    />
  </div>
</template>

<script>
// import Blog from "@/components/blog";
import HomePageHero from "@/components/homePageHero";
import ConferenceVersions from "@/components/conferenceVersions";
// import NewsTicker from "@/components/newsTicker";
import api from "@/js/api";

export default {
  components: {
    // Blog,
    HomePageHero,
    ConferenceVersions,
    // NewsTicker
  },
  props: {
    setting: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      blogs: [],
      ConferenceVersions: [],
      conferenceAbout: null,
      conferenceTopics: [],
      conferenceGoalsData: null,
    };
  },
  methods: {
    async fetchBlogs() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `Blog/GetAllBlogs?PageNumber=1&PageSize=6`
        );
        this.blogs = response.data.items;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب المقالات");
      } finally {
        this.isLoading = false;
      }
    },

    async getAllConferenceVersionsHome() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `ConferenceVersion/GetAllConferenceVersionsHome?PageNumber=1&PageSize=10`
        );
        this.ConferenceVersions = response.data.items;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب المقالات");
      } finally {
        this.isLoading = false;
      }
    },
    async fetchConferenceAbout() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `ConferenceAbout/GetConferenceAboutById?id=3`
        );
        this.conferenceAbout = response.data.data;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب معلومات المؤتمر");
      } finally {
        this.isLoading = false;
      }
    },
    async fetchConferenceTopics() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `Tips/GetTipItemByConferenceVersionID?PageNumber=1&PageSize=111&conferenceVersionID=3`
        );
        this.conferenceTopics = response.data.items;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب محاور المؤتمر");
      } finally {
        this.isLoading = false;
      }
    },
    async fetchConferenceGoals() {
      this.isLoading = true;
      try {
        const response = await api.get(`Tips/GetAllTips?conferenceVersionID=3`);
        this.conferenceGoalsData = response.data.data;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب أهداف المؤتمر");
      } finally {
        this.isLoading = false;
      }
    },
    getCurrentLanguageThemeName(theme) {
      const currentLocale = this.$i18n.locale;
      switch (currentLocale) {
        case "ar":
          return theme.arabicName;
        case "en":
          return theme.englishName;
        case "fa":
          return theme.persianName;
        default:
          return theme.arabicName;
      }
    },
    getCurrentLanguageThemeDescription(theme) {
      const currentLocale = this.$i18n.locale;
      switch (currentLocale) {
        case "ar":
          return theme.arabicDescription;
        case "en":
          return theme.englishDescription;
        case "fa":
          return theme.persianDescription;
        default:
          return theme.arabicDescription;
      }
    },
  },
  computed: {
    getCurrentLanguageTerms() {
      const currentLocale = this.$i18n.locale;
      switch (currentLocale) {
        case "ar":
          return this.setting.arabicTerms || "";
        case "en":
          return this.setting.englishTerms || "";
        case "fa":
          return this.setting.persianTerms || "";
        default:
          return this.setting.arabicTerms || "";
      }
    },
    getCurrentLanguageAbout() {
      if (!this.conferenceAbout) return "";
      const currentLocale = this.$i18n.locale;
      switch (currentLocale) {
        case "ar":
          return this.conferenceAbout.arabicDescription;
        case "en":
          return this.conferenceAbout.englishDescription;
        case "fa":
          return this.conferenceAbout.persianDescription;
        default:
          return this.conferenceAbout.arabicDescription;
      }
    },
    getCurrentLanguageGoalsTitle() {
      if (!this.conferenceGoalsData) return this.$t("conferenceGoals");
      const currentLocale = this.$i18n.locale;
      switch (currentLocale) {
        case "ar":
          return this.conferenceGoalsData.arabicName;
        case "en":
          return this.conferenceGoalsData.englishName;
        case "fa":
          return this.conferenceGoalsData.persianName;
        default:
          return this.conferenceGoalsData.arabicName;
      }
    },
    getCurrentLanguageGoals() {
      if (!this.conferenceGoalsData) return {};
      const currentLocale = this.$i18n.locale;
      let description = "";
      switch (currentLocale) {
        case "ar":
          description = this.conferenceGoalsData.arabicDescription;
          break;
        case "en":
          description = this.conferenceGoalsData.englishDescription;
          break;
        case "fa":
          description = this.conferenceGoalsData.persianDescription;
          break;
        default:
          description = this.conferenceGoalsData.arabicDescription;
      }
      // Split the description by newlines and filter out empty lines
      return description;
    },
  },
  mounted() {
    this.fetchBlogs();
    this.getAllConferenceVersionsHome();
    this.fetchConferenceAbout();
    this.fetchConferenceTopics();
    this.fetchConferenceGoals();
  },
};
</script>

<style lang="scss">
@import url("../assets/scss/landingPage.scss");

// Terms Section Styling
.terms-section {
  padding: 4rem 0;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;

  &:before,
  &:after {
    content: "";
    position: absolute;
    // width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(0, 150, 136, 0.05) 0%,
      rgba(0, 150, 136, 0) 70%
    );
    z-index: 0;
  }

  &:before {
    top: -150px;
    right: -100px;
  }

  &:after {
    bottom: -150px;
    left: -100px;
  }
}

.terms-container {
  max-width: 76%;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #eaedf3;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  }
}

.terms-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2.5rem;
  position: relative;
  background: linear-gradient(to left, #ffffff, #f8f9fb);
  border-bottom: 1px solid #f0f4f9;
}

.terms-title-container {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.terms-icon {
  color: #195015;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #1950153d 0%, #19501547 100%);
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 150, 136, 0.1);
  transition: all 0.3s ease;
}

.terms-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1d3557;
  position: relative;
  padding-bottom: 5px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60%;
    height: 3px;
    background: linear-gradient(to left, #195015, transparent);
    border-radius: 2px;
  }
}

.terms-decoration {
  display: flex;
  gap: 8px;
}

.terms-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #195015;
  opacity: 0.7;

  &:nth-child(1) {
    animation: pulse 1.5s infinite alternate;
  }

  &:nth-child(2) {
    animation: pulse 1.5s infinite alternate 0.5s;
  }

  &:nth-child(3) {
    animation: pulse 1.5s infinite alternate 1s;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.5);
    opacity: 0.4;
  }
}

.terms-divider {
  height: 1px;
  background: linear-gradient(to left, #e6e9f0, #eef1f5, #e6e9f0);
}

.terms-content {
  overflow: hidden;
  transition: all 0.4s ease;
  background: linear-gradient(to bottom, #ffffff, #fafbfd);
}

.terms-body {
  padding: 2.5rem 3rem;
  line-height: 1.9;
  color: #2c3e50;
  font-size: 1.1rem;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 60px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
    z-index: 2;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #195015;
    margin-top: 2rem;
    margin-bottom: 1.2rem;
    font-weight: 600;
    position: relative;
    padding-right: 1.4rem;

    &:before {
      content: "";
      position: absolute;
      right: 0;
      top: 0.3em;
      bottom: 0.3em;
      width: 5px;
      background: linear-gradient(to bottom, #195015, #195015);
      border-radius: 3px;
    }
  }

  p {
    margin-bottom: 1.5rem;
    text-align: justify;
    opacity: 0.9;
    transition: all 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  ul,
  ol {
    margin-bottom: 1.5rem;
    padding-right: 2rem;
  }

  li {
    margin-bottom: 1rem;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      right: -1.4rem;
      top: 0.7em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #195015;
    }
  }

  strong,
  b {
    color: #1d3557;
    font-weight: 600;
  }

  a {
    color: #195015;
    text-decoration: none;
    position: relative;
    padding-bottom: 2px;
    transition: all 0.3s ease;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background-color: currentColor;
      transform: scaleX(0);
      transition: transform 0.3s ease;
      transform-origin: right;
    }

    &:hover {
      color: #00796b;

      &:after {
        transform: scaleX(1);
      }
    }
  }

  blockquote {
    border-right: 4px solid #195015;
    margin: 1.5rem 0;
    padding: 1.2rem 1.8rem;
    color: #495057;
    background-color: #f8f9fa;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
  }

  code {
    background-color: #f1f1f1;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    color: #e53935;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 2rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);

    th,
    td {
      border: 1px solid #e9ecef;
      padding: 1.2rem;
      text-align: right;
    }

    th {
      background: linear-gradient(to bottom, #f8f9fa, #eef1f5);
      font-weight: 600;
      color: #2c3e50;
      position: relative;

      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(to right, #195015, transparent);
      }
    }

    tr {
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(0, 150, 136, 0.02);
      }
    }

    tr:nth-child(even) {
      background-color: #f9fafc;
    }
  }
}

// Responsive styles
@media (max-width: 992px) {
  .terms-section {
    padding: 3rem 1.5rem;
  }

  .terms-container {
    border-radius: 16px;
  }

  .terms-header {
    padding: 1.75rem 2rem;
  }

  .terms-title {
    font-size: 1.4rem;
  }

  .terms-body {
    padding: 2rem 2.5rem;
  }
}

@media (max-width: 768px) {
  .terms-section {
    padding: 2.5rem 1rem;
  }

  .terms-container {
    border-radius: 14px;
  }

  .terms-header {
    padding: 1.5rem 1.8rem;
  }

  .terms-title {
    font-size: 1.3rem;
  }

  .terms-body {
    padding: 1.8rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .terms-section {
    padding: 2rem 0.75rem;
  }

  .terms-icon {
    padding: 0.8rem;
    font-size: 1.4rem;
  }

  .terms-title {
    font-size: 1.2rem;
  }

  .terms-body {
    padding: 1.5rem;
  }
}
.goals-themes-container {
  max-width: 76%;
  margin: 0 auto;
}
// Goals and Themes Section Styling
.goals-themes-section {
  padding: 80px 0;
  background-color: #f8f9fa;

  .goals-themes-header {
    text-align: center;
    margin-bottom: 40px;

    .goals-themes-title-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;

      .goals-themes-icon {
        font-size: 2rem;
        color: #195015;
      }

      .goals-themes-title {
        font-size: 2rem;
        color: #2c3e50;
        margin: 0;
      }
    }

    .goals-themes-decoration {
      display: flex;
      justify-content: center;
      gap: 10px;

      .goals-themes-dot {
        width: 10px;
        height: 10px;
        background-color: #195015;
        border-radius: 50%;
      }
    }
  }

  .goals-themes-divider {
    width: 100px;
    height: 3px;
    background-color: #195015;
    margin: 0 auto 40px;
  }

  .goals-themes-content {
    .goals-list {
      margin-bottom: 50px;

      .goal-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 20px;
        padding: 15px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

        .goal-icon {
          color: #195015;
          font-size: 1.5rem;
          margin-top: 5px;
        }

        .goal-text {
          margin: 0;
          font-size: 1.1rem;
          color: #2c3e50;
          line-height: 1.6;
        }
      }
    }

    .themes-section {
      .themes-title {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 30px;
        font-size: 1.8rem;
      }

      .themes-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;

        .theme-item {
          display: flex;
          gap: 15px;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-5px);
          }

          .theme-icon {
            width: 40px;
            height: 40px;
            object-fit: contain;
            margin-top: 5px;
          }

          .theme-content {
            .theme-name {
              color: #2c3e50;
              margin: 0 0 10px 0;
              font-size: 1.2rem;
            }

            .theme-description {
              color: #6c757d;
              margin: 0;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .goals-themes-section {
    padding: 60px 0;

    .goals-themes-title {
      font-size: 1.6rem;
    }

    .goals-themes-content {
      .goals-list {
        .goal-item {
          padding: 12px;

          .goal-text {
            font-size: 1rem;
          }
        }
      }

      .themes-section {
        .themes-list {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}

// About Section Styling
.about-section {
  padding: 4rem 0;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;

  &:before,
  &:after {
    content: "";
    position: absolute;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(0, 150, 136, 0.05) 0%,
      rgba(0, 150, 136, 0) 70%
    );
    z-index: 0;
  }

  &:before {
    top: -150px;
    right: -100px;
  }

  &:after {
    bottom: -150px;
    left: -100px;
  }
}

.about-container {
  max-width: 76%;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #eaedf3;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  }
}

.about-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2.5rem;
  position: relative;
  background: linear-gradient(to left, #ffffff, #f8f9fb);
  border-bottom: 1px solid #f0f4f9;
}

.about-title-container {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.about-icon {
  color: #195015;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #1950153d 0%, #19501547 100%);
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 150, 136, 0.1);
  transition: all 0.3s ease;
}

.about-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1d3557;
  position: relative;
  padding-bottom: 5px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60%;
    height: 3px;
    background: linear-gradient(to left, #195015, transparent);
    border-radius: 2px;
  }
}

.about-decoration {
  display: flex;
  gap: 8px;
}

.about-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #195015;
  opacity: 0.7;

  &:nth-child(1) {
    animation: pulse 1.5s infinite alternate;
  }

  &:nth-child(2) {
    animation: pulse 1.5s infinite alternate 0.5s;
  }

  &:nth-child(3) {
    animation: pulse 1.5s infinite alternate 1s;
  }
}

.about-divider {
  height: 1px;
  background: linear-gradient(to left, #e6e9f0, #eef1f5, #e6e9f0);
}

.about-content {
  padding: 2.5rem 3rem;
  line-height: 1.9;
  color: #2c3e50;
  font-size: 1.1rem;
  position: relative;

  .about-description {
    white-space: pre-line;
    text-align: justify;
  }
}

// Responsive styles
@media (max-width: 992px) {
  .about-section {
    padding: 3rem 1.5rem;
  }

  .about-container {
    border-radius: 16px;
  }

  .about-header {
    padding: 1.75rem 2rem;
  }

  .about-title {
    font-size: 1.4rem;
  }

  .about-content {
    padding: 2rem 2.5rem;
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 2.5rem 1rem;
  }

  .about-container {
    border-radius: 14px;
  }

  .about-header {
    padding: 1.5rem 1.8rem;
  }

  .about-title {
    font-size: 1.3rem;
  }

  .about-content {
    padding: 1.8rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .about-section {
    padding: 2rem 0.75rem;
  }

  .about-icon {
    padding: 0.8rem;
    font-size: 1.4rem;
  }

  .about-title {
    font-size: 1.2rem;
  }

  .about-content {
    padding: 1.5rem;
  }
}

.goal-text {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
  line-height: 1.6;
  text-align: right;
  direction: rtl;
}
</style>
