import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SpaceManageService } from '../../space-manage.service';
import { AddUserModalComponent } from './components/add-user-modal.component';
import { EditUserModalComponent } from './components/edit-user-modal.component';
import { SettingsService } from '@delon/theme';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  selectedArray = [];
  spaceId: string;

  constructor(
    private nzModal: NzModalService,
    private message: NzMessageService,
    private service: SpaceManageService,
    private settingsService: SettingsService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.spaceId = this.router.snapshot.parent.params.spaceId;
    this.getUserList();
  }

  // 添加用户
  addUser() {
    const modal = this.nzModal.create({
      nzTitle: '新增用户',
      nzContent: AddUserModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        usersOfSpace: this.userList,
        spaceId: this.spaceId
      },
      nzOnOk: ref => {
        return new Promise(res => {
          ref.createUser();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      if (res == 'ok') {
        this.getUserList();
      }
    });
  }

  // 查询空间用户列表
  getUserList() {
    let params = {
      pageSize: 5000,
      curPage: 0,
      totalPage: 0,
      totalRow: 0,
      SpaceUser: {
        spaceId: this.spaceId,
        userName: this.key,
      },
    };
    this.service.getUserListWithRoles(params).subscribe(
      res => {
        this.userList = res['retList'];
        this.userList.forEach(user => {
          user.roleList.forEach(role => {
            role.color = '#87d068';
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

  updateChecked(role) {
    role.checked = !role.checked;
    this.disabledButton = true;
    this.userList.forEach(user => {
      if (user.checked) {
        this.disabledButton = false;
      }
    });
    this.selectedArray = this.userList.filter(value => value.checked);
  }

  // 删除一个角色
  delUser(user) {
    let title = '该用户';
    this.delAll([{ userId: user.userId }], title);
  }

  // 批量删除
  delAll(list, title = '所选择的用户') {
    let id = this.settingsService.user.account;
    console.log(id);
    console.log(list);
    list = list.filter(data => data.userId !== id);
    let params = {
      SpaceUser: {
        spaceId: this.spaceId,
        userList: list,
      },
    };
    this.nzModal.confirm({
      nzTitle: '是否将' + title + '移出？',
      nzOnOk: () => {
        this.service.delUser(params).subscribe(
          res => {
            if (res['retCode'] === '00000') {
              this.message.success('移出' + title + '成功！');
              this.getUserList();
            } else {
              this.message.error('移出' + title + '失败！');
            }
          },
          err => {
            if (err instanceof HttpResponse) {
              this.message.error(err.body.retMsg);
            }
          },
        );
      },
    });
  }

  checkedAll = '全选';

  checkAll(checkedAll) {
    if (checkedAll === '全选') {
      this.userList.forEach(role => (role.checked = true));
      this.disabledButton = false;
      this.checkedAll = '取消全选';
    } else {
      this.userList.forEach(role => (role.checked = false));
      this.disabledButton = true;
      this.checkedAll = '全选';
    }
    this.selectedArray = this.userList.filter(value => value.checked);
  }

  // 编辑修改用户
  editUser(user) {
    const modal = this.nzModal.create({
      nzTitle: '编辑用户',
      nzContent: EditUserModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        user: user,
        adminChecked: user.isSpaceAdmin === 'T',
        spaceId: this.spaceId
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
