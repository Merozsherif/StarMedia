import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // لو مش عامل تسجيل دخول، وجهه لصفحة اللوجن مع حفظ الرابط اللي كان رايحه
  router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
