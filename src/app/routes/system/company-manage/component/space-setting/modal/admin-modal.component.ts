import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompanyManageService } from '../../../company-manage.service';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.html',
  styles: [],
})
export class AdminModalComponent implements OnInit {

  admins = [];
  searchedAdmins = [];
  spaceId = '';
  key = '';

  constructor(
    private companyManageService: CompanyManageService,
    private message: NzMessageService,
    private nzModelRef: NzModalRef,
  ) {
  }

  ngOnInit() {
  }

  // 空间管理员复选框勾选
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

  updateAdmins() {
    this.admins = this.admins.filter(user=>user.checked);
    let params = {
      spaceId: this.spaceId,
      admins: this.admins,
    };
    this.companyManageService.updateAdmins(params).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('修改管理员成功！');
        // this.nzModelRef.destroy('ok');
      } else {
        this.message.error('修改管理员失败！');
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
    this.companyManageService.searchFuzzyUsers(params).subscribe(res => {
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
    });
  }
}
