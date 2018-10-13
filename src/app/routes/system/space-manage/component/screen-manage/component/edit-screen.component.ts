import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpaceManageService } from '../../../space-manage.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

@Component({
  templateUrl: './edit-screen.html',
})
export class EditScreenComponent implements OnInit {
  validateForm: FormGroup;
  screenName;
  screenRemark;
  constructor(
    private fb: FormBuilder,
    private spaceMangeService: SpaceManageService,
    private nzMessage: NzMessageService,
    private modalRef: NzModalRef,
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [this.screenName, [Validators.required]],
      remark: [this.screenRemark],
      isDev: [false],
      icon: [''],
    });
  }
  submitForm() {
    const params = {
      spaceId: '111',
      name: this.validateForm.controls.name.value,
      remark: this.validateForm.controls.remark.value,
      isDev: this.validateForm.controls.isDev.value,
      icon: this.validateForm.controls.icon.value,
    };
    this.spaceMangeService.modScreenInfo(params).subscribe(
      data => {
        this.nzMessage.success('修改成功!');
        this.modalRef.destroy();
      },
      error => {
        this.nzMessage.error(data.retMsg);
      },
    );

    console.log(params);
  }
}
