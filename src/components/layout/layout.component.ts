import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class LayoutComponent {
  sidebarOpen = signal(false);
  authService = inject(AuthService);
  // Fix: Explicitly type `router` as `Router` to resolve type inference issue.
  router: Router = inject(Router);

  currentUser = this.authService.currentUser;

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
