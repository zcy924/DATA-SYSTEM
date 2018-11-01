import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MenuService } from '@delon/theme';
import { Page } from '../../../../models/page';
import { SideMenuService } from '@shared/side-menu.service';
import { HttpResponse } from '@angular/common/http';
import { PersonalCenterService } from '../personal-center.service';
import { ReportFolderModalComponent } from './modal/report-folder-modal.component';
import { ReportKeepModalComponent } from './modal/report-keep-modal.component';


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
    private _nzModel: NzModalService,
    private _message: NzMessageService,
    private _personalService: PersonalCenterService,
    private sideMenu: SideMenuService,
  ) {
  }

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
      parentId: data.parentId,
    };
    this._personalService.getSelfReportList(params).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.dataSet = res['retList'];
      this.dataSet.forEach(value => value.checked = false);
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
          delTag = value['parentId'] === data.parentId;
          return !(delTag === true);
        });
      }
      this.folders.push(data);
      console.log(this.folders);
      this.loading = false;
    });
  }

  // 新增报表文件夹
  addReportFolder() {
    const modal = this._nzModel.create({
      nzTitle: `新增报表收藏文件夹`,
      nzContent: ReportFolderModalComponent,
      nzWidth: '40%',
      nzOnOk: (res) => {
        res.addSelfFolder();
      },
    });
    modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        this._message.success('新增报表收藏文件夹成功！');
        this.searchData(true, {
          parentId: this.folderID,
          reportName: this.folderName,
        });
        this.getReportTree();
      }
    });
  }


  // 编辑报表属性
  editReport(data) {
    let title = data.keepReportType === this.isReport ? '报表页面' : '收藏夹';
    const modal = this._nzModel.create({
      nzTitle: `编辑${title}`,
      nzContent: ReportKeepModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        remark: data.remark,
        reportName: data.keepReportName,
        reportId: data.keepReportId,
        type: data.keepReportType,
        parentId:data.parentId
      },
      nzOnOk: res => {
        return new Promise(reslove => {
          res.modSelfReport();
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

  // 删除报表收藏
  delReport(keepReportId: string, type: string): void {
    let title = type === this.isFolder ? '此收藏夹' : '此报表收藏';
    let content =
      type === this.isFolder ? '此操作将会级联删除该收藏夹中的子文件' : '';
    this.delArray([{ keepReportId: keepReportId }], title, content);
  }

  // 批量删除报表收藏
  delArray(
    list: Array<any> = this.selectedArray,
    title = '所选择的收藏夹或报表',
    content = '此操作将会批量删除所选择的收藏夹或报表',
  ) {
    this._nzModel.confirm({
      nzTitle: '是否删除' + title + '?',
      nzContent: content,
      nzOnOk: res => {
        let params = {
          keepList: list,
        };
        this._personalService.delSelfReportList(params).subscribe(
          res => {
            this._message.success('删除' + title + '成功！');
            this.searchData(true, {
              parentId: this.folderID,
              reportName: this.folderName,
            });
            this.getReportTree();
          },
          err => {
            if (err instanceof HttpResponse) {
              this._message.error('删除' + title + '失败！');
            }
          },
        );
      },
    });
  }

  // 打开收藏报表预览页面
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
    this._personalService.qrySelfReportFolderListTree(params).subscribe(
      data => {
        const report_menu = data.retTreeList;
        this.formateTree(report_menu);
        this.menu[1]['children'] = report_menu;
        this.sideMenu.setMessage(this.menu);
      },
      err => {
        if (err instanceof HttpResponse) {
          this._message.error(err.body.retMsg);
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
