<!-- File: src/layouts/adminLayout.vue -->
<template>
  <div class="admin-layout">
    <!-- Modern Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="admin-title">
          <h2>لوحة الإدارة</h2>
          <p class="subtitle">لوحة التحكم</p>
        </div>
        <button @click="toggleSidebar" class="collapse-btn">
          <!-- <i class="fa" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i> -->
        </button>
      </div>

      <nav class="sidebar-nav">
        <!-- Navigation items filtered by role -->
        <router-link
          v-for="item in filteredNavItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span v-show="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <header class="top-header">
        <div class="header-left">
          <h2 class="page-title">لوحة التحكم</h2>
        </div>
        <div class="header-right">
          <div class="user-menu">
            <div class="user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <span class="user-name">الادارة</span>
            <button class="logout-btn" @click="logout">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isCollapsed = ref(false);
const userRole = localStorage.getItem('role');

// Define navigation items with their allowed roles
const navItems = [
  { path: '/admin/dashboard', label: 'الرئيسية', icon: 'fa fa-home', roles: [1] },
  { path: '/admin/setting', label: 'اعدادات الموقع', icon: 'fa fa-cog', roles: [1] },
  { path: '/admin/conferenceVersion', label: 'الاصدارات', icon: 'fa fa-tags', roles: [1] },
  { path: '/admin/conferenceVersionSetting', label: 'اعدادات الاصدار', icon: 'fa fa-cog', roles: [1] },
  { path: '/admin/conferenceVersionAbout', label: 'حول المؤتمر', icon: 'fa fa-info-circle', roles: [1] },
  { path: '/admin/committees', label: 'اللجان', icon: 'fa fa-info-circle', roles: [1] },
  { path: '/admin/committeesCategories', label: 'اقسام اللجان', icon: 'fa fa-info-circle', roles: [1] },
  { path: '/admin/committeesItems', label: 'اعضاء اللجان', icon: 'fa fa-info-circle', roles: [1] },
  { path: '/admin/faqs', label: 'الاسلئة والاجوبة', icon: 'fa fa-info-circle', roles: [1] },
  { path: '/admin/tips', label: 'المحاور', icon: 'fa fa-info-circle', roles: [1] },
  { path: '/admin/tipItemes', label: 'عناصر المحاور', icon: 'fa fa-info-circle', roles: [1] },
  { path: '/admin/sliders', label: 'عارض الصور', icon: 'fa fa-photo', roles: [1] },
  { path: '/admin/files', label: 'الملفات', icon: 'fa fa-upload', roles: [1] },
  { path: '/admin/participantsFromOutside', label: 'الباحثون من الخارج', icon: 'fa fa-users', roles: [1] },
  { path: '/admin/participantsFromInside', label: 'الباحثون من الداخل', icon: 'fa fa-users', roles: [1] },
  { path: '/admin/registrationOfAttendanceForm', label: 'تسجيل حظور المؤتمر', icon: 'fa fa-users', roles: [1, 3] },
  { path: '/admin/categories', label: 'الاقسام', icon: 'fa fa-folder', roles: [1] },
  { path: '/admin/blog', label: 'المنشورات', icon: 'fa fa-th', roles: [1] },
];

// Filter navigation items based on user role
const filteredNavItems = computed(() => {
  const role = parseInt(userRole);
  return navItems.filter(item => item.roles.includes(role));
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); // Remove role on logout
  router.push('/login');
};
</script>

<style scoped>
/* Existing styles remain unchanged */
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #195015;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.admin-title {
  color: #fff;
  text-align: center;
  flex: 1;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 0.3rem;
    color: #fff;
  }
  
  .subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
}

.collapse-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-right: 3px solid #fff;
}

.nav-item i {
  width: 24px;
  text-align: center;
  margin-left: 0.8rem;
}

.main-content {
  flex: 1;
  background: #f5f5f5;
}

.top-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #195015;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 8px;
  transition: all 0.3s ease;
}

.user-avatar svg {
  width: 100%;
  height: 100%;
}

.user-avatar:hover {
  transform: scale(1.1);
  background: #00796b;
}

.user-name {
  color: #333;
  font-weight: 500;
}

.content {
  padding: 2rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #dc3545;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-btn svg {
  width: 20px;
  height: 20px;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.1);
  transform: translateX(-3px);
}

.logout-btn span {
  font-weight: 500;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    transform: translateX(100%);
  }

  .sidebar.show {
    transform: translateX(0);
  }

  .main-content {
    margin-right: 0;
  }

  .logout-btn span {
    display: none;
  }
  
  .logout-btn {
    padding: 0.5rem;
  }
}
</style>