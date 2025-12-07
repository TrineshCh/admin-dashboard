export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  authorId: string;
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export interface Metric {
  title: string;
  value: string;
  change: number;
  icon: string;
}

export interface ChartData {
  label: string;
  value: number;
}