import {AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit} from '@angular/core';
import {session} from '@core/node/utils/session';
import {ReportPageOuter} from '@core/node/page/report/page.outer';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {HttpResponse} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd";
import {PersonalCenterService} from "../../personal-center.service";

@Component({
  templateUrl: './detail-screen.html',
  styleUrls: ['./detail-screen.less'],
})
export class DetailScreenComponent implements AfterViewInit, OnInit, OnDestroy {

  report: ReportPageOuter;
  screenName;
  remark;
  icon;
  keepDashBoardId;
  spaceId;
  dashboardId;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _acRouter: ActivatedRoute,
              private _router: Router,
              private _nzMessage: NzMessageService,
              private _personalService: PersonalCenterService) {
    session.differs = _differs;
  }

  ngOnInit() {

  }

  getReportContent() {
    const reportInfo$ = this._acRouter.params.pipe(switchMap(data => {
      this.keepDashBoardId = data.keepDashBoardId;
      this.dashboardId = data.dashBoardId;
      return this._personalService.getScreenInfo({
        dashBoardId: data.dashBoardId,
        keepDashBoardId: data.keepDashBoardId
      });
    }));
    reportInfo$.subscribe(data => {
      this.report.clear();
      this.screenName = data.name;
      this.remark = data.remark;
      this.icon = data.icon;
      this.spaceId = data.spaceId;
      localStorage.setItem('spaceID',this.spaceId);
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

  uncollect() {
    const params = {
      keepDashBoardId: this.keepDashBoardId
    }
    this._personalService.uncollectScreen(params).subscribe(
      data => {
        this._nzMessage.success('取消收藏成功!');
        this._router.navigateByUrl('app/user/user-screen');
      }, err => {
        if (err instanceof HttpResponse) {
          this._nzMessage.error(err.body.retMsg);
        }
      }
    )
  }

}
