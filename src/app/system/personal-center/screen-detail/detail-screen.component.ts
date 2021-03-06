import { AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { PersonalCenterService } from '../personal-center.service';
import { Runtime } from '@data-studio/runtime';
import { StandardCompRepo } from '@data-studio/component/standard';
import { CustomCompRepo } from '@data-studio/component/custom';
import { mockGeneratorRepo } from '@data-studio/generator/mock';
import { standardGeneratorRepo } from '@data-studio/generator/standard';
import { IPage } from '@data-studio/shared';

@Component({
  templateUrl: './detail-screen.html',
  styleUrls: ['./detail-screen.less'],
})
export class DetailScreenComponent implements AfterViewInit, OnInit, OnDestroy {

  report: IPage;
  runTime;

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
  }

  ngOnInit() {

  }

  getReportContent() {
    const reportInfo$ = this._acRouter.params.pipe(switchMap(data => {
      this.keepDashBoardId = data.keepDashBoardId;
      this.dashboardId = data.dashBoardId;
      return this._personalService.getScreenInfo({
        dashBoardId: data.dashBoardId,
        keepDashBoardId: data.keepDashBoardId,
      });
    }));
    reportInfo$.subscribe(data => {

      this.screenName = data.name;
      this.remark = data.remark;
      this.icon = data.icon;
      this.spaceId = data.spaceId;

      if (data.attr !== null && data.attr !== '' && JSON.stringify(data.attr) !== '{}' && data.attr !== undefined) {
        if (this.runTime !== undefined) {
          this.report = this.runTime.open(data.attr);
          this.report.scale = 1.0;
        } else {
          this.runTime = Runtime.getInstance();
          this.runTime.addComponentRepository(StandardCompRepo);
          this.runTime.addComponentRepository(CustomCompRepo);
          this.runTime.addGeneratorRepository([standardGeneratorRepo, mockGeneratorRepo]);
          this.report = this.runTime.open(data.attr);
          this.report.scale = 1.0;
        }
        $('.app-content').empty();
        $('.app-content').prepend(this.report.element);
      } else {
        $('.app-content').empty();
        $('.app-content').prepend('<h1>该大屏尚未编辑!</h1>');
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
    // this.report.destroy();
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.scale = event / 100;
  }

  uncollect() {
    const params = {
      keepDashBoardId: this.keepDashBoardId,
    };
    this._personalService.uncollectScreen(params).subscribe(
      data => {
        this._nzMessage.success('取消收藏成功!');
        this._router.navigateByUrl('app/user/user-screen');
      }, err => {
        if (err instanceof HttpResponse) {
          this._nzMessage.error(err.body.retMsg);
        }
      },
    );
  }

}
