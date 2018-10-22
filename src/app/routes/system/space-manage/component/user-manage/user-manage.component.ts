import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UserModalComponent } from './components/user-modal.component';
import { SpaceManageService } from '../../space-manage.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.html',
  styles: [
      `
      .title-tab {
        height: 32px;
        line-height: 32px;
        font-size: x-large;
      }

      .title-tab + div {
        float: right;
        padding-right: 16px;
      }

      .card-content {
        width: 300px;
        background-color: #fff;
        box-sizing: border-box;
        border: solid 1px #e8e8e8;
      }

      .card-content:hover {
        box-shadow: 0 0 8px 3px #e8e8e8;
        width: 300px;
        box-sizing: border-box;
        border-color: #ace4f5;
        background: #d9f3fb;
        color: #117391;
      }

      .card-tabs {
        padding: 8px;
        border-top: solid 1px #e8e8e8;
        border-bottom: solid 1px #e8e8e8;
        background-color: #fff;
      }

      .card-handle {
        padding: 8px;
        background-color: #ececec;
      }

      .card-handle div {
        text-align: center;
        font-size: larger;
      }
      .card-item-checked {
        border-color: #ace4f5;
        background: #d9f3fb;
        color: #117391;
      }
    `,
  ],
})
export class UserManageComponent implements OnInit {

  key = '';
  userList = [];
  disabledButton = true;

  constructor(
    private nzModal: NzModalService,
    private message: NzMessageService,
    private service: SpaceManageService,
  ) {
  }

  ngOnInit() {
    this.getUserList();
  }


  // 添加角色
  addUser() {
    const modal = this.nzModal.create({
      nzTitle: '新增用户',
      nzContent: UserModalComponent,
      nzWidth: '50%',
      nzOnOk: ref => {
        return new Promise(res => {
          ref.createUser();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      this.getUserList();
    });
  }

  // 查询空间用户列表
  getUserList() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      pageSize: 100,
      curPage: 0,
      totalPage: 0,
      totalRow: 0,
      SpaceUser: {
        space_id: spaceID,
        user_name: this.key,
      },
    };
    this.service.getUserList(params).subscribe(res => {
      this.userList = res['retList'];
      this.userList.forEach(user => {
        user.roleList.forEach(role => {
          role.color = '#87d068';
        });
      });
    });
  }

  updateChecked(role) {
    role.checked = !role.checked;
    this.disabledButton = true;
    this.userList.forEach(user => {
      if (user.checked) {
        this.disabledButton = false;
      }
    });
  }

  // 删除角色
  delUser(role) {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      SpaceRole: {
        user_id: role.role_id,
        space_id: spaceID,
      },
    };
    this.service.delRole(params).subscribe(res => {
        if (res['retCode'] === '00000') {
          this.message.success('删除角色成功！');
        } else {
          this.message.error('删除角色失败！');
        }
      });
  }

  // TODO 批量删除
  delAll() {

  }

  checkedAll = '全选';
  checkAll(checkedAll) {
    if (checkedAll === '全选') {
      this.userList.forEach(role => role.checked = true);
      this.disabledButton = false;
      this.checkedAll = '取消全选';
    } else {
      this.userList.forEach(role => role.checked = false);
      this.disabledButton = true;
      this.checkedAll = '全选';
    }
  }


  // 编辑修改用户
  editUser(user) {
    // TODO 查询角色对应的报表列表
    let params = {};
    let reports = [];
    this.service.qryRoleUser(params).subscribe(res => {

    });
    const modal = this.nzModal.create({
      nzTitle: '编辑用户',
      nzContent: UserModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        userName: user.user_name,
        userNo: user.user_no,
        roles: user.roleList,
        reportList: [],
      },
      nzOnOk: ref => {
        return new Promise(res => {
          ref.editUser();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      this.getUserList();
    });
  }



}
