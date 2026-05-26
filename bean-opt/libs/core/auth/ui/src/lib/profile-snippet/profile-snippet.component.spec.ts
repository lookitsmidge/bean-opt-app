import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSnippetComponent } from './profile-snippet.component';
import { AuthUser } from '@boa/core-auth-domain';

describe('ProfileSnippetComponent', () => {
  let component: ProfileSnippetComponent;
  let fixture: ComponentFixture<ProfileSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSnippetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute initials from displayName for real users', () => {
    const user: AuthUser = { uid: '1', displayName: 'John Doe', isAnonymous: false } as any;
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();

    expect(component.userInitials()).toBe('JD');
  });

  it('should use "??" for anonymous users', () => {
    const user: AuthUser = { uid: 'guest', isAnonymous: true } as any;
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();

    expect(component.userInitials()).toBe('??');
  });

  it('should hide details when isCollapsed is true', () => {
    fixture.componentRef.setInput('user', { uid: '1', displayName: 'John' } as any);
    fixture.componentRef.setInput('isCollapsed', true);
    fixture.detectChanges();

    const details = fixture.nativeElement.querySelector('.flex-1');
    expect(details.classList).toContain('opacity-0');
  });
});

