import { Component, OnInit } from '@angular/core';
import { SideMenuService } from '@shared/side-menu.service';
import { Menu } from 'app/models/menu';

@Component({
  selector: 'app-company-manage',
  templateUrl: './company-manage.html',
})
export class CompanyManageComponent implements OnInit {
  menu: Array<Menu> = [
    {
      text: '公司管理中心',
      isGroup: true,
      children: [
        {
          text: '公司设置',
          link: '/app/company/company-setting',
          icon: 'team',
          isLeaf: true,
        },
        {
          text: '空间设置',
          icon: 'home',
          link: '/app/company/space-setting',
          isLeaf: true,
        },
        {
          text: '用户管理',
          icon: 'user',
          link: '/app/company/user-setting',
          isLeaf: true,
        },
      ],
    },
  ];
  constructor(
    private sideMenu: SideMenuService,
  ) {}

  ngOnInit() {
    this.sideMenu.setMenu(this.menu);
    this.sideMenu.setMessage(this.menu);
  }
}
