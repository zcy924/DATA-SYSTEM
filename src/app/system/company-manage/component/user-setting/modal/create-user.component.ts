import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompanyManageService } from '../../../company-manage.service';
import { Observable, of } from 'rxjs';
import { Page } from '../../../../../models/page';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.html',
  styles: [],
})
export class CreateUserComponent implements OnInit {
  userNo = '';
  userName = '';

  constructor(
    private ref: NzModalRef,
    private companyManageService: CompanyManageService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {}

  createUser() {
    let params = {
      userName: this.userName,
      userNo: this.userNo,
      avatar: '.assets/default/user.png',
    };
    this.companyManageService.createUser(params).subscribe(
      res => {
        this.message.success('添加用户成功！');
        this.ref.destroy('ok');
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }
}
