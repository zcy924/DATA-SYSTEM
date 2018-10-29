import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MenuService } from '@delon/theme';
import { Page } from '../../../../models/page';
import { SideMenuService } from '@shared/side-menu.service';
import { ReportModalComponent } from '../../space-manage/component/report-manage/components/report-modal.component';
import { HttpResponse } from '@angular/common/http';
import { PersonalCenterService } from '../personal-center.service';

@Component({
  selector: 'app-collect-manage',
  templateUrl: './report-collect.html',
  styleUrls: ['./report-collect.less'],
})
export class ReportCollectComponent implements OnInit {
  isReport = '1'; // 报表
  isFolder = '0'; // 文件夹
  isPublic = '1'; // 公开
  isDev = '1'; // 开发者模式

  folderName = '根目录'; // 当前目录名称
  folderID = '/'; // 当前目录ID
  folders: Array<any>; // 当前全路径

  loading = false;
  indeterminate = false;
  allChecked = false;
  disabledButton = true;
  selectedArray = [];
  dataSet = [];
  page = new Page();

  menu;

  constructor(
    private nzModel: NzModalService,
    private message: NzMessageService,
    private spaceManageService: PersonalCenterService,
    private sideMenu: SideMenuService,
  ) {}

  ngOnInit(): void {
    this.searchData(true);
    this.menu = this.sideMenu.menu;
  }
  checkAll(value: Boolean) {
    this.dataSet.forEach(data => {
      data.checked = value;
    });
    this.checkLine();
  }

  checkLine() {
    const allChecked = this.dataSet.every(value => value.checked === true);
    const allUnChecked = this.dataSet.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
    this.disabledButton = !this.dataSet.some(value => value.checked);
    this.selectedArray = [];
    this.selectedArray = this.dataSet.filter(value => value.checked);
  }

  currentDataChange($event) {
    this.dataSet = $event;
    this.checkLine();
  }

  // 列表分页查询
  searchData(
    reset: boolean = false,
    data = { parentId: '/', reportName: '根目录' },
  ): void {
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      curPage: this.page.curPage,
      pageSize: this.page.pageSize,
      totalPage: this.page.totalPage,
      totalRow: this.page.totalRow,
      Report: {
        spaceId: spaceID,
        parentId: data.parentId,
      },
    };
    this.spaceManageService.getReportList(params).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.dataSet = res['retList'];
      this.dataSet.forEach(value => {
        value.checked = false;
      });
      this.page.totalRow = res['totalRow'];
      this.page.totalPage = res['totalPage'];

      this.folderName = data.reportName;
      this.folderID = data.parentId;

      if (data.parentId === '/') {
        // 清除无效目录
        this.folders = [];
      } else {
        let delTag = false;
        this.folders = this.folders.filter(value => {
          if (value['parentId'] === data.parentId) {
            delTag = true;
          }
          if (delTag === true) {
            return false;
          }
          return true;
        });
      }
      this.folders.push(data);
      console.log(this.folders);
      this.loading = false;
    });
  }

  // 新增报表
  addReport(type) {
    let title = type === this.isReport ? '报表页面' : '文件夹';
    const modal = this.nzModel.create({
      nzTitle: `新建${title}`,
      nzContent: ReportModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        folderName: this.folderName,
        folders: this.folders,
        folderID: this.folderID,
        radioValue: type === this.isReport ? this.isReport : this.isFolder,
      },
      nzOnOk: res => {
        return new Promise(i => {
          res.createReport();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        this.searchData(true, {
          parentId: this.folderID,
          reportName: this.folderName,
        });
        this.getReportTree();
      }
    });
  }

  // TODO 以此报表作为模板新建
  addReportByOne(data) {

  }

  // 编辑报表属性
  editReport(data) {
    let title = data.type === this.isReport ? '报表页面' : '文件夹';
    const modal = this.nzModel.create({
      nzTitle: `编辑${title}`,
      nzContent: ReportModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        folderName: this.folderName,
        folders: this.folders,
        folderID: data.parentId,
        isPublic: data.isPublic === this.isPublic,
        isDev: data.isDev === this.isDev,
        remark: data.remark,
        reportName: data.reportName,
        reportId: data.reportId,
        radioValue: data.type,
      },
      nzOnOk: res => {
        return new Promise(reslove => {
          res.modReport();
        });
      },
    });
    modal.afterClose.subscribe(data => {
      if (data == 'ok') {
        this.searchData(true, {
          parentId: this.folderID,
          reportName: this.folderName,
        });
        this.getReportTree();
      }
    });
  }

  // 删除报表
  delReport(reportID: string, type: string): void {
    let title = type === this.isFolder ? '此文件夹' : '此报表';
    let content =
      type === this.isFolder ? '此操作将会级联删除该文件夹中的子文件' : '';
    this.delArray([{ reportId: reportID }], title, content);
  }

  // 批量删除报表
  delArray(
    list: Array<any> = this.selectedArray,
    title = '所选择的文件夹或报表',
    content = '此操作将会批量删除所选择的文件夹或报表',
  ) {
    this.nzModel.confirm({
      nzTitle: '是否删除' + title + '?',
      nzContent: content,
      nzOnOk: res => {
        let params = {
          ReportList: list,
        };
        this.spaceManageService.delReport(params).subscribe(
          res => {
            this.message.success('删除' + title + '成功！');
            this.searchData(true, {
              parentId: this.folderID,
              reportName: this.folderName,
            });
            this.getReportTree();
          },
          err => {
            if (err instanceof HttpResponse) {
              this.message.error('删除' + title + '失败！');
            }
          },
        );
      },
    });
  }

  // 打开报表页面
  openReport() {
    // TODO 展示报表内容
  }
  //新增或删除报表时更新报表树
  getReportTree() {
    const params = {
      Report: {
        spaceId: localStorage.getItem('spaceID'),
      },
    };
    this.spaceManageService.qryReportTree(params).subscribe(
      data => {
        const report_menu = data.retTreeList;
        this.formateTree(report_menu);
        this.menu[1]['children'] = report_menu;
        this.sideMenu.setMessage(this.menu);
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
      value.link = `app/square/${value.spaceId}/report-detail/${
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
