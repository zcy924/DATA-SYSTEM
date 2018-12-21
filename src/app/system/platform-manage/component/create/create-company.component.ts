import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { PlatformManageService } from '../../platform-manage.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.html',
  styles: [],
})
export class CreateCompanyComponent implements OnInit {

  companyAdmin;
  companyName;
  adminName;

  constructor(
    private platformManageService: PlatformManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
  }

  createCompany() {
    let params = {
      companyName: this.companyName,
      companyAdmin: this.companyAdmin,
      adminName: this.adminName,
      avatar: './assets/default/company.png',
      onlyAdmin: 'T',
    };
    this.platformManageService.createCompany(params).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('添加公司成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('添加公司失败！');
      }
    });
  }
}
