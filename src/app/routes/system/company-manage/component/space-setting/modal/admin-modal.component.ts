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

  searchChecked(user) {
    // 将用户锁定，并加入勾选数组
    user.checked = !user.checked;
    this.admins.push(user);
  }

  updateAdmins() {
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
    this.companyManageService.searchMisUsers(params).subscribe(res => {
      console.log(res);
      this.searchedAdmins = [];
      this.searchedAdmins = res['retList'];
      this.searchedAdmins.forEach(i => {
        i.checked = false;
        // 查询已被勾选的用户，将其锁定
        this.admins.forEach(j => {
          if (i.userNo === j.userNo) {
            i.checked = !i.checked;
          }
        });
      });
    });
  }
}
