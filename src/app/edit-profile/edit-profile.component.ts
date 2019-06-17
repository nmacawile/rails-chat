import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User } from '../user';
import { Store } from '@ngrx/store';
import { update } from '../auth.actions';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  unlocked = true;

  constructor(
    private fb: FormBuilder,
    private coreService: CoreService,
    private store: Store<{ user: User }>,
    private router: Router,
  ) {}

  ngOnInit() {
    this.editProfileForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', Validators.required],
    });

    this.coreService.validateToken().subscribe((user: User) => {
      this.store.dispatch(update(user));
      this.editProfileForm.setValue({
        first_name: user.first_name,
        last_name: user.last_name,
      });
    });
  }

  formError(fieldName: string, errorName: string) {
    return (
      this.editProfileForm.get(fieldName).errors &&
      this.editProfileForm.get(fieldName).errors[errorName]
    );
  }

  update() {
    const dirtyFields = this.filterDirtyFields();
    const hasDirtyFields = Object.values(dirtyFields).length > 0;
    if (hasDirtyFields && this.editProfileForm.valid) {
      this.unlocked = false;
      this.coreService
        .update(dirtyFields)
        .pipe(finalize(() => (this.unlocked = true)))
        .subscribe();
    }
  }

  back() {
    this.router.navigate(['/']);
  }

  private filterDirtyFields() {
    const dirtyFields = {};
    const keys = Object.keys(this.editProfileForm.controls);
    const dirtyControls = keys.filter(key => {
      return this.editProfileForm.get(key).dirty;
    });
    dirtyControls.forEach(key => {
      dirtyFields[key] = this.editProfileForm.value[key];
    });
    return dirtyFields;
  }
}
