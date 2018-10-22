import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';
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
      isLeaf: true,
    },
    {
      text: '公司管理',
      isLeaf: true,
      link: `/app/system/companis-manage`,
      icon: 'anticon anticon-folder',
    },
  ];

  constructor(
    private menuService: MenuService,
    private sideMenu: SideMenuService,
  ) {
  }

  ngOnInit() {
    this.menuService.add([
      {
        text: '平台管理中心',
        group: true,
        children: [
          {
            text: '公司管理',
            link: '/app/system/companis-manage',
            icon: 'anticon anticon-team',
          },
        ],
      },
    ]);
    this.sideMenu.setMenu(this.menu);

  }
}
