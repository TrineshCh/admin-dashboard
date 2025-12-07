// src/components/login/login.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule],
  standalone: true, // keep standalone since you're using imports
})
export class LoginComponent implements OnInit {
  email = 'alice@example.com';
  password = 'password123';
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // 👇 Handle Google redirect: /login?token=...
    this.route.queryParams.subscribe((params) => {
      console.log('LoginComponent query params =', params);

      const token = params['token'];

      if (token) {
        console.log('Google SSO token in login =', token);

        // Save token for authGuard
        localStorage.setItem('token', token);

        // Navigate to protected dashboard
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.authService.login(this.email, this.password);
      // AuthService.login should internally set token in localStorage as well
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // 🔹 Google login
  loginWithGoogle(): void {
    window.location.href = 'http://localhost:5000/api/auth/google'; 
  }
}
