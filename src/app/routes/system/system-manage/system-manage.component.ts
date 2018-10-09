import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';

@Component({
  selector: 'app-system-manage',
  templateUrl: './system-manage.html',
})
export class SystemManageComponent implements OnInit {
  constructor(private menuService: MenuService) {}

  ngOnInit() {

    this.menuService.add([
      {
        text: '公司管理中心',
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
  }
}
