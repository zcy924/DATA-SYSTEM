import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { SpaceManageService } from './space-manage.service';
import { SideMenuService } from '@shared/side-menu.service';
import { Menu } from 'app/models/menu';

@Component({
  templateUrl: './space-manage.html',
  providers: [SpaceManageService],
})
export class SpaceManageComponent implements OnInit {
  url: String;
  reportTree: any;
  menu: Array<Menu> = [
    {
      text: '主导航',
      isGroup: true,
      children: [
        {
          text: '数据大屏',
          isLeaf: false,
          icon: 'anticon anticon-folder',
          children: [
            {
              text: '紫金大屏',
              link: `app/square/${localStorage.getItem(
                'spaceID',
              )}/report-manage`,
              isLeaf: true,
              icon: 'anticon anticon-appstore-o',
            },
            {
              text: '紫金大屏二',
              isLeaf: true,
              icon: 'anticon anticon-area-chart',
              link: `app/square/${localStorage.getItem(
                'spaceID',
              )}/screen-manage`,
            },
          ],
        },
      ],
    },

    {
      text: '报表',
      isGroup: true,
      children: [
      ],
    },

    {
      text: '管理中心',
      isLeaf: false,
      isGroup: true,
      children: [
        {
          text: '报表管理',
          link: `app/square/${localStorage.getItem('spaceID')}/report-manage`,
          isLeaf: true,
          icon: 'anticon anticon-appstore-o',
        },
        {
          text: '大屏管理',
          isLeaf: true,
          icon: 'anticon anticon-area-chart',
          link: `app/square/${localStorage.getItem('spaceID')}/screen-manage`,
        },
        {
          text: '角色管理',
          isLeaf: true,
          icon: 'anticon anticon-usergroup-add',
          link: `app/square/${localStorage.getItem('spaceID')}/role-manage`,
        },
        {
          isLeaf: true,
          text: '用户管理',
          icon: 'anticon anticon-user',
          link: `app/square/${localStorage.getItem('spaceID')}/user-manage`,
        },
        {
          text: '数据源管理',
          isLeaf: true,
          icon: 'anticon anticon-database',
          link: 'user-message',
        },
        {
          text: '数据表预览',
          isLeaf: true,
          icon: 'anticon anticon-user',
          link: 'user-message',
        },
        {
          text: 'SQL模型管理',
          isLeaf: true,
          icon: 'anticon anticon-api',
          link: 'user-message',
        },
        {
          text: '数据值映射管理',
          isLeaf: true,
          icon: 'anticon anticon-book',
          link: 'user-message',
        },
        {
          text: '空间设置',
          isLeaf: true,
          icon: 'anticon anticon-setting',
          link: 'user-message',
        },
      ],
    },
  ];

  space = {
    spaceName: 'zangsan',
    spaceId: '123',
  };
  constructor(
    private menuService: MenuService,
    private acRouter: ActivatedRoute,
    private spaceManageService: SpaceManageService,
    private sideMenu: SideMenuService,
  ) {}

  ngOnInit() {
    this.getReportList();
    this.getReportTree();
    this.url = this.acRouter.snapshot.params['spaceId'];

    console.log(this.menu);

    this.sideMenu.setMenu(this.menu);
  }
  getReportList() {
    this.spaceManageService.getReportList({}).subscribe(data => {
      console.log(data);
    });
  }
  getReportTree() {
    const params = {
      Report: {
        spaceId: localStorage.getItem('spaceID'),
      },
    };
    this.spaceManageService.qryAllReportList(params).subscribe(data => {
      const report_menu = data.retTreeList;
      this.formateTree(report_menu);
      this.menu[1]['children'] = report_menu;
    });
  }
  formateTree(array: Array<any>) {
    array.map(value => {
      value.text = value.reportName;
      value.link = `square/${value.spaceId}/report-detail/${value.reportId}`;
      value.isLeaf = value.type == 1 ? true : false;
      value.icon =
        value.type == 1 ? 'anticon anticon-file' : 'anticon anticon-folder';
      if (value.children) {
        this.formateTree(value.children);
      }
    });
  }
}
