<!-- EnhancedBlogCategories.vue -->
<template>
  <div class="blog-categories-container">
    <!-- Categories Section -->
    <div class="categories-section">
      <h3 class="categories-title">
        <span class="title-text">{{ $t("categories") }}</span>
      </h3>
      
      <div class="categories-grid">
        <button
          v-for="(category, index) in categories"
          :key="category.id"
          @click="filterBlogsByCategory(category.id)"
          :class="[
            'category-button',
            categoryId === category.id ? 'active' : ''
          ]"
        >
          <div class="category-content">
            <span class="category-name">{{ getLocalized('Name', index) }}</span>
            <!-- <span class="category-count">{{ category.count || category.blogCount }}</span> -->
          </div>
          <div class="category-shape"></div>
          <div class="category-overlay"></div>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loader-container">
      <div class="loader"></div>
    </div>

    <!-- Blog List -->
    <div v-else class="blogs-container">
      <Blog :blogsList="blogs" :isHome="false" />
      
      <!-- Pagination -->
      <div class="pagination-container">
        <button
          class="pagination-button prev"
          :disabled="pageNumber === 1"
          @click="changePage(pageNumber - 1)"
        >
          <span class="arrow">&#8592;</span>
          <span class="text">{{ $t("nextPage") }}</span>
        </button>
        
        <div class="pagination-info">
          <span class="current-page">{{ pageNumber }}</span>
          <span class="separator">من</span>
          <span class="total-pages">{{ Math.ceil(totalBlogs / pageSize) || 1 }}</span>
        </div>
        
        <button
          class="pagination-button next"
          :disabled="blogs.length < pageSize"
          @click="changePage(pageNumber + 1)"
        >
          <span class="text">{{ $t("previousPage") }}</span>
          <span class="arrow">&#8594;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Blog from "@/components/blog";
import api from "../js/api";

export default {
  components: {
    Blog,
  },
  
  data() {
    return {
      isLoading: false,
      blogs: [],
      categories: [],
      categoryId: null,
      pageNumber: 1,
      pageSize: 6,
      totalBlogs: 0,
    };
  },

  methods: {
    async fetchBlogs() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `Blog/GetAllBlogs?PageNumber=${this.pageNumber}&PageSize=${
            this.pageSize
          }&categoryId=${this.categoryId || ""}`
        );
        this.blogs = response.data.items;
        this.totalBlogs = response.data.totalCount || 0;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب المقالات");
      } finally {
        this.isLoading = false;
      }
    },

    async getAllCategories() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `Category/GetAllCategories?PageNumber=1&PageSize=111`
        );
        this.categories = response.data.items;
      } catch (error) {
        this.$toast.error("حدث خطأ أثناء جلب الأقسام");
      } finally {
        this.isLoading = false;
      }
    },

    getLocalized(field, index) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return (
        (this.categories[index] &&
          this.categories[index][`${prefix}${field}`]) ||
        ""
      );
    },

    filterBlogsByCategory(categoryId) {
      this.categoryId = categoryId;
      this.pageNumber = 1;
      this.fetchBlogs();
    },

    changePage(newPageNumber) {
      this.pageNumber = newPageNumber;
      this.fetchBlogs();
    },
  },

  mounted() {
    this.fetchBlogs();
    this.getAllCategories();
  },
};
</script>

<style scoped>
/* --- Reset and Base Styles --- */
.blog-categories-container * {
  margin: 0;
  /* padding: 0; */
  box-sizing: border-box;
}

.blog-categories-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding-bottom: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
}

/* --- Categories Section --- */
.categories-section {
  margin-top: 20px;
  padding: 2.5rem 1rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  background: linear-gradient(to bottom, rgba(249, 250, 251, 0.8), rgba(255, 255, 255, 0.5));
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

/* Decorative elements */
.categories-section::before,
.categories-section::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.15;
  z-index: -1;
}

.categories-section::before {
  /* background: radial-gradient(circle, #0e8578, transparent 70%); */
  top: -150px;
  left: -100px;
}

.categories-section::after {
  /* background: radial-gradient(circle, #0b8275, transparent 70%); */
  bottom: -150px;
  right: -100px;
}

/* Title */
.categories-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  position: relative;
}

