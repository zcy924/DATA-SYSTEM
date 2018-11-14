import { Component, OnInit } from '@angular/core';
import {
  NzTreeNode,
  NzFormatEmitEvent,
  NzMessageService,
  NzModalRef,
} from 'ng-zorro-antd';
import { SpaceManageService } from '../../../space-manage.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Api } from '../../../../../../../data-generator/Api';
import { generatorRepo } from '../../../../../../../data-generator/DataGeneratorRepository';


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


  url: string;
  name: string;
  remark: string;
  headersText: string = '';
  bodyText: string = '';
  method: string = 'GET';
  spaceID = localStorage.getItem('spaceID');
  id;
  interval;
  status;
  metadata;
  generatorPath: 'json' | 'xml' = 'json';
  type;
  formData = {
    headersText: '',
    bodyText: '',
    responseText: '',
  };
  metaData:any;
  modMsg;
  aceConfig = {
    textChanged: (text, type) => {
      switch (type) {
        case 'header':
          this.headersText = text;
          break;
        case 'body':
          this.bodyText = text;
          break;
        default:
          return;
      }
      this.modMsg = text;
    },
    options: {
      printMargin: false,
    },
  };


  constructor(
    private _spaceManageService: SpaceManageService,
    private _message: NzMessageService,
    private _modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    if (this.id) {
      this.qryApi();
    }
  }

  // 数据源生成器，发送请求，获取响应
  sendRequest() {
    let api: Api = {
      url: this.url,
      method: this.method,
      headers: this.headersText,
      params: this.bodyText,
    };

    const gen = generatorRepo.getGenerator(this.generatorPath);
    gen.createDataSource(api).subscribe(data => {
      this.formData.responseText = JSON.stringify(data, null, 2);
    });
  }

  // 新增API
  submitForm() {

    // let test = {
    //   id: 'num1',
    //   displayName: '产品近三年销售额',
    //   comment: '没有任何建议',
    //   metadata: {
    //     dataType: 'array',
    //     dimensions: [
    //       { name: 'product', type: 'ordinal' },
    //       { name: '2015', type: 'int' },
    //       { name: '2016', type: 'int' },
    //       {
    //         name: '2017', type: 'int',
    //       }],
    //   },
    //   generatorPathPath: 'standard$mockDynamic',
    //   generatorPathParams: {
    //     api: api,
    //     intervalTime: 10000,
    //     datageneratorPath: `
    //
    //   `,
    //   },
    // };

    let params = {
      spaceId: this.spaceID,
      name: this.name,
      remark: this.remark,
      status: 'T',
      interval: '60',
      type: '0',
      metadata: {},
      generatorPath: this.generatorPath,
      api: {
        url: this.url,
        method: this.method,
        headers: this.headersText === ('' || null || undefined) ? null :JSON.parse(this.headersText),
        params: this.bodyText === ('' || null || undefined) ? null :JSON.parse(this.bodyText),
      },
    };

    this._spaceManageService.addApi(params).subscribe(
      res => {
        this._message.success('添加API成功！');
        this._modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpRequest) {
          this._message.error(err.body.retMsg);
        }
      },
    );
  }

  // 更新API
  updateApi() {
    let params = {
      id: this.id,
      spaceId: this.spaceID,
      name: this.name,
      remark: this.remark,
      status: 'T',
      interval: '60',
      type: '0',
      metadata: {},
      generatorPath: this.generatorPath,
      api: {
        url: this.url,
        method: this.method,
        headers: this.headersText === '' || null || undefined ? null :JSON.parse(this.headersText),
        params: this.bodyText === '' || null || undefined ? null :JSON.parse(this.bodyText),
      },
    };

    this._spaceManageService.modApi(params).subscribe(
      res => {
        this._message.success('修改API成功！');
        this._modalRef.destroy('ok');
      },
      err => {
        if (err instanceof HttpRequest) {
          this._message.error(err.body.retMsg);
        }
      },
    );
  }

  // 查询api
  qryApi() {
    this._spaceManageService.queryApi({ id: this.id }).subscribe(
      data => {
        this.name = data.name;
        this.remark = data.remark;
        this.url = data.api.url;
        this.method = data.api.method;
        this.metadata = data.metadata;
        this.interval = data.interval;
        this.status = data.status;
        this.type = data.type;
        this.generatorPath = data.generatorPath;
        this.headersText = data.api.headers;
        this.bodyText = data.api.params;
        this.formData.headersText = data.api.headers === ('' || null || undefined) ? '' : JSON.stringify(data.api.headers, null, 2);
        this.formData.bodyText = data.api.params === ('' || null || undefined) ? '' : JSON.stringify(data.api.params, null, 2);
      },
      err => {
        if (err instanceof HttpRequest) {
          this._message.error(err.body.retMsg);
        }
      },
    );
  }
}
