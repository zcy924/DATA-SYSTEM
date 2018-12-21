import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NzTreeNode,
  NzFormatEmitEvent,
  NzMessageService,
  NzModalRef, NzModalService,
} from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { PersonalCenterService } from '../../personal-center.service';

@Component({
  selector: 'app-report-keep',
  templateUrl: './report-keep-modal.html',
  styles: [
      `
      nz-date-picker ::ng-deep .ant-calendar-picker {
        width: 100%;
      }
    `,
  ],
})
export class ReportKeepModalComponent implements OnInit {
  REPORT = '1'; // 报表
  FOLDER = '0'; // 文件夹

  type = '';
  reportName = '';
  reportId = '';
  parentId = '/';
  remark = '';

  constructor(
    private _personalService: PersonalCenterService,
    private _message: NzMessageService,
    private _nzModel: NzModalService,
    private _modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    this.getTree();
  }

  nodes: Array<any>;

  checkTreeNode(e: NzFormatEmitEvent): void {
    this.parentId = e.node.key;
  }

  // 初始化报表树
  getTree() {
    this._personalService.qrySelfReportFolderListTree({}).subscribe(
      res => {
        this.nodes = [{
          title: '根目录',
          key: '/',
          expanded: true,
          isLeaf: false,
          icon: 'anticon-folder',
          children: [],
        }];
        this.recursiveNode(this.nodes[0].children, res['retTreeList']);
      },
      err => {
        if (err instanceof HttpResponse) {
          this._message.error(err.body.retMsg);
        }
      },
    );
  }

  // 递归遍历报表树
  recursiveNode(nodes, reports) {
    for (let report of reports) {
      let node = {
        title: report.keepReportName,
        key: report.keepReportId,
        expanded: true,
        isLeaf: !report.children,
        icon: 'anticon-folder',
        children: [],
      };
      nodes.push(node);
      if (report.children) {
        this.recursiveNode(node.children, report.children);
      }
    }
  }

  // 报表收藏编辑修改
  modSelfReport() {
    let params = {
      keepReportId: this.reportId,
      keepReportName: this.reportName,
      parentId: this.parentId,
      remark: this.remark,
    };
    this._personalService.modSelfReport(params).subscribe(res => {
        this._message.success('收藏报表成功！');
        this._modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpResponse) {
          this._message.error('收藏报表失败！');
        }
      });
  }
}
