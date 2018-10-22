import { Component, OnInit } from '@angular/core';
import { CompanyManageService } from '../../../../company-manage/company-manage.service';
import { SpaceManageService } from '../../../space-manage.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { RoleModalComponent } from '../../role-manage/components/role-modal.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './user-modal.html'
})

export class UserModalComponent implements OnInit {

  userName;
  userNo;
  admin={};

  roles = [];
  reportList = [];

  constructor(
    private companyService: CompanyManageService,
    private spaceService: SpaceManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef,) { }


  ngOnInit() { }

  updateChecked(user) {
    user.checked = !user.checked;
  }

  // 添加空间用户
  createUser() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      SpaceRole: {
        user_name: this.userName,
        status: 'T',
        space_id: spaceID,
        roleList: this.roles,
        reportList: this.reportList,
      },
    };
    this.spaceService.addUser(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('添加空间用户成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('添加空间用户失败！');
      }
    });
  }









  // 修改更新角色
  editUser() {
    // TODO 获取选择的报表

    let spaceID = localStorage.getItem('spaceID');
    this.roles.forEach(user => {
      user.user_id = user.userId;
    });
    let params = {
      SpaceRole: {
        status: 'T',
        space_id: spaceID,
        roleList: this.roles,
        reportList: this.reportList,
      },
    };
    this.spaceService.editUser(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('修改用户成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('修改用户失败！');
      }
    });
  }
}
