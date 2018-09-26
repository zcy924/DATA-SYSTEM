import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './space-manage.html',
})
export class SpaceManageComponent implements OnInit {
  menu: any = [
    {
      text: '大屏管理',
      group: true,
      children: [
        {
          text: '数据大屏',
          group: true,
          icon: 'anticon anticon-folder',
          children: [], // 数据大屏列表
        },
      ],
    },
    {
      text: '报表',
      group: true,
      icon: 'anticon anticon-table',
      children: [
        // {
        //   text: '角色管理',
        //   icon: 'anticon anticon-user',
        //   link: '/app/user/user-message',
        // },
        // {
        //   text: '报表文件夹',
        //   group: true,
        //   icon: 'anticon anticon-folder',
        //   children: [
        //     {
        //       text: '角色管理',
        //       icon: 'anticon anticon-user',
        //       link: '/app/user/user-message',
        //     },
        //     {
        //       text: '角色管理',
        //       icon: 'anticon anticon-user',
        //       link: '/app/user/user-message',
        //     },
        //   ], // 数据大屏列表
        // },
      ], // 报表列表
    },
    {
      text: '管理中心',
      group: true,
      children: [
        {
          text: '报表管理',
          link: './report-manage',
          icon: 'anticon anticon-appstore-o',
        },
        {
          text: '大屏管理',
          icon: 'anticon anticon-area-chart',
          link: './screen-manage',
        },
        {
          text: '角色管理',
          icon: 'anticon anticon-user',
          link: './role-manage',
        },
        {
          text: '用户管理',
          icon: 'anticon anticon-user',
          link: './user-manage',
        },
        {
          text: '数据源管理',
          icon: 'anticon anticon-user',
          link: '/app/user/user-message',
        },
        {
          text: '数据表预览',
          icon: 'anticon anticon-user',
          link: '/app/user/user-message',
        },
        {
          text: 'SQL模型管理',
          icon: 'anticon anticon-user',
          link: '/app/user/user-message',
        },
        {
          text: '数据值映射管理',
          icon: 'anticon anticon-user',
          link: '/app/user/user-message',
        },
        {
          text: '空间设置',
          icon: 'anticon anticon-user',
          link: '/app/user/user-message',
        },
      ],
    },
  ];
  spaceContent = {
    screenList: [
      {
        screenId: '123',
        screenName: '紫金大屏一',
        icon: 'anticon anticon-area-chart',
      },
      {
        screenId: '456',
        screenName: '紫金大屏二',
        icon: 'anticon anticon-area-chart',
      },
      {
        screenId: '789',
        screenName: '紫金大屏三',
        icon: 'anticon anticon-area-chart',
      },
      {
        screenId: '101112',
        screenName: '紫金大屏四',
        icon: 'anticon anticon-area-chart',
      },
    ],
    reportList: [
      {
        reportId: '123',
        reportName: '报表一',
        icon: 'anticon anticon-table',
      },
      {
        reportId: '456',
        reportName: '报表二',
        icon: 'anticon anticon-table',
      },
      {
        reportId: '789',
        reportName: '报表三',
        icon: 'anticon anticon-table',
      },
    ],
  };
  space = {
    spaceName: 'zangsan',
    spaceId: '123',
  };
  constructor(
    private menuService: MenuService,
    private acRouter: ActivatedRoute,
  ) {}

  ngOnInit() {
    const spaceId = this.acRouter.snapshot.params['spaceId'];
    console.log(spaceId);
    this.spaceContent.screenList.forEach(value => {
      const item = {
        text: value.screenName,
        link: './screen-detail',
        icon: 'anticon anticon-area-chart',
      };
      this.menu[0]['children'][0]['children'].push(item);
    });
    this.spaceContent.reportList.forEach(value => {
      const item1 = {
        text: value.reportName,
        link: './report-detail/' + value.reportId,
        icon: 'anticon anticon-table',
      };
      this.menu[1]['children'].push(item1);
    });
    this.menuService.add(this.menu);
  }
}
