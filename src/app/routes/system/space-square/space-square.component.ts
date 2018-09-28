import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpaceSquareService } from './space-square.service';
import { CreateSpaceComponent } from './component/create-sapce.component';
import { NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'app-space-aquare',
  templateUrl: './space-square.html',
  styleUrls: ['./space-square.less'],
  providers: [SpaceSquareService,NzModalService],
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

  openDetail(id) {
    console.log(id);
    this.router.navigate(['app/square/' + id]);
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

  showModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `${title}`,
      nzContent: CreateSpaceComponent,
      nzWidth: '50%',
      nzStyle: {
        top: '10%'
      }
    });
  }

}

