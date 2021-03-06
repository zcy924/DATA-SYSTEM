import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { ICONS } from 'app/models/icons';
import { HttpResponse } from '@angular/common/http';
import {PersonalCenterService} from "../../personal-center.service";

@Component({
  templateUrl: './edit-screen-collect.html',
  styles: [
      `
      .icon {
        width: 48px;
        height: 48px;

        text-align: center;
        line-height: 56px;
        float: left;
      }

      .icon:hover {
        background: #1890ff;
      }

      .checked {
        background: #1890ff;
      }
    `,
  ],
})
export class EditScreenCollectComponent implements OnInit {
  validateForm: FormGroup;
  screenName;
  screenRemark;
  dashboardId;
  spaceId;
  iconId;
  icons = ICONS;
  iconsArry = [];

  constructor(
    private fb: FormBuilder,
    private service: PersonalCenterService,
    private nzMessage: NzMessageService,
    private modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [this.screenName, [Validators.required]],
      remark: [this.screenRemark],
      icon: [''],
    });
    // tslint:disable-next-line:forin
    for (let i in this.icons) {
      const item = {
        id: i,
        icon: this.icons[i],
        checked: false,
      };
      this.iconsArry.push(item);
    }
  }

  submitForm() {
    const params = {
      keepDashBoardId: this.dashboardId,
      keepDashBoardName: this.validateForm.controls.name.value,
      remark: this.validateForm.controls.remark.value,
      icon: this.iconId,
    };
    this.service.modSelfScreenInfo(params).subscribe(
      data => {
        this.nzMessage.success('修改成功!');
        this.modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpResponse) {
          this.nzMessage.error(err.body.retMsg);
        }
      },
    );

    console.log(params);
  }

  selectIcon(id) {
    this.iconId = this.iconsArry[id].icon;
    // tslint:disable-next-line:forin
    for (let i in this.iconsArry) {
      if (id == i) {
        this.iconsArry.map(value => {
          value.checked = false;
        });
        this.iconsArry[i].checked = true;
      }
    }
  }
}
