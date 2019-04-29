import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CoreService } from '../core.service';
import { tokenSetter } from '../token-store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private coreService: CoreService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({ email: '', password: '' });
  }

  logIn() {
    this.coreService.logIn(this.loginForm.value).subscribe(data => {
      console.log(`Logged in as ${data['user']['name']}.`);
    });
  }
}
