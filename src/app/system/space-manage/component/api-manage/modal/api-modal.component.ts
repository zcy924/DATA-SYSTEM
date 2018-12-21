import { Component, OnInit } from '@angular/core';
import {
  NzMessageService,
  NzModalRef,
} from 'ng-zorro-antd';
import { SpaceManageService } from '../../../space-manage.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Api } from '../../../../../../data-generator/Api';
import { generatorRepo } from '../../../../../../data-generator/DataGeneratorRepository';


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
  headersText: any = '';
  bodyText: any = '';
  method: string = 'GET';
  spaceId ;
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
    metadataText: ''
  };
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
        case 'metadata':
          this.metadata = text;
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
    let params = {
      spaceId: this.spaceId,
      name: this.name,
      remark: this.remark,
      status: 'T',
      interval: '60',
      type: '0',
      metadata: JSON.parse(this.metadata),
      generatorPath: this.generatorPath,
      api: {
        url: this.url,
        method: this.method,
        headers: JSON.parse(this.headersText),
        params:  JSON.parse(this.bodyText),
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
      spaceId: this.spaceId,
      name: this.name,
      remark: this.remark,
      status: 'T',
      interval: '60',
      type: '0',
      metadata: JSON.parse(this.metadata),
      generatorPath: this.generatorPath,
      api: {
        url: this.url,
        method: this.method,
        headers: JSON.parse(this.headersText),
        params: JSON.parse(this.bodyText),
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

        this.headersText = data.api.headers===null ||data.api.headers===undefined||data.api.headers===''? JSON.stringify({}):JSON.stringify(data.api.headers);
        this.bodyText = data.api.params===null ||data.api.params===undefined||data.api.params===''? JSON.stringify({}):JSON.stringify(data.api.params);
        this.metadata = data.metadata === null ||data.metadata === undefined || data.metadata ===''? JSON.stringify({}):JSON.stringify(data.metadata);

        this.formData.metadataText = data.metadata===null || data.metadata===undefined? JSON.stringify({}):JSON.stringify(data.metadata, null, 2);
        this.formData.headersText = (data.api.headers  === null || data.api.headers  === undefined )? JSON.stringify({}) : JSON.stringify(data.api.headers, null, 2);
        this.formData.bodyText = (data.api.params === null || data.api.params === undefined) ? JSON.stringify({}) : JSON.stringify(data.api.params, null, 2);
      },
      err => {
        if (err instanceof HttpRequest) {
          this._message.error(err.body.retMsg);
        }
      },
    );
  }
}
