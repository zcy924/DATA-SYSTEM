import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NzTreeNode,
  NzFormatEmitEvent,
  NzMessageService,
  NzModalRef,
} from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { SpaceManageService } from '../../../space-manage.service';
import { PersonalCenterService } from '../../../../personal-center/personal-center.service';


@Component({
  selector: 'app-report-folder',
  templateUrl: './report-folder-modal.html',
  styles: [
      `
      nz-date-picker ::ng-deep .ant-calendar-picker {
        width: 100%;
      }
    `,
  ],
})
export class ReportFolderModalComponent implements OnInit {
  REPORT = '1'; // 报表
  FOLDER = '0'; // 文件夹

  reportName = '';
  remark = '';
  parentId = '';


  constructor(
    private spaceManageService: SpaceManageService,
    private _personalService: PersonalCenterService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
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
          this.message.error(err.body.retMsg);
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
      if (!node.isLeaf && report.children) {
        this.recursiveNode(node.children, report.children);
      }
    }
  }

  // 新增报表收藏文件夹
  addSelfFolderInSpace() {
    let params = {
      keepReportName: this.reportName,
      parentId: this.parentId ? this.parentId : '/',
      remark: this.remark,
      keepReportType: '0',
    };
    this._personalService.addSelfFolder(params).subscribe(res => {
      this.message.success('新增报表收藏文件夹成功！');
      console.log(res);
    }, err => {
      if (err instanceof HttpResponse) {
        this.message.error('新增报表收藏文件夹失败！');
      }
    });
  }

}
