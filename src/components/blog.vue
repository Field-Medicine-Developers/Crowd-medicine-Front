<template>
  <section class="blog section" id="blog">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title mb-3">{{ $t("blog") }}</h2>
        <!-- <div class="section-divider">
          <span class="divider-dot"></span>
          <span class="divider-line"></span>
          <span class="divider-dot"></span>
        </div> -->
      </div>

      <div class="blog-grid">
        <div class="blog-item" v-for="(blog, index) in blogsList" :key="blog.id">
          <div class="blog-card">
            <div class="blog-card-img">
              <img
                :src="blog.featuredImageFullUrl"
                :alt="getBlogLocalized('BlogTitle', index)"
                class="img-fluid"
              />
              <div class="blog-overlay">
                <div class="blog-meta">
                  <span class="blog-date">
                    <i class="fa fa-calendar-alt"></i>
                    {{ formatDate(blog.updatedAt || blog.createdAt) }}
                  </span>
                  <span class="blog-category" v-if="blog.category">
                    <i class="fa fa-folder"></i>
                    {{ blog.category.arabicName }}
                  </span>
                </div>
              </div>
            </div>
            <div class="blog-card-body">
              <h5 class="blog-card-title">
                {{ getBlogLocalized("BlogTitle", index) }}
              </h5>
              <div class="blog-card-text">
                {{ truncateContent(getBlogLocalized("Content", index)) }}
              </div>
              <div class="blog-card-footer">
                <button class="blog-read-more" @click="readMoreInfo(index)">
                  <span>{{ $t("readMore") }}</span>
                  <i class="fa fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isHome && blogsList.length > 0" class="blog-cta">
        <RouterLink to="/blog" class="show-all-btn">
          <span>{{ $t("showAll") }}</span>
          <i class="fa fa-angle-double-right"></i>
        </RouterLink>
      </div>
      
      <div v-if="blogsList.length === 0" class="no-blogs">
        <i class="fa fa-newspaper no-blogs-icon"></i>
        <p>{{ $t("noBlogs") }}</p>
      </div>
    </div>
  </section>

  <b-modal 
    ref="myModalRef" 
    hide-footer 
    :title="selectedBlog ? getBlogLocalized('BlogTitle', selectedBlogIndex) : ''"
    dialog-class="blog-modal"
    content-class="blog-modal-content"
    header-class="blog-modal-header"
    body-class="blog-modal-body"
  >
    <div class="blog-detail">
      <div class="blog-detail-img">
        <img
          :src="selectedBlog.featuredImageFullUrl"
          :alt="getSignleLocalized('BlogTitle')"
          class="img-fluid"
        />
        <div class="blog-detail-meta">
          <span class="blog-detail-date">
            <i class="fa fa-calendar-alt"></i>
            {{ formatDate(selectedBlog.updatedAt || selectedBlog.createdAt) }}
          </span>
          <span class="blog-detail-author" v-if="selectedBlog.author">
            <i class="fa fa-user"></i>
            {{ selectedBlog.author }}
          </span>
        </div>
      </div>
      <div class="blog-detail-content">
        <h3 class="blog-detail-title">{{ getSignleLocalized('BlogTitle') }}</h3>
        <div class="blog-detail-text" v-html="formatContent(getSignleLocalized('Content'))"></div>
      </div>
      <div class="blog-detail-footer">
        <button class="blog-detail-close" @click="$refs.myModalRef.hide()">
          {{ $t("close") }}
        </button>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    blogsList: {
      type: Array,
      required: true,
    },
    isHome: {
      type: Boolean,
      required: false,
      default: false,
    },
    isConference: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      setting: {},
      blogs: [],
      selectedBlogIndex: null, 
      selectedBlog: {},
    };
  },
  methods: {
    readMoreInfo(index) {
      this.selectedBlogIndex = index;
      this.selectedBlog = this.blogsList[index];
      this.$refs.myModalRef.show();
    },

    getSignleLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return this.selectedBlog[`${prefix}${field}`] || "";
    },

    getBlogLocalized(field, index) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return (
        (this.blogsList[index] && this.blogsList[index][`${prefix}${field}`]) || ""
      );
    },
    
    truncateContent(content) {
      if (!content) return '';
      return content.length > 120 ? content.substring(0, 120) + '...' : content;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(this.$i18n.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },
    
    formatContent(content) {
      if (!content) return '';
      // تحويل سطور النص العادي إلى فقرات HTML
      return content.split('\n').map(para => `<p>${para}</p>`).join('');
    }
  },
};
</script>

<style scoped>
.blog {
  padding: 80px 0;
  background-color: #f9f9f9;
  position: relative;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

/* تنسيق رأس القسم */
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
}

.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 150px;
}

.divider-line {
  height: 2px;
  width: 60px;
  background-color: #195015;
}

