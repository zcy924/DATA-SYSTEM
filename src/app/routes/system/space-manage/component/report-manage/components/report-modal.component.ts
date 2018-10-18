import { Component, OnInit } from '@angular/core';
import { NzTreeNode, NzFormatEmitEvent, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SpaceManageService } from '../../../space-manage.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-create-newpage',
  templateUrl: './report-modal.html',
  styles: [
      `
      nz-date-picker ::ng-deep .ant-calendar-picker {
        width: 100%;
      }
    `,
  ],
})
export class ReportModalComponent implements OnInit {

  REPORT = '1';   // 报表
  FOLDER = '0';   // 文件夹
  PUBLIC = '1';   // 公开
  NOT_PUBLIC = '0';   // 公开
  DEV = '1';      // 开发者模式
  NOT_DEV = '0';  // 开发者模式

  reportName = '';
  report_id = '';
  folderName = '';
  folders = [];
  folderID = '';
  radioValue = '';
  isDev = true;
  isPublic = false;
  remark = '';


  constructor(
    private spaceManageService: SpaceManageService,
    private message: NzMessageService,
    private modalRef:NzModalRef) {
  }

  ngOnInit() {
  }

  createReport() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      Report: {
        ispublic: this.isPublic ? this.PUBLIC : this.NOT_PUBLIC,
        isdev: this.isDev ? this.DEV : this.NOT_DEV,
        remark: this.remark,
        report_name: this.reportName,
        type: this.radioValue,
        space_id: spaceID,
        parentid: this.folderID,
      },
    };

    this.spaceManageService.createReport(params).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('添加报表成功！');
      } else {
        this.message.error('添加报表失败！');
      }
    });
  }

  modReport() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      Report: {
        ispublic: this.isPublic ? this.PUBLIC : this.NOT_PUBLIC,
        isdev: this.isDev ? this.DEV : this.NOT_DEV,
        remark: this.remark,
        report_name: this.reportName,
        type: this.radioValue,
        space_id: spaceID,
        parentid: this.folderID,
        report_id: this.report_id,
      },
    };

    this.spaceManageService.modReport(params).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('修改成功！');
        this.modalRef.destroy("ok");
      } else {
        this.message.error('修改失败！');
      }
    });
  }

}
