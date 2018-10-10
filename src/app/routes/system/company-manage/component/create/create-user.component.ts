import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { CompanyManageService } from '../../company-manage.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.html',
  styles: []
})
export class CreateUserComponent implements OnInit {

  data={
    userNo:"",
    userName:""
  };
  constructor( private companyManageService :CompanyManageService,
               private message: NzMessageService) {}

  ngOnInit() {
  }

  createUser(){
    this.companyManageService.createUser(this.data).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('添加用户成功！');
      } else {
        this.message.error('添加用户失败！');
      }
    }, err => {
      this.message.error('添加用户失败！');
    });
  }
}
