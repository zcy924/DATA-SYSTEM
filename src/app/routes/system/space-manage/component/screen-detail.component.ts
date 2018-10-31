import {AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit} from '@angular/core';
import {session} from '@core/node/utils/session';
import {ReportPageOuter} from '@core/node/page/report/page.outer';
import {ActivatedRoute} from '@angular/router';
import {SpaceManageService} from '../space-manage.service';
import {switchMap} from 'rxjs/operators';
import {HttpResponse} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  templateUrl: './screen-detail.html',
  styleUrls: ['./screen-detail.less'],
})
export class ScreenDetailComponent implements AfterViewInit, OnInit, OnDestroy {

  report: ReportPageOuter;
  screenName;
  remark;
  icon;
  dashBoardId;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _router: ActivatedRoute,
              private _nzMessage: NzMessageService,
              private _spaceManageService: SpaceManageService) {
    session.differs = _differs;
  }

  ngOnInit() {

  }

  getReportContent() {
    const reportInfo$ = this._router.params.pipe(switchMap(data => {
      this.dashBoardId = data.screenId;
      return this._spaceManageService.getScreenInfo({
        dashboardId: data.screenId,
        spaceId: localStorage.getItem('spaceID'),
      });
    }));
    reportInfo$.subscribe(data => {
      this.report.clear();
      this.screenName = data.name;
      this.remark = data.remark;
      this.icon = data.icon;
      if (data.attr) {
        this.report.load(data.attr);
      } else {
        this._nzMessage.warning('该大屏尚未编辑!');
      }
    }, err => {
      if (err instanceof HttpResponse) {
        this._nzMessage.error(err.body.retMsg);
      }
    });
  }

  ngAfterViewInit() {
    const report = this.report = session.currentPage = new ReportPageOuter('runtime');
    $('.app-content').prepend(report.$element);
    this.getReportContent();
  }

  ngOnDestroy() {
    this.report.destroy();
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.reportPage.scale = event;
  }

  collect() {
    const params = {
      keepDashBoardName: this.screenName,
      icon: this.icon,
      remark: this.remark,
      dashBoardId: this.dashBoardId
    }
    this._spaceManageService.collectScreen(params).subscribe(data => {
      this._nzMessage.success('收藏大屏成功!')
    }, err => {
      if (err instanceof HttpResponse) {
        this._nzMessage.error(err.body.retMsg);
      }
    })
  }

}