.divider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #195015;
  margin: 0 5px;
}

/* شبكة المدونة */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* بطاقة المدونة */
.blog-item {
  height: 100%;
}

.blog-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.06);
  transition: all 0.4s ease;
}

.blog-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* صورة المدونة */
.blog-card-img {
  position: relative;
  overflow: hidden;
  height: 220px;
}

.blog-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.blog-card:hover .blog-card-img img {
  transform: scale(1.1);
}

/* طبقة فوق الصورة */
.blog-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.blog-meta {
  display: flex;
  justify-content: space-between;
}

.blog-date, .blog-category {
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.blog-date i, .blog-category i {
  margin-right: 5px;
  font-size: 14px;
}

/* محتوى البطاقة */
.blog-card-body {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.blog-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.blog-card:hover .blog-card-title {
  color: #195015;
}

.blog-card-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.blog-card-footer {
  margin-top: auto;
}

/* زر اقرأ المزيد */
.blog-read-more {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: #195015;
  font-weight: 600;
  font-size: 14px;
  padding: 0;
  cursor: pointer;
  position: relative;
}

.blog-read-more::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #195015;
  transition: width 0.3s ease;
}

.blog-read-more:hover::after {
  width: 100%;
}

.blog-read-more i {
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.blog-read-more:hover i {
  transform: translateX(5px);
}

/* زر عرض الكل */
.blog-cta {
  margin-top: 50px;
  text-align: center;
}

.show-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 30px;
  background-color: #195015;
  color: #ffffff;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid #195015;
}

.show-all-btn:hover {
  background-color: transparent;
  color: #195015;
  transform: translateY(-3px);
}

.show-all-btn i {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.show-all-btn:hover i {
  transform: translateX(5px);
}

/* إذا لم تكن هناك مدونات */
.no-blogs {
  text-align: center;
  padding: 50px 0;
}

.no-blogs-icon {
  font-size: 50px;
  color: #ddd;
  margin-bottom: 20px;
}

.no-blogs p {
  color: #999;
  font-size: 18px;
}

/* ستايل النافذة المنبثقة */
::v-deep .blog-modal {
  max-width: 800px;
}

::v-deep .blog-modal-content {
  border-radius: 15px;
  overflow: hidden;
  border: none;
}

::v-deep .blog-modal-header {
  border-bottom: none;
  padding: 20px 20px 0;
}

::v-deep .blog-modal-body {
  padding: 0;
}

.blog-detail {
  position: relative;
}

.blog-detail-img {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 20px;
}

.blog-detail-img img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
}

.blog-detail-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  justify-content: space-between;
}

.blog-detail-date,
.blog-detail-author {
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
}

.blog-detail-date i,
.blog-detail-author i {
  margin-right: 5px;
}

.blog-detail-content {
  padding: 0 20px 20px;
}

.blog-detail-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.blog-detail-text {
  color: #555;
  line-height: 1.8;
  font-size: 16px;
}

.blog-detail-text p {
  margin-bottom: 15px;
}

.blog-detail-footer {
  padding: 0 20px 20px;
  text-align: right;
}

.blog-detail-close {
  display: inline-block;
  padding: 10px 25px;
  background-color: #f1f1f1;
  color: #333;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.blog-detail-close:hover {
  background-color: #e0e0e0;
}

/* دعم RTL */
:dir(rtl) .blog-date i,
:dir(rtl) .blog-category i {
  margin-right: 0;
  margin-left: 5px;
}

:dir(rtl) .blog-read-more i {
  margin-left: 0;
  margin-right: 5px;
  transform: rotate(180deg);
}

:dir(rtl) .blog-read-more:hover i {
  transform: translateX(-5px) rotate(180deg);
}

:dir(rtl) .show-all-btn i {
  margin-left: 0;
  margin-right: 8px;
  transform: rotate(180deg);
}

:dir(rtl) .show-all-btn:hover i {
  transform: translateX(-5px) rotate(180deg);
}

:dir(rtl) .blog-detail-date i,
:dir(rtl) .blog-detail-author i {
  margin-right: 0;
  margin-left: 5px;
}

/* تجاوب مع الشاشات المختلفة */
@media (max-width: 1200px) {
  .blog-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 992px) {
  .blog {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .blog-card-img {
    height: 200px;
  }
  
  .blog-card-title {
    font-size: 17px;
  }
  
  .blog-detail-title {
    font-size: 20px;
  }
}

@media (max-width: 576px) {
  .blog {
    padding: 40px 0;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .blog-grid {
    grid-template-columns: 1fr;
  }
  
  .blog-card-img {
    height: 180px;
  }
  
  .blog-card-body {
    padding: 20px;
  }
  
  .blog-detail-img img {
    max-height: 250px;
  }
}
</style>