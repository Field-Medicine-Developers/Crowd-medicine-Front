<script>
import { PlayIcon } from "@zhuowenli/vue-feather-icons";
import About from "@/components/about";
import Address from "@/components/address";
import Committees from "@/components/committees";
import Switcher from "@/components/switcher";
import Faq from "@/components/faq";
import SubmitResearch from "@/components/submitResearch";
import Blog from "@/components/blog";
import CachedImage from "@/components/CachedImage.vue";

import api from "@/js/api";

export default {
  components: {
    PlayIcon,
    About,
    Address,
    Committees,
    Faq,
    SubmitResearch,
    Switcher,
    Blog,
    CachedImage,
  },
  props: {
    setting: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      about: {},
      tip: {},
      tipItems: [],
      commit: {},
      committeesCategories: [],
      slider: {},
      faqs: [],
      blogs: [],
    };
  },
  methods: {
    async fetchAbout() {
      try {
        const response = await api.get(
          "ConferenceAbout/GetConferenceAboutById?id=" + this.id
        );
        if (response.data.data == null) {
          return;
        }
        this.about = response.data.data;
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    },
    async fetchTip() {
      try {
        const response = await api.get(
          "Tips/GetAllTips?conferenceVersionID=" + this.id
        );
        if (response.data.data == null) {
          return;
        }
        this.tip = response.data.data;
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    },
    async fetchTipItems() {
      try {
        const response = await api.get(
          "Tips/GetTipItemByConferenceVersionID?PageNumber=1&PageSize=111&conferenceVersionID=" +
            this.id
        );
        if (response.data.items == null) {
          return;
        }
        console.log(response.data.items);
        this.tipItems = response.data.items;
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    },
    getLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return this.setting[`${prefix}${field}`] || "";
    },

    //fetchCommitteesCategory
    async fetchCommitteesCategory() {
      try {
        const response = await api.get(
          "Committees/GetCommitteesCategoryById?PageNumber=1&PageSize=111&conferenceVersionID=" +
            this.id
        );
        if (response.data.items == null) {
          return;
        }
        this.committeesCategories = response.data.items;
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    },

    async fetchBlogs() {
      this.isLoading = true;
      try {
        const response = await api.get(
          "Blog/GetAllBlogs?PageNumber=1&PageSize=6&conferenceVersionID=" +
            this.id
        );
        this.blogs = response.data.items;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب المقالات");
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCommittee() {
      try {
        const response = await api.get(
          "Committees/GetCommitteesById?conferenceVersionID=" + this.id
        );
        if (response.data.data == null) {
          return;
        }
        this.commit = response.data.data;
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    },

    async fetchSlider() {
      try {
        const response = await api.get(
          "Slider/GetAllSliders?conferenceVersionID=" + this.id
        );
        if (response.data.items == null) {
          return;
        }
        this.slider = response.data.items;
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    },
    async fetchFaqs() {
      try {
        const response = await api.get(
          "Questions/GetAllQuestions?PageNumber=1&PageSize=111&conferenceVersionID=" +
            this.id
        );
        if (response.data.items == null) {
          return;
        }

        this.faqs = response.data.items;
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    },
  },
  mounted() {
    // move to top
    window.scrollTo(0, 0);
    this.fetchAbout();
    this.fetchTip();
    this.fetchTipItems();
    this.fetchCommittee();
    this.fetchCommitteesCategory();
    this.fetchSlider();
    this.fetchFaqs();
    this.fetchBlogs();
  },
};
</script>

<template>
  <div>
    <!-- Back to Home Button -->
    <div class="back-to-home-container">
      <router-link to="/" class="back-to-home-btn">
        <i class="fa fa-arrow-right me-2"></i>
        {{ $t("backToHome") }}
      </router-link>
    </div>

    <Navbar />
    <div>
      <section
        class="hero-1 bg-center bg-primary position-relative"
        :style="{
          'background-image':
            'url(' + require('@/assets/images/hero-1-bg.png') + ')',
        }"
        id="home"
      >
        <div class="container">
          <div class="row align-items-center hero-content">
            <div class="col-lg-6">
              <h1 class="text-white display-4 font-weight-semibold mb-4">
                {{ getLocalized("HeroTitle") }}
              </h1>
              <div
                class="text-center mb-4"
                v-html="getLocalized('HeroSubTitle')"
              ></div>

              <div>
                <!-- <a
                  href="javascript:void(0);"
                  class="btn btn-lg btn-light rounded-pill me-2"
                  >{{ $t("about") }}</a
                > -->
                <div class="d-inline-block">
                  <a
                    href="javascript:void(0);"
                    class="video-play-icon text-white"
                  >
                    <span class="play-icon-circle me-1">
                      <play-icon
                        class="icon-sm icon"
                        style="height: 24px; width: 24px"
                        v-b-modal.modal
                        data-toggle="modal"
                      ></play-icon>
                    </span>
                    <span> {{ $t("videoTitle") }}</span>
                  </a>
                </div>
                <!-- Modal -->
                <b-modal
                  id="modal"
                  hide-footer
                  size="lg"
                  centered
                  header-class="home-modal"
                >
                  <div class="video-container">
                    <video
                      controls
                      :src="setting.heroVedioFullUrl"
                      class="rounded shadow-sm w-100"
                    ></video>
                  </div>
                </b-modal>
              </div>

              <!-- end modal -->
            </div>
            <div class="col-lg-6 col-sm-10 ms-auto">
              <div class="mt-lg-0 mt-4 text-center">
                <CachedImage
                  :src="setting.logoFullUrl"
                  :alt="'logo'"
                  img-class="img-md-responsive"
                  @load="onImageLoad"
                  @error="onImageError"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="hero-bottom-shape shape-light">
          <img
            src="@/assets/images/hero-1-bottom-shape.png"
            alt=""
            class="img-fluid d-block mx-auto"
          />
        </div>
        <div class="hero-bottom-shape shape-dark">
          <img
            src="@/assets/images/hero-1-bottom-shape-dark.png"
            alt=""
            class="img-fluid d-block mx-auto"
          />
        </div>
      </section>
      <!-- Hero End -->

      <About :about="about" :tip="tip" :tipItems="tipItems" />
      <BCarousel fade controls indicators>
        <BCarouselSlide
          v-for="(item, index) in slider"
          v-bind:key="index"
          :img-src="item.imageFullUrl"
        />
      </BCarousel>
      <Blog :blogsList="blogs" :isHome="true" />
      <Address :setting="setting" />
      <Committees
        :commit="commit"
        :committeesCategories="committeesCategories"
      />
      <hr />
      <Faq :faqs="faqs" />

      <section
        class="hero-1 bg-primary position-relative d-flex align-items-center"
        id="home"
        style="
          min-height: 50vh;
          background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ30XNLNFwFCfLBg1kGamiuLWj-zVtQBbUC4Q&s');
          background-size: contain;
          background-position: center;
        "
      >
        <div class="container position-relative" style="z-index: 1">
          <div class="row align-items-center text-center">
            <div class="col-lg-12">
              <h1 class="text-white display-3 fw-bold mb-3">
                {{ $t("files") }}
              </h1>
            </div>

            <div class="col-lg-8 mx-auto">
              <p class="text-white-50 fs-5 mb-5">
                {{ $t("fileDescription") }}
              </p>
            </div>

            <div class="col-lg-12">
              <router-link
                :to="'/files/' + this.setting.id"
                class="btn btn-lg btn-light rounded-pill px-5 shadow-lg"
                style="font-size: 1.2rem"
              >
                {{ $t("viewFiles") }}
              </router-link>
            </div>
          </div>
        </div>
        <!-- تأثيرات بصرية خلفية -->
        <div
          class="position-absolute top-0 start-0 w-100 h-100"
          style="
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.5),
              rgba(0, 0, 0, 0.7)
            );
            z-index: 0;
          "
        ></div>
      </section>

      <SubmitResearch :conferenceVersionID="id" :setting="setting" />
      <Footer />
      <Switcher />
    </div>
  </div>
</template>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.home-modal {
  border: none;
  padding: 0;
}

.home-modal .modal-header {
  border: none;
  padding: 0;
}

.home-modal .modal-content {
  background: transparent;
  border: none;
}

.home-modal .modal-body {
  padding: 0;
}

.back-to-home-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.back-to-home-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background-color: #195015;
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-to-home-btn:hover {
  background-color: #3a7169;
  transform: translateX(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: white;
}

.back-to-home-btn i {
  transition: transform 0.3s ease;
}

.back-to-home-btn:hover i {
  transform: translateX(-3px);
}

/* Mobile styles */
@media (max-width: 768px) {
  .back-to-home-container {
    top: 140px;
    right: 15px;
  }

  .back-to-home-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