.title-text {
  position: relative;
  display: inline-block;
  padding: 0 0.5rem;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 0.25rem;
  background: linear-gradient(to right, #0e8578, #0b8275);
  border-radius: 9999px;
  transform: scaleX(0.7);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.categories-title:hover .title-text::after {
  transform: scaleX(1);
}

/* Categories Grid */
.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 0.5rem;
}

/* Category Button */
.category-button {
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  font-size: 0.95rem;
  min-width: 140px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #0e8578, #0b8275);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.category-button:hover::before {
  transform: scaleX(1);
}

.category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(14, 133, 120, 0.1);
}

.category-button:active {
  transform: translateY(0);
}

.category-button.active {
  background: linear-gradient(135deg, #0e8578 0%, #0b8275 100%);
  color: white;
  box-shadow: 0 8px 15px rgba(14, 133, 120, 0.25);
  transform: translateY(-2px);
}

.category-button.active::before {
  transform: scaleX(1);
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.5));
}

/* Category Shape */
.category-shape {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: #0e8578;
  border-radius: 0 4px 0 8px;
  transform: scale(0);
  transform-origin: top right;
  transition: transform 0.3s ease;
  z-index: 0;
}

.category-button:hover .category-shape {
  transform: scale(1);
}

.category-button.active .category-shape {
  transform: scale(1);
  background: white;
}

/* Category Content */
.category-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
}

.category-name {
  font-weight: 600;
  transition: color 0.3s ease;
}

.category-button:not(.active) .category-name {
  color: #4b5563;
}

.category-button:hover:not(.active) .category-name {
  color: #1f2937;
}

.category-count {
  position: absolute;
  top: -0.75rem;
  right: -0.75rem;
  background: #f3f4f6;
  color: #4b5563;
  min-width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 0.25rem;
}

.category-button.active .category-count {
  background: white;
  color: #0e8578;
  transform: scale(1.2) translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.category-button:hover .category-count {
  transform: scale(1.1) translateY(-1px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
}

/* Category Overlay (shine effect) */
.category-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: left 0.6s ease;
  pointer-events: none;
}

.category-button:hover .category-overlay {
  left: 100%;
}

/* --- Loader --- */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.loader {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(14, 133, 120, 0.1);
  border-radius: 50%;
  border-top-color: #0e8578;
  animation: spin 1s ease-in-out infinite;
  position: relative;
}

.loader::before {
  content: '';
  position: absolute;
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  border-radius: 50%;
  border: 2px solid rgba(14, 133, 120, 0.05);
  border-top-color: rgba(14, 133, 120, 0.2);
  animation: spin 3s linear infinite;
}

.loader::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid rgba(14, 133, 120, 0.1);
  border-top-color: transparent;
  animation: spin 1.5s linear infinite reverse;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- Blogs Container --- */
.blogs-container {
  padding: 0 1rem;
}

/* --- Pagination --- */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  padding: 1rem 0;
}

.pagination-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 2px solid #0e8578;
  background: transparent;
  color: #0e8578;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.pagination-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0e8578;
  opacity: 0;
  z-index: -1;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled):before {
  transform: translateY(0);
  opacity: 0.1;
}

.pagination-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(14, 133, 120, 0.15);
}

.pagination-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(14, 133, 120, 0.1);
}

.pagination-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #94a3b8;
  color: #94a3b8;
}

.pagination-button .arrow {
  transition: transform 0.3s ease;
}

.pagination-button.prev:hover .arrow {
  transform: translateX(-4px);
}

.pagination-button.next:hover .arrow {
  transform: translateX(4px);
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #4b5563;
  background: rgba(14, 133, 120, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.current-page {
  font-weight: 700;
  color: #0e8578;
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(14, 133, 120, 0.1);
  position: relative;
}

.current-page::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #0e8578;
  border-radius: 2px;
}

.separator {
  color: #6b7280;
  font-weight: 500;
}

.total-pages {
  color: #6b7280;
  font-weight: 600;
}

/* --- Responsive Styles --- */
@media (max-width: 768px) {
  .categories-grid {
    gap: 0.75rem;
  }
  
  .category-button {
    min-width: 120px;
    padding: 0.5rem 1rem;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-info {
    order: -1;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .categories-section {
    padding: 1.5rem 0.5rem;
  }

  .categories-grid {
    gap: 0.5rem;
  }
  
  .category-button {
    min-width: 100px;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .pagination-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .categories-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>