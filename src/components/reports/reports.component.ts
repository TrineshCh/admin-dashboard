import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {

  private http = inject(HttpClient);

  users: any[] = [];
  private apiUrl = 'http://localhost:5000/api/users';

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log(data)
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  onDeleteUser(userId: string) {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    this.http.delete(`${this.apiUrl}/${userId}`).subscribe({
      next: () => {
        this.users = this.users.filter(user => user._id !== userId);
      },
      error: (err) => {
        console.error('Failed to delete user', err);
      }
    });
  }
}
// import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './reports.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class ReportsComponent {

//   private http = inject(HttpClient);

//   users: any[] = [];
//   private apiUrl = 'http://localhost:5000/api/users';

//   constructor() {
//     this.loadUsers();
//   }

//   private getAuthHeaders() {
//     const token = localStorage.getItem('token') || '';
//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`   // 👈 MUST match what your middleware expects
//     });
//   }

//   loadUsers() {
//     this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
//       next: (data) => {
//         this.users = data;
//       },
//       error: (err) => {
//         console.error('Failed to load users', err);
//       }
//     });
//   }

//   onDeleteUser(userId: string) {
//     const confirmed = confirm('Are you sure you want to delete this user?');
//     if (!confirmed) return;

//     this.http.delete(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() }).subscribe({
//       next: () => {
//         this.users = this.users.filter(user => user._id !== userId);
//       },
//       error: (err) => {
//         console.error('Failed to delete user', err);
//       }
//     });
//   }
// }
