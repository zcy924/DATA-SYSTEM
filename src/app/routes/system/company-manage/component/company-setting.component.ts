import { Component, OnInit } from '@angular/core';
import { NzModalService, NzDropdownService, NzMessageService } from 'ng-zorro-antd';
import { CompanyManageService } from '../company-manage.service';

@Component({
  templateUrl: './company-setting.html',
  styles: [],
})
export class CompanySettingComponent implements OnInit {

  companyName='';
  admins=[];
  spaceNum='';
  onlyAdmin=[];

  constructor(
    private service: CompanyManageService,
    private message: NzMessageService,) {
  }

  ngOnInit() {
    this.getCompanyInfo()
  }

  updateChecked(user) {
    user.checked = !user.checked;
  }

  getCompanyInfo() {
    let params = {};
    this.service.getCompanyInfo(params).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.companyName = res['Company']['companyName'];
        this.admins =  res['Company']['admins'];
        this.spaceNum =  res['Company']['spaceNum'];
        this.onlyAdmin = res['Company']['onlyAdmin'];
        this.admins.every(value => value.checked = true);
        // this.message.success('修改成功！');
        // this.modalRef.destroy('ok');
      } else {
        this.message.error('修改失败！');
      }
    });
  }


}
