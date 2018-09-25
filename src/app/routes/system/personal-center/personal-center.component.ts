import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.html',
})
export class PersonalCenterComponent implements OnInit {
  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.add([
      {
        text: '管理中心',
        group: true,
        children: [
          {
            text: '报表收藏管理',
            link: '/luohaha',
            icon: 'anticon anticon-appstore-o',
          },
          {
            text: '大屏收藏管理',
            icon: 'anticon anticon-area-chart',
            shortcutRoot: false,
          },
          {
            text: '个人信息管理',
            icon: 'anticon anticon-user',
            shortcutRoot: false,
          },
        ],
      },
    ]);
  }
}
