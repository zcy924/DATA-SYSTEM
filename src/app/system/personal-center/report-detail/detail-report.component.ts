import { AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PersonalCenterService } from '../personal-center.service';
import { PageRuntime } from '@data-studio/runtime/lib/page.runtime';
import { Runtime } from '@data-studio/runtime';
import { StandardCompRepo } from '@data-studio/component/standard';
import { CustomCompRepo } from '@data-studio/component/custom';
import { mockGeneratorRepo } from '@data-studio/generator/mock';
import { standardGeneratorRepo } from '@data-studio/generator/standard';


@Component({
  templateUrl: './detail-report.html',
  styleUrls: ['./detail-report.less'],
})
export class DetailReportComponent implements AfterViewInit, OnInit, OnDestroy {

  keepReportId;

  report: PageRuntime;
  runTime;
  reportName;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _acRouter: ActivatedRoute,
              private _router: Router,
              private _personalService: PersonalCenterService,
              private _nzModel: NzModalService,
              private _nzMessage: NzMessageService) {
  }

  ngOnInit() {
  }

  getReportContent() {
    const reportInfo$ = this._acRouter.params.pipe(switchMap(data => {
      this.keepReportId = data.keepReportId;
      return this._personalService.getSelfReportInfo({
        reportId: data.reportId,
        keepReportId: data.keepReportId,
      });
    }));
    reportInfo$.subscribe(data => {
      this.reportName = data.reportName;

      if (data.attr !== null && data.attr !== '' && JSON.stringify(data.attr) !== '{}' && data.attr !== undefined) {
        if (this.runTime !== undefined) {
          this.report = this.runTime.open(data.attr);
        } else {
          this.runTime = Runtime.getInstance();
          this.runTime.addComponentRepository([StandardCompRepo, CustomCompRepo]);
          this.runTime.addGeneratorRepository([mockGeneratorRepo, standardGeneratorRepo]);
          this.report = this.runTime.open(data.attr);
        }
        $('.app-content').empty();
        $('.app-content').prepend(this.report.$element);
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
    // this.report.destroy();
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.scale = event / 100;
  }

  // 取消收藏报表对话框
  unKeepSelf() {
    this._nzModel.confirm({
      nzTitle: '是否取消收藏?',
      nzOnOk: res => {
        let params = {
          keepReportId: this.keepReportId,
        };
        this._personalService.delSelfReport(params).subscribe(
          res => {
            this._nzMessage.success('取消收藏成功！');
            this._router.navigateByUrl('app/user/user-report');
          },
          err => {
            if (err instanceof HttpResponse) {
              this._nzMessage.error('取消收藏失败！');
            }
          },
        );
      },
    });
  }
}
