import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../models/menu';
import { SideMenuService } from '@shared/side-menu.service';

@Component({
  selector: 'app-system-manage',
  templateUrl: './platform-manage.html',
})
export class PlatformManageComponent implements OnInit {
  menu: Array<Menu> = [
    {
      text: '平台管理中心',
      isGroup: true,
      isLeaf: false,
      children:[
        {
          text: '公司管理',
          isLeaf: true,
          link: `/app/platform/companis-manage`,
          icon: 'anticon anticon-setting',
        },
      ]
    },
  ];

  constructor(
    private sideMenu: SideMenuService,
  ) {
  }

  ngOnInit() {
    this.sideMenu.setMenu(this.menu);
    this.sideMenu.setMessage(this.menu);
  }
}
