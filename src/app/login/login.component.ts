import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { tokenSetter } from '../token-store';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

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
    private router: Router,
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
        .logIn(this.loginForm.value)
        .pipe(finalize(() => (this.unlocked = true)))
        .subscribe(data =>
          this.router.navigate([this.returnUrl])
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
