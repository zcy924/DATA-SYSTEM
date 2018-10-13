import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddScreenComponent } from './component/add-screen.component';
import { SpaceManageService } from '../../space-manage.service';
import { HttpResponse } from '@angular/common/http';
import { Page } from 'app/models/page';
import { EditScreenComponent } from './component/edit-screen.component';

@Component({
  selector: 'app-screen-manage',
  templateUrl: './screen-manage.html',
  styleUrls: ['./screen-manage.less'],
})
export class ScreenManageComponent implements OnInit {
  page = new Page();
  loading = false;
  indeterminate = false;
  allChecked = false;
  selectedArray = [];
  dataSet = [];
  constructor(
    private nzModal: NzModalService,
    private nzMessage: NzMessageService,
    private spaceManageService: SpaceManageService,
  ) {}
  ngOnInit() {
    this.getScreenList();
  }
  openAdd() {
    const modal = this.nzModal.create({
      nzTitle: `新增大屏`,
      nzContent: AddScreenComponent,
      nzWidth: '600px',
      nzFooter: [
        {
          label: '取消',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: '新增',
          type: 'primary',
          autoLoading: true,
          onClick: i => {
            i.submitForm();
          },
        },
      ],
    });
    modal.afterClose.subscribe(() => {
      this.getScreenList(true);
    });
  }
  getScreenList(reset = false) {
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    const params = {
      spaceId: '111',
      curPage: this.page.curPage,
      pageSize: this.page.pageSize,
      totalPage: this.page.totalPage || '',
      totalRow: this.page.totalRow || '',
    };
    this.spaceManageService.getScreenList(params).subscribe(
      data => {
        this.dataSet = data['retList'];
        this.dataSet.forEach(value => {
          value.checked = false;
        });
        console.log(this.dataSet);
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
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }
  currentDataChange($event) {
    this.dataSet = $event;
    this.checkLine();
  }

  view() {}
  edit() {
    const modal = this.nzModal.create({
      nzTitle: `编辑大屏`,
      nzContent: EditScreenComponent,
      nzWidth: '600px',
      nzFooter: [
        {
          label: '取消',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: '确认',
          type: 'primary',
          autoLoading: true,
          onClick: i => {
            i.submitForm();
          },
        },
      ],
      nzComponentParams: {
        screenName: '紫金大屏',
        screenRemark: '测试',
      },
    });
  }
  public() {}
  copy() {}
  delete() {}
}
