import {AfterViewInit, Component, ElementRef, KeyValueDiffers, OnInit, Type} from '@angular/core';

import * as _ from 'lodash';
import {filterExecutor} from '@core/filter/filter.executor';
import {session} from '@core/node/utils/session';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {switchMap} from 'rxjs/operators';
import {SpaceManageService} from '../../app/routes/system/space-manage/space-manage.service';
import {CommService} from '../service/comm.service';
import {designerStorage} from '../utils/designer.storage';

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

  constructor(private _elementRef: ElementRef, private _differs: KeyValueDiffers, private route: ActivatedRoute, private _service: CommService) {
    session.differs = _differs;
  }

  ngOnInit() {
    const url = this.route.snapshot.routeConfig.path;
    if (url == 'report-designer/:id') {
      this.report$ = this.route.paramMap.pipe(
        switchMap(params => {
          console.log(url);
          // (+) before `params.get()` turns the string into a number
          this.reportId = params.get('id');
          designerStorage.reportId = this.reportId;
          return this._service.qryReportContent({
            Report: {
              spaceId: localStorage.getItem('spaceID'),
              reportId: this.reportId,
            }
          });
        }),
      );
    } else {
      this.report$ = this.route.paramMap.pipe(
        switchMap(params => {
          console.log(url);
          // (+) before `params.get()` turns the string into a number
          this.reportId = params.get('id');
          designerStorage.reportId = this.reportId;
          return this._service.getScreenInfo({
            spaceId: localStorage.getItem('spaceID'),
            dashboardId: this.reportId,
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
