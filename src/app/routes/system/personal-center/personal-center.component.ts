import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';
import { SideMenuService } from '@shared/side-menu.service';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.html',
})
export class PersonalCenterComponent implements OnInit {

  menu: Array<any>=[
    {
      text: '个人中心',
      isGroup: true,
      children: [
        {
          text: '报表收藏管理',
          link: '/app/user/user-report',
          isLeaf: true,
          icon: 'appstore-o',
        },
        {
          text: '大屏收藏管理',
          isLeaf: true,
          icon: 'area-chart',
          link: '/app/user/user-screen',
        },
        {
          text: '个人信息管理',
          isLeaf: true,
          icon: 'user',
          link: '/app/user/user-message',
        },
      ]
    },
  ]


  constructor(
    private menuService: MenuService,
    private sideMenu: SideMenuService,
  ) {}

  ngOnInit() {
    this.sideMenu.setMessage(this.menu);
    this.sideMenu.setMenu(this.menu);
    // this.menuService.add(this.menu);
  }
}
