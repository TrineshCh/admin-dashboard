import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../types';
import { firstValueFrom } from 'rxjs';

const API_URL = 'http://localhost:5000/api'; // Use absolute URL to connect to the backend

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    const user = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (user && token) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; user: User }>(`${API_URL}/auth/login`, { email, password })
      );
      if (response && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUser.set(response.user);
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (err: unknown) {
      // Re-throw a new error with a user-friendly message.
      throw new Error(this.getErrorMessage(err));
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getErrorMessage(error: unknown): string {
    console.error('Login failed', error);

    if (error instanceof HttpErrorResponse) {
      // Network errors (server down, CORS, etc.)
      if (error.status === 0) {
        return 'Could not connect to the server. Please check your network and that the server is running.';
      }
      
      // Backend errors with a response body
      if (error.error) {
        // Standard backend error format: { message: '...' }
        if (typeof error.error.message === 'string') {
          return error.error.message;
        }
        // Backend error is just a plain string
        if (typeof error.error === 'string' && error.error.length > 0) {
          return error.error;
        }
      }
      
      // Fallback for other HTTP errors (e.g., 404, 500)
      return error.statusText || 'An unknown server error occurred.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred during login.';
  }
}
