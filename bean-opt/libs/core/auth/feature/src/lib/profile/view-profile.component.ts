import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthStore, ProfileStore } from '@boa/core-auth-application';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-profile-view',
  templateUrl: './view-profile.component.html',
  styles: [],
  imports: [CommonModule],
})
export class ViewProfileComponent {
  protected authStore = inject(AuthStore);
  protected profileStore = inject(ProfileStore);
  private router = inject(Router);

  public User = this.authStore.user;
  public UserProfile = this.profileStore.profile;

  public UsersAvatar = computed(() => {
    const user = this.authStore.user();
    const profile = this.UserProfile();
    const avatar = this.User()?.photoUrl;

    if (profile == null || user == null) return '?';
    if (avatar != null && avatar != '') return avatar;

    const split = user.displayName?.split(" ") ?? [];
    if (split[0].length == 0 || split.length < 1) return "?";
    else if (split.length < 2 || (split[0].length == 1 && split[1].length == 0)) return split[0].charAt(0).toUpperCase();

    return (split[0].charAt(0) + split[1].charAt(0)).toUpperCase();
  })

  public Avatar = computed(() => this.authStore.user()?.photoUrl ?? '');

  public logout() {
    this.authStore.logout();
    this.router.navigate(['/auth']);
  }
}


