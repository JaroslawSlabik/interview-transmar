import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoginFormComponent, LoginCredentials } from './login-form.component';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LoginFormComponent] });
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('powinien wyrenderować formularz logowania', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')?.textContent).toContain('Zaloguj się');
  });

  it('powinien zawierać pole na login i hasło', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(2);
    expect(inputs[1].type).toBe('password');
  });

  it('nie powinien pokazywać błędu gdy loginError jest pusty', () => {
    const error = fixture.nativeElement.querySelector('.bg-red-50');
    expect(error).toBeNull();
  });

  it('powinien pokazać komunikat błędu gdy loginError jest ustawiony', () => {
    fixture.componentRef.setInput('loginError', 'Błędne dane logowania!');
    fixture.detectChanges();
    const error: HTMLElement = fixture.nativeElement.querySelector('.bg-red-50');
    expect(error?.textContent).toContain('Błędne dane logowania!');
  });

  it('powinien emitować zdarzenie login z poprawnymi danymi po kliknięciu Zaloguj', () => {
    let emitted: LoginCredentials | undefined;
    component.login.subscribe((creds: LoginCredentials) => (emitted = creds));

    const inputs = fixture.nativeElement.querySelectorAll('input');
    inputs[0].value = 'jan';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[1].value = 'sekret';
    inputs[1].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    component['username'] = 'jan';
    component['password'] = 'sekret';
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toEqual({ username: 'jan', password: 'sekret' });
  });
});
