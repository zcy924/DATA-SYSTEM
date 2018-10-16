import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-role',
  templateUrl: './role-modal.html',
  styles: [``],
})

export class RoleModalComponent implements OnInit {

  companyName;
  userNo;
  admins = [
    {
      'userNo': '',
      'userName': '张三',
    },
    {
      'userNo': '',
      'userName': '李四',
    },
    {
      'userNo': '',
      'userName': '王五',
    },
  ];


  constructor() {
  }

  ngOnInit() {
  }

  updateChecked(user) {
    user.checked = !user.checked;
  }
}
