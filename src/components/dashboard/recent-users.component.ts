import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../types';

@Component({
  selector: 'app-recent-users',
  template: `
    <div class="overflow-x-auto">
      <table class="w-full whitespace-no-wrap">
        <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
          @for (user of users(); track user.email) {
            <tr class="text-gray-700 dark:text-gray-400">
              <td class="px-4 py-3">
                <div class="flex items-center text-sm">
                  <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                    <span class="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <svg class="h-full w-full text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold">{{ user.name }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-right">
                {{ timeAgo(user.createdAt) }}
              </td>
            </tr>
          } @empty {
            @for (i of [1, 2, 3, 4, 5]; track i) {
                <tr class="animate-pulse">
                    <td class="px-4 py-3">
                         <div class="flex items-center text-sm">
                             <div class="w-8 h-8 mr-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                             <div>
                                 <div class="w-24 h-4 mb-1 bg-gray-300 rounded dark:bg-gray-700"></div>
                                 <div class="w-32 h-3 bg-gray-300 rounded dark:bg-gray-700"></div>
                             </div>
                         </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-right">
                        <div class="w-20 h-4 bg-gray-300 rounded dark:bg-gray-700 ml-auto"></div>
                    </td>
                </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentUsersComponent {
  users = input.required<Pick<User, 'name' | 'email' | 'createdAt'>[]>();

  timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }
}
