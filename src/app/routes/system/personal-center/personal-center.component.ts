import { Component, OnInit } from '@angular/core';
import { MenuService, Menu } from '@delon/theme';
// import { Menu } from 'app/models/menu';
import { SideMenuService } from '@shared/side-menu.service';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.html',
})
export class PersonalCenterComponent implements OnInit {
  menu: Array<Menu> = [
    {
      text: '个人中心',
      group: true,
      children: [
        {
          text: '报表收藏管理',
          link: '/app/user/user-report',
          isLeaf: true,
          icon: 'anticon anticon-appstore-o',
        },
        {
          text: '大屏收藏管理',
          isLeaf: true,
          icon: 'anticon anticon-area-chart',
          link: '/app/user/user-screen',
        },
        {
          text: '个人信息管理',
          isLeaf: true,
          icon: 'anticon anticon-user',
          link: '/app/user/user-message',
        },
      ],
    },
  ];


  constructor(
    private menuService: MenuService,
    private sideMenu: SideMenuService,
  ) {}

  ngOnInit() {
    this.menuService.add(this.menu);
  }
}
