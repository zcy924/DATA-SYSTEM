import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CreateUserComponent } from './create/create-user.component';
import { CompanyManageService } from '../company-manage.service';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.html',
})

export class UserSettingComponent implements OnInit {
  loading = true;
  dataSet = [];
  pageIndex = 1;
  pageSize = 5;
  total = 100;

  constructor(
    private nzModel: NzModalService,
    private message: NzMessageService,
    private companyManageService: CompanyManageService) {
  }

  ngOnInit() {
    this.searchData(true);
  }

  showCreateUserModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `${title}`,
      nzContent: CreateUserComponent,
      nzWidth: '50%',
      nzOnOk: (ref) => {
        console.log(ref.data);
        ref.createUser();
        this.searchData(true);
      },
    });
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    let params = {
      start: this.pageIndex,
      limit: this.pageSize,
    };
    this.companyManageService.getUserList(params)
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        this.dataSet = res['retList'];
        this.total = this.dataSet.length;
      }, err => {
        console.log(err);
      });
  }

  showDelUserConfirm(userNo: string): void{
    this.nzModel.confirm({
      nzTitle: '是否删除此用户',
      // nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
      nzOnOk: (res) =>{
        this.delUser(userNo);
      }
    });
  }

  delUser(userNo: string): void {
    let params = {
      userNo: userNo,
    };
    this.companyManageService.delUser(params)
      .subscribe(res => {
        if (res['retCode'] === '00000') {
          this.message.success('删除用户成功！');
        } else {
          this.message.error('删除用户失败！');
        }
      }, err => {
        this.message.error('删除用户失败！');
      });
  }
}
