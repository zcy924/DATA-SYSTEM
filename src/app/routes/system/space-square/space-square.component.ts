import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpaceSquareService } from './space-square.service';
import { CreateSpaceComponent } from './component/create-sapce.component';
import { NzModalService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-space-aquare',
  templateUrl: './space-square.html',
  styleUrls: ['./space-square.less'],
  providers: [SpaceSquareService, NzModalService],
})
export class SpaceSquareComponent implements OnInit {
  spaceArr = [];
  key;
  onlyRead = [];
  onlyWrite = [];
  public = [];

  constructor(
    private router: Router,
    private spaceService: SpaceSquareService,
    private nzModel: NzModalService,
    public settings: SettingsService,
  ) {}

  ngOnInit() {
    this.getList();
  }

  openDetail(spaceId, spaceType) {
    localStorage.setItem('spaceID', spaceId);
    localStorage.setItem('spaceType', spaceType);
    this.router.navigate(['app/square/' + spaceId]);
  }

  getList() {
    this.public = [];
    this.onlyRead = [];
    this.onlyWrite = [];
    const params = { Space: { space_name: this.key || '' } };
    this.spaceService.getSpaceList(params).subscribe(
      res => {
        console.log(res);
        this.spaceArr = res['retList'];
        this.spaceArr.forEach(value => {
          if (value.sign === 'public') {
            this.public.push(value);
          } else if (value.sign === 'not_admin') {
            this.onlyRead.push(value);
          } else {
            this.onlyWrite.push(value);
          }
        });
      },
      err => {
        console.log(err);
      },
    );
  }

  showCreateModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `新建${title}`,
      nzContent: CreateSpaceComponent,
      nzWidth: '50%',
      nzOnOk: res => {
        return new Promise(reslove => {
          res.createSpace();
        });
      },
    });
    modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        this.getList();
      }
    });
  }
}
