import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddScreenComponent } from './component/add-screen.component';
import { SpaceManageService } from '../../space-manage.service';
import { HttpResponse } from '@angular/common/http';
import { Page } from 'app/models/page';
import { EditScreenComponent } from './component/edit-screen.component';
import { SettingsService } from '@delon/theme';
import { SideMenuService } from '@shared/side-menu.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-screen-manage',
  templateUrl: './screen-manage.html',
  styleUrls: ['./screen-manage.less'],
})
export class ScreenManageComponent implements OnInit, AfterViewInit {
  page = new Page();
  loading = false;
  disabledButton = true;

  indeterminate = false;
  allChecked = false;
  dataSet = [];
  menu;
  spaceId: string;

  constructor(
    private nzModal: NzModalService,
    private nzMessage: NzMessageService,
    private spaceManageService: SpaceManageService,
    private settings: SettingsService,
    private sideMenu: SideMenuService,
    private router: ActivatedRoute

  ) {
  }

  ngOnInit() {
    this.spaceId = this.router.snapshot.parent.params.spaceId;
  }
  ngAfterViewInit() {
    this.getScreenList();
    this.menu = this.sideMenu.menu;
  }

  openAdd() {
    const modal = this.nzModal.create({
      nzTitle: `新增大屏`,
      nzContent: AddScreenComponent,
      nzWidth: '600px',
      nzComponentParams: {
        spaceId: this.spaceId,
        companyId: this.settings.user.companyId,
      },
      nzOkText: '新增',
      nzCancelText: '取消',
      nzOnOk: i => {
        i.submitForm();
      },
    });
    modal.afterClose.subscribe(data => {
      this.getScreenList(true);
      this.getScreenTree();
    });
  }

  getScreenList(reset = false) {
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    const params = {
      spaceId: this.spaceId,
      curPage: this.page.curPage,
      pageSize: this.page.pageSize,
      totalPage: this.page.totalPage || '',
      totalRow: this.page.totalRow || '',
    };
    this.spaceManageService.getScreenList(params).subscribe(
      data => {
        this.dataSet = data['retList'];
        this.dataSet.forEach(value => {
          value.checked = false;
        });
        console.log(this.dataSet);
        this.page.totalRow = data['totalRow'];
        this.page.totalPage = data['totalPage'];
        this.loading = false;
      },
      error => {
        if (error instanceof HttpResponse) {
          this.nzMessage.error(error.body.retMsg);
        }
      },
    );
  }

  checkAll(value: Boolean) {
    this.dataSet.forEach(data => {
      // if (!data.checked) {
      data.checked = value;
      // }
    });
    this.checkLine();
  }

  checkLine() {
    const allChecked = this.dataSet.every(value => value.checked === true);
    const allUnChecked = this.dataSet.every(value => !value.checked);
    this.disabledButton = !this.dataSet.some(value => value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  currentDataChange($event) {
    this.dataSet = $event;
    this.checkLine();
  }

  view() {
  }

  edit(data) {
    const modal = this.nzModal.create({
      nzTitle: `编辑大屏${data.name}`,
      nzContent: EditScreenComponent,
      nzWidth: '600px',
      nzOnOk: i => {
        return new Promise(reslove => {
          i.submitForm();
        });
      },
      nzComponentParams: {
        screenName: data.name,
        screenRemark: data.remark,
        isDev: data.isDev,
        dashboardId: data.dashboardId,
        spaceId: this.spaceId,
      },
    });
    modal.afterClose.subscribe(data => {
      if (data == 'ok') {
        this.getScreenList(true);
        this.getScreenTree();
      }
    });
  }

  public() {
  }

  copy() {
  }

  delete(screenId) {
    const params = {
      spaceId: this.spaceId,
      dashboardId: screenId,
    };
    this.spaceManageService.delScreen(params).subscribe(
      data => {
        this.nzMessage.success('删除成功!');
        this.getScreenList(true);
        this.getScreenTree();
      },
      err => {
        if (err instanceof HttpResponse) {
          this.nzMessage.error(err.body.retMsg);
        }
      },
    );
  }

  handle() {
    this.nzModal.warning({
      nzTitle: '系统提示',
      nzContent: '确定删除所选大屏吗？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: () => {
        const handleArray = [];
        this.dataSet.forEach(value => {
          if (value.checked) {
            const item = {
              dashboardId: value.dashboardId,
              spaceId: this.spaceId,
            };
            handleArray.push(item);
          }
        });
        const params = { reqList: handleArray };
        this.spaceManageService.delAllScreen(params).subscribe(
          data => {
            this.nzMessage.success('批量删除成功!');
            this.getScreenList(true);
            this.getScreenTree();
          },
          err => {
            if (err instanceof HttpResponse) {
              this.nzMessage.error(err.body.retMsg);
            }
          },
        );
      },
    });
  }

  // 新增大屏时刷新侧边大屏菜单栏
  getScreenTree(reset = false) {
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
          this.nzMessage.error(err.body.retMsg);
        }
      },
    );
  }
}
