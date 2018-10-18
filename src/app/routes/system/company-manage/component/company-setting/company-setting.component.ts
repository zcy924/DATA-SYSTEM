import { Component, OnInit } from '@angular/core';
import { NzModalService, NzDropdownService, NzMessageService } from 'ng-zorro-antd';
import { CompanyManageService } from '../../company-manage.service';

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
    private message: NzMessageService) {
  }

  ngOnInit() {
    this.getCompanyInfo();
  }

  // 公司管理员复选框勾选
  updateChecked(user) {
    // 将取消勾选的用户移除
    this.admins = this.admins.filter(res => {
      if (user.userNo === res.userNo) {
        return false;
      }
      return true;
    });
    // 将取消勾选的用户复选框初始化
    this.searchedAdmins.forEach(res => {
      if (user.userNo === res.userNo) {
        user.checked = !user.checked;
      }
    });
  }

  // 模糊查询复选框勾选
  searchChecked(user) {
    // 将用户锁定，并加入勾选数组
    user.checked = !user.checked;
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
        this.admins.every(value => value.checked = true);
      } else {
        this.message.error('查询失败！');
      }
    });
  }

  searchUsers() {
    let params = {
      key: this.key,
      pageSize: '100',
      curPage: '0',
      totalRow: '0',
      totalPage: '0',
    };
    this.service.searchMisUsers(params).subscribe(res => {
      console.log(res);
      this.searchedAdmins = [];
      this.searchedAdmins = res['retList'];
      this.searchedAdmins.forEach(i => {
        i.checked = false;
        // 查询已被勾选的用户，将其锁定
        this.admins.forEach(j => {
          if (i.userNo === j.userNo) {
            i.checked = !i.checked;
            console.log(i.userName);
          }
        });
      });
    });
  }

  updateCompany() {
    let params = {
      companyName: this.companyName,
      onlyAdmin: this.onlyAdmin ? 'T' : 'F',
      avatar: './assets/default/company.png',
      admins: this.admins,
    };
    this.service.updateCompanyInfo(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.error('更新公司信息成功！');
      }else {
        this.message.error('更新公司信息失败！');
      }
    });
  }
}