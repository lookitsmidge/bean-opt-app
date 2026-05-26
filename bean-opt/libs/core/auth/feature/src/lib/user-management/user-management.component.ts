import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersStore } from '@boa/core-auth-application';
import { CollectorProfile } from '@boa/core-auth-domain';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  providers: [UsersStore],
  template: `
    <div class="animate-in fade-in duration-700 pb-20 pt-4 max-w-full px-2">
      <!-- Premium Governance Banner -->
      <div class="relative bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 mb-8 overflow-hidden shadow-2xl">
        <div class="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-slate-900/10 pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span class="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2 block">Administrative Layer</span>
            <h1 class="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
              User <span class="text-indigo-400 font-black">Governance</span>
            </h1>
          </div>
          <div class="flex flex-wrap gap-6 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem]">
            @for (stat of bannerStats(); track stat.label) {
              <div class="flex flex-col">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</span>
                <span class="text-xl font-black tracking-tight" [class]="stat.valueClass || 'text-white'">{{ stat.value }}</span>
              </div>
            }
          </div>
        </div>
      </div>
 
      <div class="max-w-5xl mx-auto px-4 relative">
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <!-- Total Users -->
          <button (click)="store.setRoleFilter('all')" class="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border shadow-md flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 hover:border-indigo-100 hover:shadow-indigo-50/30 transition-all active:scale-95 duration-300 cursor-pointer"
               [class.border-indigo-500]="store.roleFilter() === 'all'" [class.border-slate-100]="store.roleFilter() !== 'all'">
            <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total</span>
            <span class="text-3xl font-black italic tracking-tighter text-slate-900 leading-none group-hover:scale-110 transition-transform">
              {{ store.stats()['total'] || 0 }}
            </span>
          </button>
 
          <!-- Admins -->
          <button (click)="store.setRoleFilter('admin')" class="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border shadow-md flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 hover:border-rose-100 hover:shadow-rose-50/30 transition-all active:scale-95 duration-300 cursor-pointer"
               [class.border-rose-500]="store.roleFilter() === 'admin'" [class.border-slate-100]="store.roleFilter() !== 'admin'">
            <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Commanders</span>
            <span class="text-3xl font-black italic tracking-tighter text-rose-600 leading-none group-hover:scale-110 transition-transform">
              {{ store.stats()['admin'] || 0 }}
            </span>
          </button>
 
          <!-- Moderators -->
          <button (click)="store.setRoleFilter('moderator')" class="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border shadow-md flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 hover:border-indigo-100 hover:shadow-indigo-50/30 transition-all active:scale-95 duration-300 cursor-pointer"
               [class.border-indigo-500]="store.roleFilter() === 'moderator'" [class.border-slate-100]="store.roleFilter() !== 'moderator'">
            <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Moderators</span>
            <span class="text-3xl font-black italic tracking-tighter text-indigo-600 leading-none group-hover:scale-110 transition-transform">
              {{ store.stats()['moderator'] || 0 }}
            </span>
          </button>
 
          <!-- Sellers -->
          <button (click)="store.setRoleFilter('seller')" class="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border shadow-md flex flex-col items-center justify-center text-center group hover:bg-slate-50/50 hover:border-emerald-100 hover:shadow-emerald-50/30 transition-all active:scale-95 duration-300 cursor-pointer"
               [class.border-emerald-500]="store.roleFilter() === 'seller'" [class.border-slate-100]="store.roleFilter() !== 'seller'">
            <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Sellers</span>
            <span class="text-3xl font-black italic tracking-tighter text-emerald-600 leading-none group-hover:scale-110 transition-transform">
              {{ store.stats()['seller'] || 0 }}
            </span>
          </button>
 
          <!-- Banned -->
          <button (click)="store.setRoleFilter('banned')" class="bg-rose-50/50 backdrop-blur-xl p-6 rounded-[2.5rem] border shadow-md flex flex-col items-center justify-center text-center group hover:bg-rose-100/30 hover:border-rose-200 hover:shadow-rose-50/30 transition-all active:scale-95 duration-300 cursor-pointer"
               [class.border-rose-600]="store.roleFilter() === 'banned'" [class.border-rose-100]="store.roleFilter() !== 'banned'">
            <span class="text-[8px] font-black uppercase tracking-[0.2em] text-rose-400 mb-1">Terminated</span>
            <span class="text-3xl font-black italic tracking-tighter text-rose-700 leading-none group-hover:scale-110 transition-transform">
              {{ store.stats()['banned'] || 0 }}
            </span>
          </button>
        </div>
 
        <!-- Search & Filter Bar -->
        <div class="flex flex-col lg:flex-row items-center gap-4 mb-8">
          <div class="w-full lg:flex-1">
            <div class="relative w-full">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <mat-icon class="text-lg">search</mat-icon>
              </span>
              <input 
                type="text" 
                #searchInput
                (input)="store.searchUsers(searchInput.value)"
                placeholder="Search by name or handle..." 
                class="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              />
            </div>
          </div>
 
          <!-- Pill Filters -->
          <div class="flex items-center gap-2 p-1.5 bg-slate-100 rounded-full border border-slate-200/50 overflow-x-auto no-scrollbar w-full lg:w-auto shadow-inner">
            @for (role of ['all', 'admin', 'moderator', 'seller', 'collector', 'banned']; track role) {
              <button 
                (click)="store.setRoleFilter(role)"
                class="px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95"
                [class.bg-slate-900]="store.roleFilter() === role"
                [class.text-white]="store.roleFilter() === role"
                [class.shadow-md]="store.roleFilter() === role"
                [class.shadow-slate-950/20]="store.roleFilter() === role"
                [class.text-slate-500]="store.roleFilter() !== role"
                [class.hover:text-slate-800]="store.roleFilter() !== role"
              >
                {{ role === 'banned' ? 'terminated' : role }}
              </button>
            }
          </div>
        </div>
 
        <!-- Background Saving Indicator -->
        @if (store.saving()) {
          <div class="absolute top-0 right-4 animate-in fade-in slide-in-from-right-4">
            <div class="px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-full shadow-xl flex items-center gap-2 border border-slate-800">
              <div class="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin"></div>
              <span class="text-[8px] font-black uppercase tracking-widest text-white">System Processing...</span>
            </div>
          </div>
        }
 
        <!-- User List -->
        <div class="space-y-4">
          @if (store.loading()) {
            <div class="flex flex-col items-center justify-center py-12 gap-3 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] shadow-xl">
              <div class="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Searching Users...</p>
            </div>
          } @else {
            @for (user of store.users(); track user.uid) {
              <div class="bg-white/80 backdrop-blur-xl border rounded-[2.5rem] p-6 flex flex-col md:flex-row md:items-center justify-between shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 relative overflow-hidden gap-4"
                  [class.border-rose-100]="user.isBanned"
                  [class.bg-rose-50/20]="user.isBanned"
                  [class.hover:border-rose-200]="user.isBanned"
                  [class.border-slate-100]="!user.isBanned">
                
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shadow-md relative flex-shrink-0 flex items-center justify-center">
                    @if (user.photoUrl) {
                      <img [src]="user.photoUrl" alt="Avatar" class="w-full h-full object-cover" />
                    } @else {
                      <div class="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black italic text-xs">
                        {{ (user.displayName[0] || '?').toUpperCase() }}
                      </div>
                    }
                    @if (user.isBanned) {
                      <div class="absolute inset-0 bg-rose-600/40 flex items-center justify-center backdrop-blur-[1px]">
                        <mat-icon class="text-white text-base">gavel</mat-icon>
                      </div>
                    }
                  </div>
                  <div>
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="text-sm font-black uppercase tracking-tight"
                          [class.text-rose-900]="user.isBanned"
                          [class.text-slate-900]="!user.isBanned">{{ user.displayName }}</h3>
                      @if (user.isBanned) {
                        <span class="px-2 py-0.5 bg-rose-600 text-white text-[7px] font-black uppercase rounded-full animate-pulse border border-rose-700">Access Terminated</span>
                      }
                    </div>
                    <p class="text-[10px] font-mono font-bold text-indigo-600">@{{ user.handle }}</p>
                  </div>
                </div>
 
                <!-- Role & Admin Actions -->
                <div class="flex flex-wrap items-center gap-4">
                  <div class="flex items-center gap-2 pr-4 border-r border-slate-100">
                    <button 
                      (click)="store.updateUserRole({ uid: user.uid, role: 'admin' })"
                      class="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border"
                      [class.bg-rose-600]="user.roles.includes('admin')"
                      [class.border-rose-600]="user.roles.includes('admin')"
                      [class.text-white]="user.roles.includes('admin')"
                      [class.shadow-md]="user.roles.includes('admin')"
                      [class.shadow-rose-600/20]="user.roles.includes('admin')"
                      [class.bg-slate-50]="!user.roles.includes('admin')"
                      [class.border-slate-100]="!user.roles.includes('admin')"
                      [class.text-slate-300]="!user.roles.includes('admin')"
                    >
                      Commander
                    </button>
                    <button 
                      (click)="store.updateUserRole({ uid: user.uid, role: 'moderator' })"
                      class="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border"
                      [class.bg-indigo-600]="user.roles.includes('moderator')"
                      [class.border-indigo-600]="user.roles.includes('moderator')"
                      [class.text-white]="user.roles.includes('moderator')"
                      [class.shadow-md]="user.roles.includes('moderator')"
                      [class.shadow-indigo-600/20]="user.roles.includes('moderator')"
                      [class.bg-slate-50]="!user.roles.includes('moderator')"
                      [class.border-slate-100]="!user.roles.includes('moderator')"
                      [class.text-slate-300]="!user.roles.includes('moderator')"
                    >
                      Moderator
                    </button>
                    <button 
                      (click)="store.updateUserRole({ uid: user.uid, role: 'seller' })"
                      class="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border"
                      [class.bg-emerald-600]="user.roles.includes('seller')"
                      [class.border-emerald-600]="user.roles.includes('seller')"
                      [class.text-white]="user.roles.includes('seller')"
                      [class.shadow-md]="user.roles.includes('seller')"
                      [class.shadow-emerald-600/20]="user.roles.includes('seller')"
                      [class.bg-slate-50]="!user.roles.includes('seller')"
                      [class.border-slate-100]="!user.roles.includes('seller')"
                      [class.text-slate-300]="!user.roles.includes('seller')"
                    >
                      Seller
                    </button>
                  </div>
 
                  <!-- Critical Actions -->
                  <div class="flex items-center gap-2">
                    <!-- Ban Toggle (Gavel) -->
                    <button 
                      (click)="onBanClick(user)"
                      class="p-3 rounded-xl transition-all active:scale-90 flex items-center justify-center border"
                      [class.bg-rose-50]="!user.isBanned"
                      [class.border-rose-100]="!user.isBanned"
                      [class.text-rose-600]="!user.isBanned"
                      [class.bg-emerald-50]="user.isBanned"
                      [class.border-emerald-100]="user.isBanned"
                      [class.text-emerald-600]="user.isBanned"
                      [title]="user.isBanned ? 'Unban User' : 'Ban User'"
                    >
                      <mat-icon class="text-base">gavel</mat-icon>
                    </button>
 
                    <!-- Hard Delete (Trash/Delete) -->
                    <button 
                      (click)="onDeleteClick(user)"
                      class="p-3 rounded-xl bg-slate-900 text-white hover:bg-black transition-all active:scale-90 border border-slate-900 shadow-lg flex items-center justify-center"
                      title="Permanently Delete Account"
                    >
                      <mat-icon class="text-base">delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="text-center py-10 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">No users found.</p>
              </div>
            }
          }
        </div>
 
        <!-- Paginator -->
        @if (store.totalPages() > 1) {
          <div class="mt-12 flex flex-col items-center gap-6 pb-12">
            <div class="flex items-center gap-4">
              <button 
                [disabled]="store.currentPage() === 1"
                (click)="store.setPage(store.currentPage() - 1)"
                class="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
              >
                <mat-icon>chevron_left</mat-icon>
              </button>
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Page {{ store.currentPage() }} of {{ store.totalPages() }}
              </span>
              <button 
                [disabled]="store.currentPage() === store.totalPages()"
                (click)="store.setPage(store.currentPage() + 1)"
                class="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
              >
                <mat-icon>chevron_right</mat-icon>
              </button>
            </div>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">WFi Archival Retrieval System</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  protected store = inject(UsersStore);

  bannerStats = computed(() => [
    { label: 'Total Registry', value: this.store.stats()['total'] || 0 },
    { label: 'Commanders', value: this.store.stats()['admin'] || 0, valueClass: 'text-rose-400' },
    { label: 'Moderators', value: this.store.stats()['moderator'] || 0, valueClass: 'text-indigo-400' },
    { label: 'Verified Sellers', value: this.store.stats()['seller'] || 0, valueClass: 'text-emerald-400' }
  ]);

  constructor() {
    this.store.loadStats();
    this.store.searchUsers('');
  }

  async onBanClick(user: CollectorProfile) {
    const isBanning = !user.isBanned;
    const message = isBanning
      ? `Confirm Account Termination\n\nAre you sure you want to terminate archival access for @${user.handle}? They will be blocked from all write operations.`
      : `Restore Account Access\n\nAre you sure you want to restore access for @${user.handle}?`;
    
    if (confirm(message)) {
      this.store.toggleUserBan(user.uid);
    }
  }

  async onDeleteClick(user: CollectorProfile) {
    const message = `CRITICAL: Permanent Deletion\n\nYou are about to PERMANENTLY DELETE the account for @${user.handle}. This action will wipe all their vaults, collections, and images. It CANNOT be undone.`;
    
    if (confirm(message)) {
      this.store.hardDeleteUser(user.uid);
    }
  }
}
