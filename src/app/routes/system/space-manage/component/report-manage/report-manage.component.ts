import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import {
  NzModalService,
  NzMessageService,
} from 'ng-zorro-antd';
import { CreateNewpageComponent } from './components/create-newpage.component';
import { SpaceManageService } from '../../space-manage.service';
import { Page } from '../../../../../models/page';

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
  folders: any; // 当前全路径
  folderID = '/';     // 当前目录ID

  loading = false;
  indeterminate = false;
  allChecked = false;
  disabledButton = true;
  selectedArray = [];
  dataSet = [];
  page = new Page();

  constructor(
    private nzModel: NzModalService,
    private message: NzMessageService,
    private spaceManageService: SpaceManageService) {
  }

  ngOnInit(): void {
    this.searchData(true);
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
  searchData(reset: boolean = false, data = { parentid: '/', report_name: '根目录' }): void {
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      curPage: this.page.curPage - 1,
      pageSize: this.page.pageSize,
      Report: {
        space_id: spaceID,
        parentid: data.parentid,
      },
    };
    this.spaceManageService.getReportList(params)
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        this.dataSet = res['retList'];
        this.dataSet.forEach(value => {
          value.checked = false;
        });
        this.page.totalRow = res['totalRow'];
        this.page.totalPage = res['totalPage'];

        this.folder = data.report_name;
        this.folderID = data.parentid;

        if (data.parentid === '/') { // 清除无效目录
          this.folders = [];
        } else {
          let delTag = false;
          this.folders = this.folders.filter(value => {
            if (value['parentid'] === data.parentid) {
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
        this.searchData(true, { parentid: this.folderID, report_name: this.folder });
      },
    });
  }

  // 以当前报表作为模板新建
  addReportByOne(data) {


  }

  // 编辑报表属性
  editReport(data) {
    let title = data.type === this.isReport ? '报表页面' : '文件夹';
    const modal = this.nzModel.create({
      nzTitle: `编辑${title}`,
      nzContent: CreateNewpageComponent,
      nzWidth: '50%',
      nzComponentParams: {
        folder: this.folder,
        folders: this.folders,
        folderID: data.parentid,
        isPublic: data.isPublic === this.isPublic,
        isDev: data.isDev === this.isDev,
        remark: data.remark,
        reportName: data.report_name,
        report_id: data.report_id,
        radioValue: data.type,
      },
      nzOnOk: (res) => {
        res.modReport();
        this.searchData(true, { parentid: this.folderID, report_name: this.folder });
      },
    });
  }

  // 删除报表
  delReport(reportID: string, type: string): void {
    let title = (type === this.isFolder) ? '此文件夹' : '此报表';
    let content = (type === this.isFolder) ? '此操作将会级联删除该文件夹中的子文件' : '';
    this.delArray([{ 'report_id': reportID }], type, title, content);
  }

  // 批量删除报表
  delArray(
    list: Array<any> = this.selectedArray,
    type: string,
    title = '所选择的的文件夹或报表',
    content = '此操作将会批量删除所选择的的文件夹或报表') {

    this.nzModel.confirm({
      nzTitle: '是否删除' + title + '?',
      nzContent: content,
      nzOnOk: (res) => {
        let params = {
          ReportList: list,
        };
        this.spaceManageService.delReport(params)
          .subscribe(res => {
            if (res['retCode'] === '00000') {
              this.message.success('删除' + title + '成功！');
              this.searchData(true, { parentid: this.folderID, report_name: this.folder });
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
