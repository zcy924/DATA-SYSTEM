import { AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpResponse } from "@angular/common/http";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PersonalCenterService } from '../personal-center.service';
import { ReportPageOuter } from '../../../../../data_visual/designer/core/page/report/page.outer';
import { session } from '../../../../../data_visual/designer/utils/session';
import { Runtime } from '../../../../../data_visual/runtime';
import { StandardCompRepo } from '../../../../../data_visual/component.packages/standard';
import { CustomCompRepo } from '../../../../../data_visual/component.packages/custom';
import { standardGeneratorRepo } from '../../../../../data_visual/data.source.packages/mock';
import { PageRuntime } from '../../../../../data_visual/runtime/page.runtime';


@Component({
  templateUrl: './detail-report.html',
  styleUrls: ['./detail-report.less'],
})
export class DetailReportComponent implements AfterViewInit, OnInit, OnDestroy {

  keepReportId;

  report: PageRuntime;
  reportName;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _acRouter: ActivatedRoute,
              private _router: Router,
              private _personalService:PersonalCenterService,
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
        keepReportId: data.keepReportId
      });
    }));
    reportInfo$.subscribe(data => {
      this.reportName = data.reportName;

      if (data.attr) {
        const runtime = Runtime.getInstance();
        runtime.addComponentRepository(StandardCompRepo);
        runtime.addComponentRepository(CustomCompRepo);
        runtime.addGeneratorRepository(standardGeneratorRepo);
        this.report = runtime.open(data.attr);
        $('.app-content').prepend(this.report.$element);
        // this.report.load(data.attr);
      } else {
        this._nzMessage.warning('该大屏尚未编辑!');
      }
    },err=>{
      if(err instanceof HttpResponse){
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
