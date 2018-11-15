import { AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceManageService } from '../space-manage.service';
import { switchMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { PageRuntime } from '../../../../../data_visual/runtime/page.runtime';
import { Runtime } from '../../../../../data_visual/runtime/runtime';
import { session } from '../../../../../data_visual/designer/utils/session';

@Component({
  templateUrl: './screen-detail.html',
  styleUrls: ['./screen-detail.less'],
})
export class ScreenDetailComponent implements AfterViewInit, OnInit, OnDestroy {

  report: PageRuntime;
  screenName;
  remark;
  icon;
  dashBoardId;
  collectFlag;
  keepDashBoardId;
  spaceId: string;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _router: ActivatedRoute,
              private _nzMessage: NzMessageService,
              private _spaceManageService: SpaceManageService) {
  }

  ngOnInit() {
    this.spaceId = this._router.snapshot.parent.params.spaceId;

  }

  getReportContent() {
    const reportInfo$ = this._router.params.pipe(switchMap(data => {
      this.dashBoardId = data.screenId;
      return this._spaceManageService.getScreenInfo({
        dashboardId: data.screenId,
        spaceId: this.spaceId,
      });
    }));
    reportInfo$.subscribe(data => {
      // this.report.clear();
      this.screenName = data.name;
      this.remark = data.remark;
      this.icon = data.icon;
      this.collectFlag = data.keepFlag;
      if (data.keepDashBoardId) {
        this.keepDashBoardId = data.keepDashBoardId;
      }
      if (data.attr) {
        this.report = Runtime.getInstance().open(data.attr);
        $('.app-content').prepend(this.report.$element);
        // this.report.load(data.attr);
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
    this.getReportContent();
  }

  ngOnDestroy() {
    this.report.destroy();
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.scale = event;
  }

  collect() {
    const params = {
      keepDashBoardName: this.screenName,
      icon: this.icon,
      remark: this.remark,
      dashBoardId: this.dashBoardId,
    };
    this._spaceManageService.collectScreen(params).subscribe(data => {
      this._nzMessage.success('收藏大屏成功!');
      this.collectFlag = 'T';
      this.keepDashBoardId = data.keepDashBoardId;
    }, err => {
      if (err instanceof HttpResponse) {
        this._nzMessage.error(err.body.retMsg);
      }
    });
  }

  uncollect() {
    const params = {
      keepDashBoardId: this.keepDashBoardId,
    };
    this._spaceManageService.uncollectScreen(params).subscribe(
      data => {
        this.collectFlag = 'F';
        this._nzMessage.success('取消收藏成功!');
      }, err => {
        if (err instanceof HttpResponse) {
          this._nzMessage.error(err.body.retMsg);
        }
      },
    );

  }

}
