import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CreateUserComponent } from './modal/create-user.component';
import { CompanyManageService } from '../../company-manage.service';
import { Page } from '../../../../../models/page';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.html',
})
export class UserSettingComponent implements OnInit {
  loading = true;
  dataSet = [];
  page = new Page();
  key = '';

  constructor(
    private nzModel: NzModalService,
    private message: NzMessageService,
    private companyManageService: CompanyManageService,
    public settings: SettingsService,
  ) {
    console.log(this.settings.user);
  }

  ngOnInit() {
    this.searchUserList(true);
  }

  // 添加用户的对话框
  showCreateUserModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `${title}`,
      nzContent: CreateUserComponent,
      nzWidth: '50%',
      nzOnOk: ref => {
        return new Promise(res => {
          ref.createUser();
        });
      },
    });
    modal.afterClose.subscribe(ref => {
      if (ref === 'ok') {
        this.searchUserList(true);
      }
    });
  }

  // 查询用户列表
  searchUserList(reset: boolean = false): void {
    if (!(this.key === '')) {
      this.searchFuzzyUserList(reset);
      return;
    }
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    let params = {
      pageSize: this.page.pageSize,
      curPage: this.page.curPage,
      totalPage: this.page.totalPage,
      totalRow: this.page.totalRow,
    };
    this.companyManageService.getUserList(params).subscribe(
      res => {
        console.log(res);
        this.loading = false;
        this.dataSet = res['retList'];
        this.page.totalRow = res['totalRow'];
        this.page.totalPage = res['totalPage'];
      },
      err => {
        console.log(err);
      },
    );
  }

  // 删除用户的对话框
  // showDelUserConfirm(userNo: string): void {
  //   this.nzModel.confirm({
  //     nzTitle: '是否删除此用户',
  //     nzOnOk: res => {
  //       this.delUser(userNo);
  //     },
  //   });
  // }

  // 删除用户
  delUser(userNo: string): void {
    const params = {
      userNo: userNo,
    };
    if (userNo === this.settings.user.userNo) {
      this.nzModel.warning({
        nzTitle: '该用户为当前登录用户在此状态下不可删除！',
        nzCancelText: null,
        nzOkText: '知道了',
      });
    } else {
      this.nzModel.confirm({
        nzTitle: '确认删除当前用户？',
        nzOnOk: () => {
          this.companyManageService.delUser(params).subscribe(res => {
            if (res['retCode'] === '00000') {
              this.message.success('删除用户成功！');
              this.searchUserList(true);
            } else {
              this.message.error('删除用户失败！');
            }
          });
        },
      });
    }
  }

  // 模糊查询用户
  searchFuzzyUserList(reset: boolean = false): void {
    if (this.key === '') {
      this.searchUserList(reset);
      return;
    }
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    let params = {
      key: this.key,
      pageSize: this.page.pageSize,
      curPage: this.page.curPage,
      totalPage: this.page.totalPage,
      totalRow: this.page.totalRow,
    };
    this.companyManageService.searchFuzzyUsers(params).subscribe(
      res => {
        console.log(res);
        this.loading = false;
        this.dataSet = res['retList'];
        this.page.totalRow = res['totalRow'];
        this.page.totalPage = res['totalPage'];
      },
      err => {
        console.log(err);
      },
    );
  }
}
