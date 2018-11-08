import {Component, OnInit} from '@angular/core';
import {
  NzTreeNode,
  NzFormatEmitEvent,
  NzMessageService,
  NzModalRef,
} from 'ng-zorro-antd';
import {SpaceManageService} from '../../../space-manage.service';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {getJSON} from 'ng-alain/utils/json';
import {Api} from '../../../../../../../data-generator/Api';
import {GeneratorEnum} from '../../../../../../../data-generator/GeneratorEnum';
import {DataGenerator} from '../../../../../../../data-generator/DataGenerator';
import {DefaultDataGenerator} from '../../../../../../../data-generator/DefaultDataGenerator';

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
  responseText: any;
  method: string = 'GET';
  spaceID = localStorage.getItem('spaceID');
  id;
  interval;
  status;
  type;
  formData = {
    headersText: '',
    bodyText: '',
    responseText: ''
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
        default:
          return;
      }
      this.modMsg = text;
    },
    options: {
      printMargin: false
    }
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
      headers: JSON.parse(this.headersText === '' ? '{}' : this.headersText),
      body: JSON.parse(this.bodyText === '' ? null : this.bodyText),
      generator: GeneratorEnum.DEFAULT,
    };
    this.formData.headersText = this.headersText;
    this.formData.bodyText = this.bodyText;

    const defaultDataGenerator = new DefaultDataGenerator(api);
    defaultDataGenerator.fetchData().subscribe(data => {
      console.log(data);
      this.responseText = JSON.stringify(data);
      this.formData.responseText = JSON.stringify(data, null,2);
    });
  }

  // 新增API
  submitForm() {
    let params = {
      spaceId: this.spaceID,
      name: this.name,
      remark: this.remark,
      status: 'T',
      interval: '60',
      type: '0',
      api: {
        url: this.url,
        method: this.method,
        headers: JSON.parse(this.headersText === '' ? '{}' : this.headersText),
        body: JSON.parse(this.bodyText === '' ? '{}' : this.bodyText),
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
      api: {
        url: this.url,
        method: this.method,
        headers: JSON.parse(this.headersText === '' ? '{}' : this.headersText),
        body: JSON.parse(this.bodyText === '' ? '{}' : this.bodyText),
      },
    };

    this._spaceManageService.modApi(params).subscribe(
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

  // 查询api
  qryApi() {
    this._spaceManageService.queryApi({id: this.id}).subscribe(
      data => {
        this.name = data.name;
        this.remark = data.remark;
        this.url = data.api.url;
        this.method = data.api.method;
        this.interval = data.interval;
        this.status = data.status;
        this.type = data.type;
        this.headersText = '';
        this.bodyText = '';
      },
      err => {
        if (err instanceof HttpRequest) {
          this._message.error(err.body.retMsg);
        }
      },
    );
  }
}
