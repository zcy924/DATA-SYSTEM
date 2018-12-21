import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SpaceManageService } from '../../../space-manage.service';
import { ICONS } from 'app/models/icons';
import { HttpResponse } from '@angular/common/http';

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
export class AddScreenComponent implements OnInit {
  validateForm: FormGroup;
  spaceId;
  companyId;
  styleArray = ['template-card'];
  selected1: Boolean = false;
  selected2: Boolean = false;
  selected3: Boolean = false;
  selected4: Boolean = false;
  iconId;
  icons = ICONS;
  iconsArry = [];
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
      isDev: [false],
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
      icon: this.iconId,
      templetId: 'adasdadasd',
      isDev: this.validateForm.controls.isDev.value ? 'T' : 'F',
    };
    this.spaceManageService.addScreen(params).subscribe(
      data => {
        this.nzMessage.success('新增大屏成功!');
        // this.modal.destroy('ok');
      },
      err => {
        if (err instanceof HttpResponse) {
          this.nzMessage.error(err.body.retMsg);
        }
      },
    );
    // return this.spaceManageService.addScreen(params);
  }
  test() {
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
