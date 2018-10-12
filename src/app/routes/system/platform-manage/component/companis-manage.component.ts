import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CreateCompanyComponent } from './create/create-company.component';
import { PlatformManageService } from '../platform-manage.service';
import { logging } from 'selenium-webdriver';
import getLevel = logging.getLevel;
import { Router } from '@angular/router';

@Component({
  selector: 'app-companis-manage',
  templateUrl: './companis-manage.html',
})

export class CompanisManageComponent implements OnInit {

  loading = true;
  dataSet = [];
  pageIndex = 1;
  pageSize = 5;
  total = 100;

  constructor(
    private nzModel: NzModalService,
    private platformManageService: PlatformManageService) {}

  ngOnInit() {
    this.searchData(true);
  }

  showModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `${title}`,
      nzContent: CreateCompanyComponent,
      nzWidth: '50%',
      nzOnOk: (ref) => {
        console.log(ref.data);
        ref.createCompany();
        this.searchData(true);
      },
    });
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    let params = {
      start: this.pageIndex,
      limit: this.pageSize,
    };
    this.platformManageService.getCompanyList(params)
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        this.dataSet = res['retList'];
        this.total = this.dataSet.length;
      }, err => {
        console.log(err);
      });
  }

}
