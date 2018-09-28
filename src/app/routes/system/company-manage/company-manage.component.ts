import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';

@Component({
  selector: 'app-company-manage',
  templateUrl: './company-manage.html',
})
export class CompanyManageComponent implements OnInit {
  constructor(private menuService: MenuService) {}

  ngOnInit() {

    this.menuService.add([
      {
        text: '公司管理中心',
        group: true,
        children: [
          {
            text: '公司设置',
            link: '/app/company/company-setting',
            icon: 'anticon anticon-team',
          },
          {
            text: '空间设置',
            icon: 'anticon anticon-home',
            link: '/app/company/space-setting',
          },
          {
            text: '用户管理',
            icon: 'anticon anticon-user',
            link: '/app/company/user-setting',
          },
        ],
      },
    ]);
  }
}
