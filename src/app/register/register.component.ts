import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  unlocked = true;

  constructor(
    private fb: FormBuilder,
    private coreService: CoreService,
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required]],
      },
      {
        validators: [this.passwordMatchValidator],
      },
    );
  }

  formError(fieldName: string, errorName: string) {
    return (
      this.registerForm.get(fieldName).errors &&
      this.registerForm.get(fieldName).errors[errorName]
    );
  }

  register() {
    if (this.registerForm.valid) {
      this.unlocked = false;
      this.coreService
        .register(this.registerForm.value)
        .pipe(finalize(() => (this.unlocked = true)))
        .subscribe();
    }
  }

  private passwordMatchValidator(form: FormGroup): null {
    let pw = form.controls['password'];
    let pwc = form.controls['password_confirmation'];
    if (pw.value !== pwc.value) pwc.setErrors({ match: true });
    return;
  }
}
