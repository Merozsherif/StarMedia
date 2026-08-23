import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. قراءة التوكن من الـ localStorage (مع فحص الحماية للـ SSR)
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null;

  // 2. تجهيز الـ Base URL من الـ environment
  // لو الطلب محلي (أساسي) ومش رايح لرابط خارجي (http/https) بيضيف الـ Base API URL
  let url = req.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // التأكد من ضبط السلاش /
    const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const path = url.startsWith('/') ? url : `/${url}`;
    url = `${baseUrl}${path}`;
  }

  // 3. تجهيز الـ Headers المحدثة
  const headersConfig: Record<string, string> = {};

  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

console.log("TOKEN =", token);

  // 4. نسخ الـ Request وتمريره
  const clonedRequest = req.clone({
    url: url,
    setHeaders: headersConfig
  });

  return next(clonedRequest);
};
