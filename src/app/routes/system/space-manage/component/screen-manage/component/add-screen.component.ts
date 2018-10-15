import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SpaceManageService } from '../../../space-manage.service';
import { Observable, of } from 'rxjs';

@Component({
  templateUrl: './add-screen.html',
  styles: [
    `
      .template-card {
        border: solid 1px #d9d9d9;
      }
      .selected-card {
        background-color: #23b7e5;
      }
    `,
  ],
})
export class AddScreenComponent implements OnInit {
  validateForm: FormGroup;
  spaceId;
  companyId;
  styleArray = ['template-card'];
  selected1: Boolean = false;
  selected2: Boolean = false;
  selected3: Boolean = false;
  selected4: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private nzMessage: NzMessageService,
    private modal: NzModalRef,
    private spaceManageService: SpaceManageService,
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      remark: [null],
    });
  }
  submitForm() {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    const params = {
      companyId: this.companyId,
      spaceId: this.spaceId,
      name: this.validateForm.controls.name.value,
      remark: this.validateForm.controls.remark.value,
      icon: 'anticon anticon-area-chart',
      templetId: 'adasdadasd',
      isDev: true,
    };
    this.spaceManageService.addScreen(params).subscribe(data => {
      if (data.retCode === '00000') {
        this.nzMessage.success('新增大屏成功!');
        this.modal.destroy('ok');
      } else {
        this.nzMessage.error(data.retMsg);
      }
    });
    // return this.spaceManageService.addScreen(params);
  }
  test(){
    setTimeout(() => {
      return this.submitForm();
    }, 2000);
  }
  checked(i) {
    switch (i) {
      case 1:
        this.selected1 = !this.selected1;
        this.selected2 = false;
        this.selected3 = false;
        this.selected4 = false;
        break;
      case 2:
        this.selected2 = !this.selected2;
        this.selected1 = false;
        this.selected3 = false;
        this.selected4 = false;
        break;
      case 3:
        this.selected3 = !this.selected3;
        this.selected1 = false;
        this.selected2 = false;
        this.selected4 = false;
        break;
      case 4:
        this.selected4 = !this.selected4;
        this.selected2 = false;
        this.selected3 = false;
        this.selected1 = false;
        break;
    }
  }
}
