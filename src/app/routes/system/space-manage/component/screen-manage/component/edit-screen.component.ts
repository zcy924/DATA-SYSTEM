import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './edit-screen.html',
})
export class EditScreenComponent implements OnInit {
  validateForm: FormGroup;
  screenName;
  screenRemark;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [this.screenName, [Validators.required]],
      remark: [this.screenRemark],
    });
  }
  get name() {
    return this.validateForm.controls.name;
  }
  get remark() {
    return this.validateForm.controls.remark;
  }
  submitForm(){

  }
}
