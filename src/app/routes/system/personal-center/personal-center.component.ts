import { Component, OnInit } from '@angular/core';
import { MenuService } from '@delon/theme';
import { SideMenuService } from '@shared/side-menu.service';
import { HttpResponse } from '@angular/common/http';
import { Page } from '../../../models/page';
import { PersonalCenterService } from './personal-center.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.html',
  providers: [PersonalCenterService],
})
export class PersonalCenterComponent implements OnInit {
  page = new Page();

  menu: Array<any> = [
    {
      text: '大屏',
      isGroup: true,
      children: [
        {
          text: '我的数据大屏',
          isLeaf: false,
          icon: 'folder',
          children: [],
        },
      ],
    },
    {
      text: '报表',
      isGroup: true,
      children: [],
    },
    {
      text: '管理中心',
      isGroup: true,
      children: [
        {
          text: '大屏收藏管理',
          isLeaf: true,
          icon: 'area-chart',
          link: '/app/user/user-screen',
        },
        {
          text: '报表收藏管理',
          link: '/app/user/user-report',
          isLeaf: true,
          icon: 'appstore-o',
        },
        {
          text: '个人信息管理',
          isLeaf: true,
          icon: 'user',
          link: '/app/user/user-message',
        },
      ],
    },
  ];


  constructor(
    private _menuService: MenuService,
    private _sideMenu: SideMenuService,
    private _personalService: PersonalCenterService,
    private _nzMessage: NzMessageService,
    private _Router: Router,
  ) {
  }

  ngOnInit() {

    // this._menuService.add(this.menu);
    this.getScreenList();
    this.getReportTree();
    this._sideMenu.setMessage(this.menu);
    this._sideMenu.setMenu(this.menu);
    this._Router.navigateByUrl('app/user/user-screen');
  }

  getScreenList(reset = false) {
    if (reset) {
      this.page.curPage = 1;
    }
    const params = {
      curPage: this.page.curPage,
      pageSize: 5000,
      totalPage: this.page.totalPage || '',
      totalRow: this.page.totalRow || '',
    };
    this._personalService.qryScreenList(params).subscribe(
      data => {
        let dataSet = data['retList'];
        dataSet.forEach(value => {
          const item = {
            text: value.keepDashBoardName,
            link: `/app/user/dashboard-detail;dashBoardId=${value.dashBoardId};keepDashBoardId=${value.keepDashBoardId}`,
            isLeaf: true,
            icon: value.icon,
          };
          this.menu[0]['children'][0]['children'].push(item);
        });
      },
      error => {
        if (error instanceof HttpResponse) {
          this._nzMessage.error(error.body.retMsg);
        }
      },
    );
  }

  // 获取侧边栏报表树
  getReportTree() {
    this._personalService.qrySelfReportListTree({ parentId: '/' }).subscribe(data => {
        this.formatTree(this.menu[1]['children'], data['retTreeList']);

      },
      err => {
        if (err instanceof HttpResponse) {
          this._nzMessage.error(err.body.retMsg);
        }
      },
    );
  }

  // 遍历侧边栏报表树
  formatTree(list, array: Array<any>) {
    array.forEach(value => {
      let node = {
        text: value.keepReportName,
        link: `/app/user/report-detail;reportId=${value.reportId};keepReportId=${value.keepReportId}`,
        isLeaf: value.keepReportType == 1,
        icon: value.keepReportType == 1 ? 'file' : 'folder',
        children: [],
      };
      list.push(node);
      if (value.children) {
        this.formatTree(node.children, value.children);
      }
    });
  }
}
