import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../_services/session.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [CommonModule, FormsModule, AsyncPipe],
})
export class LoginComponent {
  
  form: any = {
    username: null,
    password: null
  };
  isLoginFailed = false;
  errorMessage = '';

  readonly player$ = this.sessionService.player$;

  constructor(private readonly authService: AuthService, private readonly sessionService: SessionService) { }

  onSubmit(): void {
    const { username, password } = this.form;
    this.isLoginFailed = false;
    this.errorMessage = '';
    this.authService.login(username, password).subscribe({
      next: player => {
          this.sessionService.setPlayer(player);
      },
      error: err => {
        this.isLoginFailed = true;
        this.errorMessage = err.error?.message ?? 'Unable to login.';
      }
    });
  }
}