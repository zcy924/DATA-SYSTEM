import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpaceSquareService } from './space-square.service';
import { CreateSpaceComponent } from './component/create-sapce.component';
import { NzModalService } from 'ng-zorro-antd';
import { CreateNewpageComponent } from '../space-manage/component/report-manage/components/create-newpage.component';


@Component({
  selector: 'app-space-aquare',
  templateUrl: './space-square.html',
  styleUrls: ['./space-square.less'],
  providers: [SpaceSquareService, NzModalService],
})
export class SpaceSquareComponent implements OnInit {

  spaceArr = [];

  constructor(
    private router: Router,
    private spaceService: SpaceSquareService,
    private nzModel: NzModalService) {
    this.getList();
  }

  ngOnInit() {
  }

  openDetail(spaceId) {
    this.router.navigate(['app/square/' + spaceId]);
  }

  getList() {
    this.spaceService.getSpaceList({})
      .subscribe(res => {
        console.log(res);
        this.spaceArr = res['retList'];
      }, err => {
        console.log(err);
      });
  }

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
        this.getList();
      }
    });
  }


}

