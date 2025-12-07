import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Post, User } from '../../types';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  authService = inject(AuthService);

  posts = signal<Post[]>([]);
  users = signal<User[]>([]);
  isLoading = signal(true);
  
  isModalOpen = signal(false);
  editingPost = signal<Post | null>(null);
  
  searchTerm = signal('');
  statusFilter = signal<'all' | 'Published' | 'Draft'>('all');

  postForm = this.formBuilder.group({
    title: ['', Validators.required],
    authorId: [null as string | null, Validators.required],
    status: ['Draft' as Post['status'], Validators.required],
  });

  postsWithAuthor = computed(() => {
    const userMap = new Map(this.users().map(user => [user.id, user.name]));
    return this.posts().map(post => ({
      ...post,
      authorName: userMap.get(post.authorId) || 'Unknown Author'
    }));
  });

  filteredPosts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    return this.postsWithAuthor().filter(post => {
      const termMatch = post.title.toLowerCase().includes(term);
      const statusMatch = status === 'all' || post.status === status;
      return termMatch && statusMatch;
    });
  });

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.isLoading.set(true);
    try {
      const [posts, users] = await Promise.all([
        firstValueFrom(this.dataService.getPosts()),
        firstValueFrom(this.dataService.getUsers())
      ]);
      this.posts.set(posts);
      this.users.set(users);
    } catch(error) {
      console.error("Failed to load initial content data", error);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async loadPosts() {
    this.isLoading.set(true);
    try {
      this.posts.set(await firstValueFrom(this.dataService.getPosts()));
    } catch (error) {
      console.error("Failed to reload posts", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(post: Post | null = null) {
    this.editingPost.set(post);
    if (post) {
      this.postForm.patchValue(post);
    } else {
      this.postForm.reset({ authorId: this.authService.currentUser()?.id, status: 'Draft' });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingPost.set(null);
    this.postForm.reset();
  }

  async savePost() {
    if (this.postForm.invalid) return;

    const formValue = this.postForm.value;
    const postToSave = {
      title: formValue.title!,
      authorId: formValue.authorId!,
      status: formValue.status!,
    };

    try {
      if (this.editingPost()) {
          const updatedPost = { ...this.editingPost()!, ...postToSave };
          await firstValueFrom(this.dataService.updatePost(updatedPost));
          this.toastService.show('Post updated successfully!', 'success');
      } else {
          await firstValueFrom(this.dataService.addPost(postToSave as Omit<Post, 'id' | 'createdAt' | 'updatedAt'>));
          this.toastService.show('Post created successfully!', 'success');
      }
      this.loadPosts();
      this.closeModal();
    } catch (error: unknown) {
      console.error("Failed to save post", error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      this.toastService.show(`Failed to save post: ${message}`, 'error');
    }
  }

  async deletePost(post: Post) {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await firstValueFrom(this.dataService.deletePost(post.id));
        this.toastService.show('Post deleted successfully!', 'success');
        this.loadPosts();
      } catch (error: unknown) {
        console.error("Failed to delete post", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        this.toastService.show(`Failed to delete post: ${message}`, 'error');
      }
    }
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
  
  onStatusChange(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value as 'all' | 'Published' | 'Draft');
  }
}