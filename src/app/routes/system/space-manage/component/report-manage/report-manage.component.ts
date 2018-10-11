import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import {
  NzModalService,
  NzMessageService,
} from 'ng-zorro-antd';
import { CreateNewpageComponent } from './components/create-newpage.component';
import { SpaceManageService } from '../../space-manage.service';

@Component({
  selector: 'app-report-manage',
  templateUrl: './report-manage.html',
  styleUrls: ['./report-manage.less'],
})
export class ReportManageComponent implements OnInit {

  isReport = '1';   // 报表
  isFolder = '0';   // 文件夹
  isPublic = '1';   // 公开
  isDev = '1';      // 开发者模式

  folder = '根目录';  // 当前目录名称
  folders = '根目录'; // 当前路径
  folderID = '/'; // 当前目录ID

  loading = true;
  dataSet = [];
  pageIndex = 1;
  pageSize = 5;
  total = 100;


  constructor(
    private nzModel: NzModalService,
    private message: NzMessageService,
    private spaceManageService: SpaceManageService) {
  }

  ngOnInit(): void {
  }



  indeterminate = false;
  allChecked = true;

  checkAll(event): void {

  }

  refreshStatus() {

  }

  searchData(reset: boolean = false, reportId: string = '/'): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      pageSize: this.pageSize,
      curPage: this.pageIndex,
      Report: {
        space_id: spaceID,
        parentid: reportId,
      },
    };
    this.spaceManageService.getReportList(params)
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        this.dataSet = res['retList'];
        this.total = this.dataSet.length;
      }, err => {
        console.log(err);
      });
  }



  // 新增报表
  addReport(type) {
    let title = type === this.isReport ? '报表页面' : '文件夹';
    const modal = this.nzModel.create({
      nzTitle: `新建${title}`,
      nzContent: CreateNewpageComponent,
      nzWidth: '50%',
      nzComponentParams: {
        folder: this.folder,
        folders: this.folders,
        folderID: this.folderID,
        radioValue: type === this.isReport ? this.isReport : this.isFolder,
      },
      nzOnOk: (res) => {
        res.createReport();
        this.searchData(true,this.folderID);
      }
    });
  }

  // 编辑报表属性
  editReport() {


  }

  // 删除报表
  delReport(reportID: string, type: string): void {
    let title = (type === this.isFolder) ? '文件夹' : '报表';
    let content = (type === this.isFolder) ? '此操作将会级联删除该文件夹中的子文件' : '';

    let spaceID = localStorage.getItem('spaceID');
    this.nzModel.confirm({
      nzTitle: '是否删除此' + title + '?',
      nzContent: content,
      nzOnOk: (res) => {
        let params = {
          spaceID: spaceID,
          reportID: reportID,
        };
        this.spaceManageService.delReport(params)
          .subscribe(res => {
            if (res['retCode'] === '00000') {
              this.message.success('删除' + title + '成功！');
            } else {
              this.message.error('删除' + title + '失败！');
            }
          }, err => {
            this.message.error('删除' + title + '失败！');
          });
      },
    });
  }

  // 打开报表页面
  openReport() {
    // TODO 展示报表内容
  }
}
