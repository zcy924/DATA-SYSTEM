import {AfterViewInit, Component, ElementRef, KeyValueDiffers, OnInit, Type} from '@angular/core';

import * as _ from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {switchMap} from 'rxjs/operators';
import {SpaceManageService} from '../../../app/routes/system/space-manage/space-manage.service';
import {CommService} from '../service/comm.service';
import {designerStorage} from '../../utils/designer.storage';
import { session } from '../utils/session';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.less'],
})
export class DesignerComponent implements AfterViewInit, OnInit {
  title = 'app';

  report$: Observable<any>;

  reportId: string;
  report: any;
  spaceId: string;
  dashboardId;

  constructor(private _elementRef: ElementRef, private _differs: KeyValueDiffers, private route: ActivatedRoute, private _service: CommService) {
    session.differs = _differs;
  }

  ngOnInit() {
    const url = this.route.snapshot.routeConfig.path;
    if (url == 'report-designer') {
      this.report$ = this.route.queryParams.pipe(
        switchMap(params => {
          // (+) before `params.get()` turns the string into a number
          this.reportId = params.reportId;
          this.spaceId = params.spaceId;
          designerStorage.reportId = this.reportId;
          return this._service.qryReportContent({
            Report: {
              spaceId: this.spaceId,
              reportId: this.reportId,
            }
          });
        }),
      );
    } else {
      this.report$ = this.route.queryParams.pipe(
        switchMap(params => {
          // (+) before `params.get()` turns the string into a number
          this.dashboardId = params.dashboardId;
          this.spaceId = params.spaceId;
          designerStorage.reportId = this.reportId;
          return this._service.getScreenInfo({
            spaceId: this.spaceId,
            dashboardId: this.dashboardId,
          });
        }),
      );
    }


    this.report$.subscribe((data) => {
      console.log('app-designer', data);
      designerStorage.reportInfo = data;
    });
    console.log('ngOnInit main');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit main');


  }
}
