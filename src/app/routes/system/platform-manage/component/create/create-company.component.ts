import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { PlatformManageService } from '../../platform-manage.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.html',
  styles: []
})
export class CreateCompanyComponent implements OnInit {

  data={
    companyAdmin:"",
    companyName:""
  };

  constructor(
    private platformManageService: PlatformManageService,
    private message: NzMessageService) {}

  ngOnInit() {
  }

  createCompany(){
    this.platformManageService.createCompany(this.data).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('添加公司成功！');
      } else {
        this.message.error('添加公司失败！');
      }
    }, err => {
      this.message.error('添加公司失败！');
    });
  }
}
