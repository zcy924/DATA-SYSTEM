import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { CompanyManageService } from '../../../company-manage.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.html',
  styles: [],
})
export class CreateSpaceComponent implements OnInit {
  isPublic = 'F';
  space_desc = '';
  space_name = '';
  admins = [];
  searchedAdmins = [];
  key = '';

  constructor(
    private service: CompanyManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
  ) {}

  ngOnInit() {}

  createSpace() {
    this.admins = this.admins.filter(user => user.checked);
    this.admins.forEach(user => {
      user.user_id = user.userId;
    });
    let params = {
      Space: {
        spaceName: this.space_name,
        remark: this.space_desc,
        isPublic: this.isPublic,
        status: 'T',
        avatar: './assets/default/space.png',
        userList: this.admins,
      },
    };
    this.service.createSpace(params).subscribe(
      res => {
        console.log(res);
        this.message.success('添加空间成功！');
        this.modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
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
        console.log(res);
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
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }
}
