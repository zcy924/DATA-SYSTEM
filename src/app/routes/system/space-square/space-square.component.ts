import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpaceSquareService } from './space-square.service';
import { CreateSpaceComponent } from './component/create-sapce.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { HttpResponse } from '@angular/common/http';

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
    private _spaceService: SpaceSquareService,
    private nzModel: NzModalService,
    public settings: SettingsService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.getList();
  }

  openDetail(spaceId, spaceType) {
    localStorage.setItem('spaceType', spaceType);
    this.router.navigate(['app/square/' + spaceId]);
  }

  getList() {
    this.public = [];
    this.onlyRead = [];
    this.onlyWrite = [];
    const params = { Space: { space_name: this.key || '' } };
    this._spaceService.getSpaceList(params).subscribe(
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
          this._spaceService.getLogo({ id: value.spaceId, idType: '1' })
            .subscribe(data=>{
              value.avatar = data.logo;
            });
        });
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
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
