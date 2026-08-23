import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppService } from '../../../core/services/app.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    passwordHash: ''
  };

  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    public site: AppService,
    private toast: ToastService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.errorMessage = '';

    if (!this.loginData.email || !this.loginData.passwordHash) {
      this.errorMessage = this.site.t(
        'Please enter both email and password',
        'من فضلك ادخل البريد الإلكتروني وكلمة المرور'
      );
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.loginData.email,
      password: this.loginData.passwordHash
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data?.token) {
          this.toast.success('Welcome back!', 'أهلاً بيك تاني!');
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = res.message || this.site.t(
            'Invalid email or password',
            'اسم المستخدم أو كلمة المرور غير صحيحة'
          );
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || this.site.t(
          'Invalid email or password',
          'اسم المستخدم أو كلمة المرور غير صحيحة'
        );
      }
    });
  }
}
