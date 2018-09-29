import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddRoleComponent } from './components/add-role.component';

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
        background-color: #fff;
        box-sizing: border-box;
      }
      .card-handle {
        padding: 8px;
        background-color: #ececec;
      }
      .card-handle div {
        text-align: center;
        font-size: larger;
      }
    `
  ]
})
export class RoleManageComponent implements OnInit {
  constructor(private nzModal: NzModalService) {}

  ngOnInit() {}
  addRole() {
    this.nzModal.create({
      nzTitle: '新建角色',
      nzContent: AddRoleComponent,
      nzWidth: '50%',
      nzStyle: {
        top: '10%'
      }
    });
  }
}
