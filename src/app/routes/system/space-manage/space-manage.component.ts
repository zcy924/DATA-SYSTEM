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
  // menu: Array<Menu> = [
  //   {
  //     text: '大屏管理',
  //     group: true,
  //     children: [
  //       {
  //         text: '数据大屏',
  //         group: true,
  //         icon: 'anticon anticon-folder',
  //         children: [], // 数据大屏列表
  //       },
  //     ],
  //   },
  //   {
  //     text: '报表',
  //     group: true,
  //     icon: 'anticon anticon-table',
  //     children: [
  //       // 报表列表
  //       {
  //         reportId: '123',
  //         text: '报表一',
  //         icon: 'anticon anticon-table',
  //       },
  //       {
  //         reportId: '456',
  //         text: '报表二',
  //         icon: 'anticon anticon-folder',
  //         children: [
  //           {
  //             reportId: '123',
  //             text: '报表一',
  //             icon: 'anticon anticon-table',
  //           },
  //           {
  //             reportId: '123',
  //             text: '报表一',
  //             icon: 'anticon anticon-folder',
  //             children: [
  //               {
  //                 reportId: '123',
  //                 text: '报表一',
  //                 icon: 'anticon anticon-table',
  //               },
  //               {
  //                 reportId: '123',
  //                 text: '报表一',
  //                 icon: 'anticon anticon-folder',
  //                 children: [
  //                   {
  //                     text: '报表三',
  //                     icon: 'anticon anticon-table'
  //                   }
  //                 ]
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     text: '管理中心',
  //     group: true,
  //     children: [
  //       {
  //         text: '报表管理',
  //         link: 'report-manage',
  //         icon: 'anticon anticon-appstore-o',
  //       },
  // {
  //   text: '大屏管理',
  //   icon: 'anticon anticon-area-chart',
  //   link: 'screen-manage',
  // },
  // {
  //   text: '角色管理',
  //   icon: 'anticon anticon-user',
  //   link: 'role-manage',
  // },
  // {
  //   text: '用户管理',
  //   icon: 'anticon anticon-user',
  //   link: 'user-manage',
  // },
  // {
  //   text: '数据源管理',
  //   icon: 'anticon anticon-user',
  //   link: 'user-message',
  // },
  // {
  //   text: '数据表预览',
  //   icon: 'anticon anticon-user',
  //   link: 'user-message',
  // },
  // {
  //   text: 'SQL模型管理',
  //   icon: 'anticon anticon-user',
  //   link: 'user-message',
  // },
  // {
  //   text: '数据值映射管理',
  //   icon: 'anticon anticon-user',
  //   link: 'user-message',
  // },
  // {
  //   text: '空间设置',
  //   icon: 'anticon anticon-user',
  //   link: 'user-message',
  // },
  //     ],
  //   },
  // ];

  menu: Array<Menu> = [
    {
      text: '主导航',
      isGroup: true,
      isLeaf: true,
    },
    {
      text: '数据大屏',
      isLeaf: false,
      icon: 'anticon anticon-folder',
      children: [
        // {
        //   text: '紫金大屏1',
        //   isLeaf: true,
        //   icon: 'anticon anticon-area-chart',
        // },
        // {
        //   text: '紫金大屏2',
        //   isLeaf: true,
        //   icon: 'anticon anticon-area-chart',
        // },
        // {
        //   text: '紫金大屏3',
        //   isLeaf: true,
        //   icon: 'anticon anticon-area-chart',
        // },
        // {
        //   text: '紫金大屏4',
        //   isLeaf: true,
        //   icon: 'anticon anticon-area-chart',
        // },
      ],
    },

    {
      text: '报表',
      isLeaf: true,
      isGroup: true,
    },
    {
      text: '二级文件',
      isLeaf: true,
      icon: 'anticon anticon-file',
    },
    {
      text: '二级目录',
      isLeaf: false,
      icon: 'anticon anticon-folder',
      children: [
        {
          text: '三级文件',
          isLeaf: true,
          icon: 'anticon anticon-file',
        },
        {
          text: '三级目录',
          isLeaf: false,
          icon: 'anticon anticon-folder',
          children: [
            {
              text: '四级文件',
              isLeaf: true,
              icon: 'anticon anticon-file',
            },
            {
              text: '四级目录',
              isLeaf: false,
              icon: 'anticon anticon-folder',
              children: [
                {
                  text: '五级文件',
                  isLeaf: true,
                  icon: 'anticon anticon-file',
                },
                {
                  text: '五级目录',
                  isLeaf: false,
                  icon: 'anticon anticon-folder',
                  children: [
                    {
                      text: '六级文件',
                      isLeaf: true,
                      icon: 'anticon anticon-file',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      text: '管理中心',
      isLeaf: true,
      isGroup: true,
    },
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
      icon: 'anticon anticon-user',
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
      icon: 'anticon anticon-user',
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
      icon: 'anticon anticon-user',
      link: 'user-message',
    },
    {
      text: '数据值映射管理',
      isLeaf: true,
      icon: 'anticon anticon-user',
      link: 'user-message',
    },
    {
      text: '空间设置',
      isLeaf: true,
      icon: 'anticon anticon-user',
      link: 'user-message',
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
    private spaceManageService: SpaceManageService,
    private sideMenu: SideMenuService,
  ) {}

  ngOnInit() {
    this.getReportList();
    this.url = this.acRouter.snapshot.params['spaceId'];
    localStorage.setItem('spaceID', this.url.toString());

    this.spaceContent.screenList.forEach(value => {
      const item = {
        text: value.screenName,
        isLeaf: true,
        link: `/app/square/${this.url}/screen`,
        icon: 'anticon anticon-area-chart',
      };
      console.log(item.link);
      this.menu[1]['children'].push(item);
    });
    // this.spaceContent.reportList.forEach(value => {
    //   const item1 = {
    //     text: value.reportName,
    //     link: `/app/square/${this.url}/report-detail/${value.reportId}`,
    //     icon: 'anticon anticon-table',
    //   };
    //   this.menu[1]['children'].push(item1);
    // });
    // this.menu[2]['children'].map(value => {
    //   value.link = `/app/square/${this.url}/${value.link}`;
    // });
    // this.menuService.add(this.menu);
    this.sideMenu.setMenu({ menu: this.menu });
  }
  getReportList() {
    this.spaceManageService.getReportList({}).subscribe(data => {
      console.log(data);
    });
  }
}
