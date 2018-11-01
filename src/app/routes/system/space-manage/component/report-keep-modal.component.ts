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
import { SpaceManageService } from '../space-manage.service';
import { PersonalCenterService } from '../../personal-center/personal-center.service';
import { ReportFolderModalComponent } from './report-folder-modal.component';

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

  reportName = '';
  reportId = '';
  parentId = '/';
  remark = '';

  nodes: Array<any>;

  constructor(
    private _spaceManageService: SpaceManageService,
    private _personalService: PersonalCenterService,
    private _message: NzMessageService,
    private _nzModel: NzModalService,
    private _modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    this.getTree();
  }

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

  // 遍历树
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

  // 收藏报表
  keepSelfReportInSpace() {
    let params = {
      reportId: this.reportId,
      parentId: this.parentId,
      remark: this.remark,
      keepReportType: '1',
      keepReportName: this.reportName,
    };
    this._personalService.addSelfReport(params).subscribe(res => {
        this._message.success('收藏报表成功！');
        this._modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpResponse) {
          this._message.error('收藏报表失败！');
        }
      });
  }

  // 新建报表文件夹对话框
  addFolderInSpace() {
    const modal = this._nzModel.create({
      nzTitle: `新建报表收藏文件夹`,
      nzContent: ReportFolderModalComponent,
      nzWidth: '40%',
      nzOnOk: (res) => {
        res.addSelfFolderInSpace();
      },
    });
    modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        this.getTree();
      }
    });
  }
}
