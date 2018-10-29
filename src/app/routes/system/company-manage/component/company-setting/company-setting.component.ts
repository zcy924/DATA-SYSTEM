import { Component, OnInit } from '@angular/core';
import {
  NzModalService,
  NzDropdownService,
  NzMessageService,
} from 'ng-zorro-antd';
import { CompanyManageService } from '../../company-manage.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  templateUrl: './company-setting.html',
  styles: [],
})
export class CompanySettingComponent implements OnInit {
  companyName = '';
  admins = [];
  searchedAdmins = [];
  spaceNum = '';
  onlyAdmin;
  key = '';

  constructor(
    private service: CompanyManageService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getCompanyInfo();
  }

  // 公司管理员复选框勾选
  updateChecked(user) {
    // 将取消勾选的用户置为false
    this.admins.forEach(res => {
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
    // 将取消勾选的用户的列表复选框置为false
    this.searchedAdmins.forEach(res => {
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
  }

  // 模糊查询复选框勾选
  searchChecked(user) {
    // 将用户锁定，并加入勾选数组
    user.checked = !user.checked;
    this.admins = this.admins.filter(res => !(res.userNo === user.userNo));
    this.admins.push(user);
  }

  // 查询公司信息
  getCompanyInfo() {
    let params = {};
    this.service.getCompanyInfo(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.companyName = res['companyName'];
        this.admins = res['admins'];
        this.spaceNum = res['spaceNum'];
        this.onlyAdmin = res['onlyAdmin'] === 'T';
        this.admins.every(value => (value.checked = true));
      } else {
        this.message.error('查询失败！');
      }
    });
  }

  searchUsers() {
    if (this.key === '') {
      this.searchedAdmins = [];
      return;
    }
    let params = {
      key: this.key,
      pageSize: '100',
      curPage: '0',
      totalRow: '0',
      totalPage: '0',
    };
    this.service.searchFuzzyUsers(params).subscribe(
      res => {
        this.searchedAdmins = [];
        this.searchedAdmins = res['retList'];
        this.searchedAdmins.forEach(i => {
          i.checked = false;
          // 查询已被勾选的用户，将其锁定
          this.admins.forEach(j => {
            if (i.userNo === j.userNo && j.checked === true) {
              i.checked = !i.checked;
            }
          });
        });
      },
      error => {
        if (error instanceof HttpResponse) {
          this.message.error(error.body.retMsg);
        }
      },
    );
  }

  updateCompany() {
    let params = {
      companyName: this.companyName,
      onlyAdmin: this.onlyAdmin ? 'T' : 'F',
      avatar: './assets/default/company.png',
      admins: this.admins,
    };
    this.service.updateCompanyInfo(params).subscribe(
      res => {
        this.message.success('更新公司信息成功！');
        this.getCompanyInfo();
      },
      error => {
        if (error instanceof HttpResponse) {
          this.message.error(error.body.retMsg);
        }
      },
    );
  }
}
