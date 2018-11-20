import { Component, OnInit } from '@angular/core';
import { SpaceManageService } from '../../space-manage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'space-info.html',
  styleUrls: ['space-info.less'],
})

export class SpaceInfoComponent implements OnInit {
  spaceId;
  spaceInfo;

  constructor(private _spaceService: SpaceManageService,
              private _router: ActivatedRoute) {
  }

  ngOnInit() {
    this.spaceId = this._router.snapshot.parent.params.spaceId;
    this.getSpaceInfo();
  }

  getSpaceInfo() {
    this._spaceService.qrySpaceInfo({ spaceId: this.spaceId }).subscribe(data => {
      this.spaceInfo = data;
    });
  }
}
