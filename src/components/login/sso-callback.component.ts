import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sso-callback',
  standalone: true,
  template: `
    <div class="flex items-center justify-center h-screen text-white">
      <p>Signing you in with Google...</p>
    </div>
  `
})
export class SsoCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('SSO callback params:', params);   // ⬅ you MUST see this

      const token = params['token'];

      if (token) {
        console.log('SSO token found:', token);
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      } else {
        console.warn('No token in SSO callback');
        this.router.navigate(['/login']);
      }
    });
  }
}
