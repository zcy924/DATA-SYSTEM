import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { PlatformManageService } from '../platform-manage.service';

import { Page } from '../../../../models/page';
import { CreateCompanyComponent } from './create/create-company.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-companis-manage',
  templateUrl: './companis-manage.html',
})
export class CompanisManageComponent implements OnInit {
  loading = false;
  dataSet = [];
  page = new Page();

  constructor(
    private nzModel: NzModalService,
    private platformManageService: PlatformManageService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.searchData(true);
  }

  createCompany(title): void {
    const modal = this.nzModel.create({
      nzTitle: `${title}`,
      nzContent: CreateCompanyComponent,
      nzWidth: '50%',
      nzOnOk: ref => {
        ref.createCompany();
      },
    });
    modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        this.searchData();
      }
    });
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    let params = {
      pageSize: this.page.pageSize,
      curPage: this.page.curPage,
      totalPage: this.page.totalPage,
      totalRow: this.page.totalRow,
    };
    this.platformManageService.getCompanyList(params).subscribe(
      res => {
        console.log(res);
        this.dataSet = res['retList'];
        this.page.totalRow = res['totalRow'];
        this.page.totalPage = res['totalPage'];
        this.loading = false;
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }
}
