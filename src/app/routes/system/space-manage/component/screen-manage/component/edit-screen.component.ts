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
  dashboardId;
  spaceId;
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
      spaceId: this.spaceId,
      dashboardId: this.dashboardId,
      name: this.validateForm.controls.name.value,
      remark: this.validateForm.controls.remark.value,
      isDev: this.validateForm.controls.isDev.value === true ? 'T' : 'F',
      icon: this.validateForm.controls.icon.value,
    };
    this.spaceMangeService.modScreenInfo(params).subscribe(data => {
      if (data.retCode == '00000') {
        this.nzMessage.success('修改成功!');
        this.modalRef.destroy();
      } else {
        this.nzMessage.error(data.retMsg);
      }
    });

    console.log(params);
  }
}
