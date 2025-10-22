import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
     this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
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
        birthDate: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsMismatch: true };
  }


  onRegister() {
    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['passwordsMismatch']) {
        this.toastr.warning('Passwords do not match.');
      } else {
        this.toastr.warning('Please fill in all required fields correctly.');
      }
      return;
    }
  }
}
