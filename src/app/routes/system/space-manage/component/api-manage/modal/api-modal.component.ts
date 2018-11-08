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
  selector: 'app-api-modal',
  templateUrl: './api-modal.html',
  styles: [
      `
      nz-date-picker ::ng-deep .ant-calendar-picker {
        width: 100%;
      }

      .api-form-content {
        width: 50%;
        float: left;
      }

      .api-form-item {
        margin-bottom: 8px;
        clear: both
      }
    `,
  ],
})
export class ApiModalComponent implements OnInit {


  name;
  remark;
  headersText;
  bodyText;
  responseText;
  api = {
    url: '',
    method: 'GET',
    headers: {},
    body: {},
  };

  constructor(
    private _spaceManageService: SpaceManageService,
    private _message: NzMessageService,
    private _modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {

  }

  submitForm() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      Report: {},
    };

    // this.spaceManageService.createReport(params).subscribe(
    //   res => {
    //     this.message.success('添加报表成功！');
    //     this.modalRef.destroy('ok');
    //   },
    //   err => {
    //     if (err instanceof HttpRequest) {
    //       this.message.error(err.body.retMsg);
    //     }
    //   },
    // );
  }

  modReport() {


  }
}
