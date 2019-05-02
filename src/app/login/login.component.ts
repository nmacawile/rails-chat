import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { tokenSetter } from '../token-store';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  unlocked = true;

  constructor(private fb: FormBuilder, private coreService: CoreService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  logIn() {
    if (this.loginForm.valid) {
      this.unlocked = false;
      this.coreService
        .logIn(this.loginForm.value)
        .pipe(finalize(() => (this.unlocked = true)))
        .subscribe(data =>
          console.log(`Logged in as ${data['user']['name']}.`),
        );
    }
  }

  formError(fieldName: string, errorName: string) {
    return (
      this.loginForm.get(fieldName).errors &&
      this.loginForm.get(fieldName).errors[errorName]
    );
  }
}
