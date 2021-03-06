import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';

import { CommService } from '../service/comm.service';
import { designerStorage } from '../utils/designer.storage';

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

  constructor(
    private _elementRef: ElementRef,
    private _route: ActivatedRoute,
    private _service: CommService) {
  }

  ngOnInit() {
    const url = this._route.snapshot.routeConfig.path;
    if (url == 'report-designer') {
      this.report$ = this._route.queryParams.pipe(
        switchMap(params => {
          this.reportId = params.reportId;
          this.spaceId = params.spaceId;
          designerStorage.reportId = this.reportId;
          return this._service.qryReportContent({
            Report: {
              spaceId: this.spaceId,
              reportId: this.reportId,
            },
          });
        }),
      );
    } else {
      this.report$ = this._route.queryParams.pipe(
        switchMap(params => {
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
      designerStorage.reportInfo = data;
    });
  }

  ngAfterViewInit() {
  }
}
