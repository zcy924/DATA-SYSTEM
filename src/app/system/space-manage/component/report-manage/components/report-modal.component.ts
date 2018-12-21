import { Component, OnInit } from '@angular/core';
import {
  NzTreeNode,
  NzFormatEmitEvent,
  NzMessageService,
  NzModalRef,
} from 'ng-zorro-antd';
import { SpaceManageService } from '../../../space-manage.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpResponse } from '@angular/common/http';

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
  REPORT = '1'; // 报表
  FOLDER = '0'; // 文件夹
  PUBLIC = '1'; // 公开
  NOT_PUBLIC = '0'; // 公开
  DEV = '1'; // 开发者模式
  NOT_DEV = '0'; // 开发者模式

  reportName = '';
  reportId = '';
  folderName = '';
  folders = [];
  folderID = '';
  radioValue = '';
  isDev = true;
  isPublic = false;
  remark = '';
  spaceId;

  constructor(
    private spaceManageService: SpaceManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
  ) {}

  ngOnInit() {

  }

  createReport() {
    let spaceID = this.spaceId;
    let params = {
      Report: {
        isPublic: this.isPublic ? this.PUBLIC : this.NOT_PUBLIC,
        isDev: this.isDev ? this.DEV : this.NOT_DEV,
        remark: this.remark,
        reportName: this.reportName,
        type: this.radioValue,
        spaceId: spaceID,
        parentId: this.folderID,
      },
    };

    this.spaceManageService.createReport(params).subscribe(
      res => {
        this.message.success('添加报表成功！');
        this.modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpRequest) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }

  modReport() {
    const params = {
      Report: {
        isPublic: this.isPublic ? this.PUBLIC : this.NOT_PUBLIC,
        isdDev: this.isDev ? this.DEV : this.NOT_DEV,
        remark: this.remark,
        reportName: this.reportName,
        type: this.radioValue,
        spaceId: this.spaceId,
        parentId: this.folderID,
        reportId: this.reportId,
      },
    };

    this.spaceManageService.modReport(params).subscribe(
      res => {
        this.message.success('修改成功！');
        this.modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }
}
