import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  private auth = inject(AuthService);
  private router = inject(Router);


  constructor(private fb: FormBuilder) {
     this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        given_name: ['', Validators.required],
        family_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
            ),
          ],
        ],
        repeatPassword: ['', Validators.required],
        birthdate: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsMismatch: true };
  }


  async onRegister() {
    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['passwordsMismatch']) {
        alert('Passwords do not match.');
      } else {
        alert('Please fill in all required fields correctly.');
      }
      return;
    } else {
      await this.auth.register(this.registerForm.value);
      this.router.navigate(['/login']).then(() => {
        alert('Successfully created an account');
      });
    }
  }
}
