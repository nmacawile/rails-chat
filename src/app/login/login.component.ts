import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { tokenSetter } from '../token-store';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  unlocked = true;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private coreService: CoreService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  logIn() {
    if (this.loginForm.valid) {
      this.unlocked = false;
      this.coreService
        .logIn(this.loginForm.value, this.returnUrl)
        .pipe(finalize(() => (this.unlocked = true)))
        .subscribe();
    }
  }

  formError(fieldName: string, errorName: string) {
    return (
      this.loginForm.get(fieldName).errors &&
      this.loginForm.get(fieldName).errors[errorName]
    );
  }
}
