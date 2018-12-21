import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { CompanyManageService } from '../../company-manage.service';
import { Page } from '../../../../models/page';
import { AdminModalComponent } from './modal/admin-modal.component';
import { CreateSpaceComponent } from './modal/create-sapce.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-space-setting',
  templateUrl: './space-setting.html',
})
export class SpaceSettingComponent implements OnInit {
  loading = false;
  dataSet = [];
  page = new Page();
  key = '';

  constructor(
    private nzModel: NzModalService,
    private service: CompanyManageService,
    private message: NzMessageService,
  ) {}

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
    const params = {
      pageSize: this.page.pageSize,
      curPage: this.page.curPage,
      totalPage: this.page.totalPage,
      totalRow: this.page.totalRow,
    };
    this.service.getSpaceList(params).subscribe(
      res => {
        this.dataSet = res['retList'];
        this.page.totalRow = res['totalRow'];
        this.page.totalPage = res['totalPage'];
        this.dataSet.forEach(res => {
          res['user'] = [];
          if (res.userName && res.userNo) {
            const userNameList = res.userName.split(',');
            const userNoList = res.userNo.split(',');
            userNoList.forEach((value, index) => {
              res.user.push({
                userNo: value,
                userName: userNameList[index],
              });
            });
          }
        });
        this.loading = false;
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }

  // 修改空间管理员
  changeAdminModal(list, spaceId) {
    list.forEach(item => {
      item.checked = true;
    });
    const modal = this.nzModel.create({
      nzTitle: `修改管理员`,
      nzContent: AdminModalComponent,
      nzWidth: '40%',
      nzComponentParams: {
        admins: list,
        spaceId: spaceId,
      },
      nzOnOk: ref => {
        return new Promise(resolve => {
          ref.updateAdmins();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      if (res == 'ok') {
        this.getSpaceAndAdminList(true);
      }
    });
  }

  // 创建空间
  showCreateModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `新建${title}`,
      nzContent: CreateSpaceComponent,
      nzWidth: '50%',
      nzOnOk: res => {
        return new Promise(resolve => {
          res.createSpace();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        this.getSpaceAndAdminList(true);
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
    const params = {
      key: this.key,
      pageSize: this.page.pageSize,
      curPage: this.page.curPage,
      totalPage: this.page.totalPage,
      totalRow: this.page.totalRow,
    };
    this.service.searchFuzzySpaceList(params).subscribe(
      res => {
        this.dataSet = res['retList'];
        this.page.totalRow = res['totalRow'];
        this.page.totalPage = res['totalPage'];
        this.dataSet.forEach(res => {
          res['user'] = [];
          if (res.userName && res.userNo) {
            const userNameList = res.userName.split(',');
            const userNoList = res.userNo.split(',');
            userNoList.forEach((value, index) => {
              res.user.push({
                userNo: value,
                userName: userNameList[index],
              });
            });
          }
        });
        this.loading = false;
      },
      error => {
        if (error instanceof HttpResponse) {
          this.message.error(error.body.retMsg);
        }
      },
    );
  }
  delete(spname, spid) {
    const params = {
      spaceId: spid,
      spaceName: spname,
    };
    const modal = this.nzModel.confirm({
      nzTitle: '确认要删除该空间？',
      nzOnOk: () => {
        this.service.delSpace(params).subscribe(
          data => {
            modal.destroy();
            this.message.success('删除成功!');
            this.getSpaceAndAdminList(true);
          },
          err => {
            if (err instanceof HttpResponse) {
              this.message.error(err.body.retMsg);
            }
          },
        );
      },
    });
  }
}
