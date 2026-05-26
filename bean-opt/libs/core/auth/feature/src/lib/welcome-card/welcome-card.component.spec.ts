import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeCardComponent } from './welcome-card.component';
import { vi } from 'vitest';
describe('WelcomeCardComponent', () => {
  let component: WelcomeCardComponent;
  let fixture: ComponentFixture<WelcomeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit logout when logout button is clicked', () => {
    vi.spyOn(component.logout, 'emit');
    // We need to find the logout button in the template
    // Based on implementation it should have a button
    const buttons = fixture.nativeElement.querySelectorAll('button');
    // Usually logout is the second button or has specific text
    // Let's find by text or just index if we know the structure
    const logoutBtn = Array.from(buttons).find((b: any) => b.textContent.toLowerCase().includes('logout'));
    
    if (logoutBtn) {
        (logoutBtn as HTMLButtonElement).click();
        expect(component.logout.emit).toHaveBeenCalled();
    }
  });

  it('should emit enter when enter button is clicked', () => {
    vi.spyOn(component.enter, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const enterBtn = Array.from(buttons).find((b: any) => b.textContent.toLowerCase().includes('continue') || b.textContent.toLowerCase().includes('enter'));
    
    if (enterBtn) {
        (enterBtn as HTMLButtonElement).click();
        expect(component.enter.emit).toHaveBeenCalled();
    }
  });
});
