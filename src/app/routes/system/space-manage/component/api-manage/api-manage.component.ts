import { Component, OnInit } from '@angular/core';
import { SpaceManageService } from '../../space-manage.service';
import { Page } from '../../../../../models/page';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpResponse } from '@angular/common/http';
import { ApiModalComponent } from './modal/api-modal.component';

@Component({
  templateUrl: 'api-manage.html',
  styles: [
      `
      .title-tab {
        height: 32px;
        line-height: 32px;
        font-size: x-large;
      }

      .title-tab + div {
        float: right;
      }
    `,
  ],
})

export class ApiManageComponent implements OnInit {
  page = new Page();
  loading = false;
  disabledButton = true;

  indeterminate = false;
  allChecked = false;
  dataSet = [];

  key = '';

  constructor(
    private nzModal: NzModalService,
    private nzMessage: NzMessageService,
    private spaceManageService: SpaceManageService,

  ) {
  }

  ngOnInit() {
    this.getApiList();
  }

  openAdd() {
    const modal = this.nzModal.create({
      nzTitle: `新增API`,
      nzContent: ApiModalComponent,
      nzStyle: { top: '30px' },
      nzWidth: '80%',
      nzOkText: '新增',
      nzCancelText: '取消',
      nzOnOk: i => {
        return new Promise(reslove => {
          i.submitForm();
        });
      },
    });
    modal.afterClose.subscribe(data => {
      if (data == 'ok') {
        this.getApiList(true);
      }
    });

  }

  // 模糊查询列表
  getApiList(reset = false) {
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    const params = {
      key: this.key,
      spaceId: localStorage.getItem('spaceID'),
      status: 'T',
      curPage: this.page.curPage,
      pageSize: this.page.pageSize,
      totalPage: this.page.totalPage || '',
      totalRow: this.page.totalRow || '',
    };
    this.spaceManageService.qryDimList(params).subscribe(
      data => {
        this.dataSet = data['retList'];
        this.dataSet.forEach(value => value.checked = false);
        this.page.totalRow = data['totalRow'];
        this.page.totalPage = data['totalPage'];
        this.loading = false;
      },
      error => {
        if (error instanceof HttpResponse) {
          this.nzMessage.error(error.body.retMsg);
        }
      },
    );
  }

  checkAll(value: Boolean) {
    this.dataSet.forEach(data => {
      // if (!data.checked) {
      data.checked = value;
      // }
    });
    this.checkLine();
  }

  checkLine() {
    const allChecked = this.dataSet.every(value => value.checked === true);
    const allUnChecked = this.dataSet.every(value => !value.checked);
    this.disabledButton = !this.dataSet.some(value => value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  currentDataChange($event) {
    this.dataSet = $event;
    this.checkLine();
  }

  // 编辑API
  edit(data) {
    const modal = this.nzModal.create({
      nzTitle: `编辑API`,
      nzContent: ApiModalComponent,
      nzStyle: { top: '30px' },
      nzWidth: '80%',
      nzOkText: '保存',
      nzCancelText: '取消',
      nzOnOk: i => {
        return new Promise(() => {
          i.updateApi();
        });
      },
      nzComponentParams: {
        id:data.id
      },
    });
    modal.afterClose.subscribe(data => {
      if (data == 'ok') {
        this.getApiList(true);
      }
    });
  }


  delete(list, success) {
    const params = {
      reqList: list,
    };
    this.spaceManageService.delAll(params).subscribe(
      data => {
        this.nzMessage.success(success);
        this.getApiList(true);
      },
      err => {
        if (err instanceof HttpResponse) {
          this.nzMessage.error(err.body.retMsg);
        }
      },
    );
  }

  deleteOne(data) {
    this.delete([{ 'id': data.id }], '删除成功!');
  }

  deleteAll() {
    this.nzModal.warning({
      nzTitle: '系统提示',
      nzContent: '确定删除所选API吗？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: () => {
        const delList = this.dataSet.filter(value => value.checked);
        this.delete(delList, '删除所选API成功!');
      },
    });
  }


}
