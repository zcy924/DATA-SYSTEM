import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { MenuService } from '@delon/theme';

@Component({
  templateUrl: './report-collect.html',
  styles: [
    `
      :host ::ng-deep .ant-tree {
        overflow: hidden;
        margin: 0 -24px;
        padding: 0 24px;
      }

      :host ::ng-deep .ant-tree li {
        padding: 4px 0 0 0;
      }
      @keyframes shine {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }

      .shine-animate {
        animation: shine 2s ease infinite;
      }

      .custom-node {
        cursor: pointer;
        line-height: 26px;
        margin-left: 4px;
        display: inline-block;
        margin: 0 -1000px;
        padding: 0 1000px;
      }

      .active {
        color: #1890ff;
      }

      .is-dragging {
        background-color: transparent !important;
        color: #000;
        opacity: 0.7;
      }

      .file-name,
      .folder-name,
      .file-desc,
      .folder-desc {
        margin-left: 4px;
      }

      .file-desc,
      .folder-desc {
        padding: 2px 8px;
        background: #87ceff;
        color: #ffffff;
      }
    `
  ]
})
export class ReportCollectComponent implements OnInit {
  constructor(private nzModel: NzModalService,private menuService: MenuService) {}

  ngOnInit() {
  }
}
