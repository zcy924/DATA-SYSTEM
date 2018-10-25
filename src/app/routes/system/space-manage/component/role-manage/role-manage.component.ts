import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { RoleModalComponent } from './components/role-modal.component';
import { SpaceManageService } from '../../space-manage.service';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.html',
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
export class RoleManageComponent implements OnInit {

  roleList = [];
  disabledButton = true;
  checkedAll = '全选';

  constructor(
    private nzModal: NzModalService,
    private message: NzMessageService,
    private service: SpaceManageService,
  ) {
  }

  ngOnInit() {
    this.getRoleList();
  }

  // 添加角色
  addRole() {
    const modal = this.nzModal.create({
      nzTitle: '新建角色',
      nzContent: RoleModalComponent,
      nzWidth: '50%',
      nzOnOk: ref => {
        return new Promise(res => {
          ref.createRole();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      this.getRoleList();
    });
  }

  // 角色列表查询
  getRoleList() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      pageSize: 100,
      curPage: 0,
      totalPage: 0,
      totalRow: 0,
      SpaceRole: {
        spaceId: spaceID,
      },
    };
    this.service.getRoleList(params).subscribe(res => {
      this.roleList = res['retList'];
      this.roleList.forEach(role => {
        if (role.remark === null || role.remark === '') {
          role.remark = '暂无说明';
        }
      });
    });
  }

  updateChecked(role) {
    role.checked = !role.checked;
    this.disabledButton = true;
    this.roleList.forEach(role => {
      if (role.checked) {
        this.disabledButton = false;
      }
    });
  }

  // 删除角色
  delRole(role) {
    let params = {
      SpaceRole: {
        role_id: role.role_id,
      },
    };
    this.nzModal.confirm({
      nzTitle: '确认删除当前角色？',
      nzOnOk: () => {
        this.service.delRole(params).subscribe(res => {
          if (res['retCode'] === '00000') {
            this.message.success('删除角色成功！');
            this.getRoleList();
          } else {
            this.message.error('删除角色失败！');
          }
        });
      },
    });
  }

  // TODO 批量删除
  delAll() {
  }

  checkAll(checkedAll) {
    if (checkedAll === '全选') {
      this.roleList.forEach(role => role.checked = true);
      this.disabledButton = false;
      this.checkedAll = '取消全选';
    } else {
      this.roleList.forEach(role => role.checked = false);
      this.disabledButton = true;
      this.checkedAll = '全选';
    }
  }

  // 编辑修改角色
  editRole(role) {
    const modal = this.nzModal.create({
      nzTitle: '编辑角色',
      nzContent: RoleModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        roleName: role.role_name,
        remark: role.remark,
        roleId: role.role_id,
      },
      nzOnOk: ref => {
        return new Promise(res => {
          ref.editRole();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      this.getRoleList();
    });
  }
}
