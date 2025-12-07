import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { User } from '../../types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  authService = inject(AuthService);

  users = signal<User[]>([]);
  isLoading = signal(true);
  
  isModalOpen = signal(false);
  editingUser = signal<User | null>(null);
  
  searchTerm = signal('');
  statusFilter = signal<'all' | 'Active' | 'Inactive'>('all');
  roleFilter = signal<'all' | 'Admin' | 'Editor' | 'Viewer'>('all');

  userForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['Viewer' as User['role'], Validators.required],
    status: ['Active' as User['status'], Validators.required],
  });

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const role = this.roleFilter();
    return this.users().filter(user => {
      const termMatch = user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
      const statusMatch = status === 'all' || user.status === status;
      const roleMatch = role === 'all' || user.role === role;
      return termMatch && statusMatch && roleMatch;
    });
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading.set(true);
    try {
      const users = await firstValueFrom(this.dataService.getUsers());
      this.users.set(users);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(user: User | null = null) {
    this.editingUser.set(user);
    if (user) {
      this.userForm.patchValue(user);
    } else {
      this.userForm.reset({ role: 'Viewer', status: 'Active' });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingUser.set(null);
    this.userForm.reset();
  }

  async saveUser() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;
    const userToSave = {
        name: formValue.name!,
        email: formValue.email!,
        role: formValue.role!,
        status: formValue.status!,
    };

    try {
      if (this.editingUser()) {
          const updatedUser = { ...this.editingUser()!, ...userToSave };
          await firstValueFrom(this.dataService.updateUser(updatedUser));
          this.toastService.show('User updated successfully!', 'success');
      } else {
          await firstValueFrom(this.dataService.addUser(userToSave as Omit<User, 'id' | 'lastLogin' | 'createdAt'>));
          this.toastService.show('User created successfully!', 'success');
      }
      this.loadUsers();
      this.closeModal();
    } catch (error: unknown) {
      console.error("Failed to save user", error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      this.toastService.show(`Failed to save user: ${message}`, 'error');
    }
  }

  async deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await firstValueFrom(this.dataService.deleteUser(user.id));
        this.toastService.show('User deleted successfully!', 'success');
        this.loadUsers();
      } catch (error: unknown) {
        console.error("Failed to delete user", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        this.toastService.show(`Failed to delete user: ${message}`, 'error');
      }
    }
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
  
  onStatusChange(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value as 'all' | 'Active' | 'Inactive');
  }

  onRoleChange(event: Event) {
    this.roleFilter.set((event.target as HTMLSelectElement).value as 'all' | 'Admin' | 'Editor' | 'Viewer');
  }
}