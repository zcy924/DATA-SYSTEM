import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CompanyManageService } from '../../company-manage.service';
import { Page } from '../../../../../models/page';
import { AdminModalComponent } from './modal/admin-modal.component';
import { CreateSpaceComponent } from './modal/create-sapce.component';

@Component({
  selector: 'app-space-setting',
  templateUrl: './space-setting.html',
})

export class SpaceSettingComponent implements OnInit {

  loading = false;
  dataSet = [];
  page = new Page();
  key='';

  constructor(
    private nzModel: NzModalService,
    private service: CompanyManageService,
  ) {
  }

  ngOnInit() {
    this.getSpaceAndAdminList(true);
  }

  // 空间列表与管理员查询
  getSpaceAndAdminList(reset: boolean = false): void {
    if (!(this.key === '')) {
      this.searchFuzzy(reset);
      return;
    }
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
    this.service.getSpaceList(params).subscribe(res => {
      this.dataSet = res['retList'];
      this.page.totalRow = res['totalRow'];
      this.page.totalPage = res['totalPage'];
      this.dataSet.forEach(res => {
        if (res.userName !== null && res.userName.length > 0) {
          res['user'] = [];
          let userNameList = res.userName.split(',');
          let userNoList = res.userNo.split(',');
          userNoList.forEach((value, index) => {
            res.user.push({
              userNo: value,
              userName: userNameList[index],
            });
          });
        }
      });
      this.loading = false;
      });
  }

  // 修改空间管理员
  changeAdminModal(list, spaceId) {
    list.forEach(item => {
      item.checked = true;
    });
    const modal = this.nzModel.create({
      nzTitle: `修改管理员`,
      nzContent: AdminModalComponent,
      nzWidth: '50%',
      nzComponentParams: {
        admins: list,
        spaceId: spaceId,
      },
      nzOnOk: (ref) => {
        ref.updateAdmins();
        this.getSpaceAndAdminList(true);
      },
    });
  }

  // 创建空间
  showCreateModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `新建${title}`,
      nzContent: CreateSpaceComponent,
      nzWidth: '50%',
      nzOnOk: res => {
        res.createSpace();
      },
    });
    modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        // this.getList();
      }
    });
  }


  // 模糊查询空间列表与管理员
  searchFuzzy(reset: boolean = false): void {
    if (this.key === '') {
      this.getSpaceAndAdminList(reset);
      return;
    }
    if (reset) {
      this.page.curPage = 1;
    }
    this.loading = true;
    let params = {
      key: this.key,
      pageSize: this.page.pageSize,
      curPage: this.page.curPage,
      totalPage: this.page.totalPage,
      totalRow: this.page.totalRow,
    };
    this.service.searchFuzzySpaceList(params).subscribe(res => {
      this.dataSet = res['retList'];
      this.page.totalRow = res['totalRow'];
      this.page.totalPage = res['totalPage'];
      this.dataSet.forEach(res => {
        if (res.userName !== null && res.userName.length > 0) {
          res['user'] = [];
          let userNameList = res.userName.split(',');
          let userNoList = res.userNo.split(',');
          userNoList.forEach((value, index) => {
            res.user.push({
              userNo: value,
              userName: userNameList[index],
            });
          });
        }
      });
      this.loading = false;
    });
  }
}
