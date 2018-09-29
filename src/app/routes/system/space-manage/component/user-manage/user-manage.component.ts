import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddUserComponent } from './components/add-user.component';

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
        background-color: #fff;
        box-sizing: border-box;
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
    `,
  ],
})
export class UserManageComponent implements OnInit {
  arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  constructor(private nzModal: NzModalService) {}
  ngOnInit() {}
  addUser() {
    this.nzModal.create({
      nzTitle: '新增用户',
      nzContent: AddUserComponent,
      nzWidth: '50%',
      nzStyle: {
        top: '10%',
      },
    });
  }
}
