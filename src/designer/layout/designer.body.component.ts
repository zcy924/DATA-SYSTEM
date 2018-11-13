import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {session} from '@core/node/utils/session';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import * as _ from 'lodash';
import {grabHelper} from './designer.header.component';
import {ReportPageOuter} from '@core/node/page/report/page.outer';
import { ComponentRepositoryManager } from '@shared/manager/component.repository.manager';

@Component({
  selector: 'app-designer-body',
  templateUrl: './designer.body.component.html',
  styleUrls: ['./designer.body.component.less']
})
export class DesignerBodyComponent implements AfterViewInit {

  report: ReportPageOuter;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef) {

  }

  openRightPanel() {
    $(this._elementRef.nativeElement).find('.app-body-right')[0].style.width = '420px';
    $(this._elementRef.nativeElement).find('.app-body-right')[0].style.flexBasis = '420px';
  }

  closeRightPanel() {
    $(this._elementRef.nativeElement).find('.app-body-right')[0].style.width = '220px';
    $(this._elementRef.nativeElement).find('.app-body-right')[0].style.flexBasis = '220px';
  }

  dragstart(dragEvent: DragEvent) {
    const mouseMove = (event: MouseEvent) => {
      console.log('mouseMove');
      grabHelper.refresh(event.pageX, event.pageY);
    };
    const mouseUp = (event: MouseEvent) => {
      console.log('document mouseup', event, session.currentPage.offset());

      graphicFactory.createByName(componentPath, session.currentPage,
        event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
        event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
      grabHelper.hidden();
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    let componentPath: string;
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    componentPath = (<HTMLElement>dragEvent.target).getAttribute('componentPath');

    grabHelper.show(dragEvent.pageX, dragEvent.pageY, ComponentRepositoryManager.getInstance().getComponentMeta(componentPath).grabOption);
    return false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const report = this.report = session.currentPage = new ReportPageOuter('design');
      $('.app-content').prepend(report.$element);
    }, 10);

    // const runtime = new Runtime($('.app-content')[0]);
    //
    // runtime.loadPage(aaa);
    // const dashboardCanvas = new DashboardCanvas();
    // $('.app-content').prepend(dashboardCanvas.$element);


    return;
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.reportPage.scale = event;
  }

}
