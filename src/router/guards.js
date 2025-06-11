export const authGuard = (to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthRoute = to.path === '/login';

  if (!token && !isAuthRoute) {
    // إذا لم يكن هناك token ولم يكن في صفحة تسجيل الدخول
    next('/login');
  } else if (token && isAuthRoute) {
    // إذا كان هناك token وكان في صفحة تسجيل الدخول
    next('/admin/dashboard');
  } else {
    // في الحالات الأخرى، متابعة التنقل
    next();
  }
}; 