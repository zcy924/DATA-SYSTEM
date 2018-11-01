import {Component, OnInit} from '@angular/core';
import {MenuService} from '@delon/theme';
import {SideMenuService} from '@shared/side-menu.service';
import {HttpResponse} from "@angular/common/http";
import {Page} from "../../../models/page";
import {PersonalCenterService} from "./personal-center.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.html',
  providers: [PersonalCenterService]
})
export class PersonalCenterComponent implements OnInit {
  page = new Page()

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
      ]
    },
    {
      text: '管理中心',
      isGroup: true,
      children: [
        {
          text: '报表收藏管理',
          link: '/app/user/user-report',
          isLeaf: true,
          icon: 'appstore-o',
        },
        {
          text: '大屏收藏管理',
          isLeaf: true,
          icon: 'area-chart',
          link: '/app/user/user-screen',
        },
        {
          text: '个人信息管理',
          isLeaf: true,
          icon: 'user',
          link: '/app/user/user-message',
        },
        {
          text: '测试路由',
          isLeaf: true,
          icon: 'user',
          link: '/app/user/dsadsad',
        },
      ]
    },
  ]


  constructor(
    private menuService: MenuService,
    private sideMenu: SideMenuService,
    private personService: PersonalCenterService,
    private nzMessage: NzMessageService
  ) {
  }

  ngOnInit() {

    // this.menuService.add(this.menu);
    this.getScreenList();
    this.sideMenu.setMessage(this.menu);
    this.sideMenu.setMenu(this.menu);
  }

  getScreenList(reset = false) {
    if (reset) {
      this.page.curPage = 1;
    }
    const params = {
      spaceId: localStorage.getItem('spaceID'),
      curPage: this.page.curPage,
      pageSize: 5000,
      totalPage: this.page.totalPage || '',
      totalRow: this.page.totalRow || '',
    };
    this.personService.qryScreenList(params).subscribe(
      data => {
        let dataSet = data['retList'];
        dataSet.forEach(value=>{
          const item = {
            text: value.keepDashBoardName,
            link: `/app/user/dashboard-detail;dashBoardId=${value.dashBoardId};keepDashBoardId=${value.keepDashBoardId}`,
            isLeaf: true,
            icon: value.icon,
          }
          this.menu[0]['children'][0]['children'].push(item);
        })
      },
      error => {
        if (error instanceof HttpResponse) {
          this.nzMessage.error(error.body.retMsg);
        }
      },
    );
  }
}
