import {Component, AfterViewInit} from '@angular/core';
import {MenuService} from '@delon/theme';
import {ActivatedRoute} from '@angular/router';
import {SpaceManageService} from './space-manage.service';
import {SideMenuService} from '@shared/side-menu.service';
import {Menu} from 'app/models/menu';
import {Page} from 'app/models/page';
import {HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  template: `<router-outlet></router-outlet>`,
  providers: [SpaceManageService],
})
export class SpaceManageComponent implements AfterViewInit {
  url: String;
  page = new Page();
  reportTree: any;
  menu: Array<Menu>;
  spaceId:string;

  constructor(
    private menuService: MenuService,
    private acRouter: ActivatedRoute,
    private spaceManageService: SpaceManageService,
    private sideMenu: SideMenuService,
    private message: NzMessageService,
    private router: ActivatedRoute
  ) {
    this.router.params.subscribe(data=>{
      this.spaceId = data.spaceId;
      this.menu =  [
        {
          text: '大屏',
          isGroup: true,
          children: [
            {
              text: '数据大屏',
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
          isLeaf: false,
          isGroup: true,
          children: [
            {
              text: '报表管理',
              link: `app/square/${this.spaceId}/report-manage`,
              isLeaf: true,
              icon: 'appstore-o',
            },
            {
              text: '大屏管理',
              isLeaf: true,
              icon: 'area-chart',
              link: `app/square/${this.spaceId}/screen-manage`,
            },
            {
              text: '角色管理',
              isLeaf: true,
              icon: 'usergroup-add',
              link: `app/square/${this.spaceId}/role-manage`,
            },
            {
              isLeaf: true,
              text: '用户管理',
              icon: 'user',
              link: `app/square/${this.spaceId}/user-manage`,
            },
            {
              text: 'API管理',
              isLeaf: true,
              icon: 'database',
              link: `app/square/${this.spaceId}/api-manage`,
            },
            {
              text: '空间设置',
              isLeaf: true,
              icon: 'setting',
              link: `app/square/${this.spaceId}/space-setting`,
            },
          ],
        },
      ];
    })
  }


  ngOnInit() {

  }
  ngAfterViewInit(){
    this.getReportTree();
    this.getScreenList();
    const spaceType = localStorage.getItem('spaceType');
    if (spaceType !== 'admin') {
      this.menu.splice(2, 1);
    }
    this.sideMenu.setMenu(this.menu);
    this.sideMenu.setMessage(this.menu);
  }

  getScreenList(reset = false) {
    if (reset) {
      this.page.curPage = 1;
    }
    const params = {
      spaceId: this.spaceId,
      curPage: this.page.curPage,
      pageSize: 1000,
      totalPage: this.page.totalPage || '',
      totalRow: this.page.totalRow || '',
    };
    this.spaceManageService.getScreenList(params).subscribe(
      data => {
        const dataSet = data['retList'];
        dataSet.map(value => {
          value.text = value.name;
          value.link = `app/square/${this.spaceId}/screen-detail/${
            value.dashboardId
            }`;
          value.isLeaf = true;
          value.icon = value.icon;
        });
        this.menu[0]['children'][0]['children'] = dataSet;
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }

  getReportTree() {
    const params = {
      Report: {
        spaceId: this.spaceId,
      },
    };
    this.spaceManageService.qryReportTree(params).subscribe(
      data => {
        const report_menu = data.retTreeList;
        this.formateTree(report_menu);
        this.menu[1]['children'] = report_menu;
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }

  formateTree(array: Array<any>) {
    array.map(value => {
      value.text = value.reportName;
      value.link = `app/square/${this.spaceId}/report-detail/${
        value.reportId
        }`;
      value.isLeaf = value.type == 1 ? true : false;
      value.icon = value.type == 1 ? 'file' : 'folder';
      if (value.children) {
        this.formateTree(value.children);
      }
    });
  }
}
