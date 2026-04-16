import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = { username: '', email: '', password: '', role: 'candidate' };
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.successMessage = 'Compte créé avec succès ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.loading = false;
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'L\'inscription a échoué';
        this.loading = false;
      }
    });
  }
}
