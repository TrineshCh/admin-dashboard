import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChartData, Metric, Post, User } from '../types';

const API_URL = 'http://localhost:5000/api'; // This will be proxied to the backend server

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  getMetrics(): Observable<Metric[]> {
    return this.http.get<Metric[]>(`${API_URL}/analytics/metrics`);
  }
  
  getPostsByMonthData(): Observable<ChartData[]> {
     return this.http.get<ChartData[]>(`${API_URL}/analytics/posts-by-month`);
  }

  getSignupsByDayData(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${API_URL}/analytics/signups-by-day`);
  }

  getRoleDistributionData(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${API_URL}/analytics/roles`);
  }

  getRecentUsers(): Observable<Pick<User, 'name' | 'email' | 'createdAt'>[]> {
    return this.http.get<Pick<User, 'name' | 'email' | 'createdAt'>[]>(`${API_URL}/analytics/recent-users`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/users`);
  }

  addUser(user: Omit<User, 'id' | 'lastLogin' | 'createdAt'>): Observable<User> {
    return this.http.post<User>(`${API_URL}/users`, user);
  }

  updateUser(updatedUser: User): Observable<User> {
    return this.http.put<User>(`${API_URL}/users/${updatedUser.id}`, updatedUser);
  }

  deleteUser(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: true }>(`${API_URL}/users/${id}`);
  }

  getPosts(): Observable<Post[]> {
      return this.http.get<Post[]>(`${API_URL}/posts`);
  }

  addPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Observable<Post> {
      return this.http.post<Post>(`${API_URL}/posts`, post);
  }

  updatePost(updatedPost: Post): Observable<Post> {
      return this.http.put<Post>(`${API_URL}/posts/${updatedPost.id}`, updatedPost);
  }

  deletePost(id: string): Observable<{ success: boolean }> {
      return this.http.delete<{ success: true }>(`${API_URL}/posts/${id}`);
  }
}