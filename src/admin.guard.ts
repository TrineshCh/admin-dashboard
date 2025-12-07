import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.currentUser()?.role === 'Admin') {
    return true;
  } else {
    // Redirect to a safe page, like the dashboard, if not an admin
    router.navigate(['/dashboard']);
    return false;
  }
};
