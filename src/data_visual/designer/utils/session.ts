import { ComponentRef, Type, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseConfigSourceComponent, BasePageConfig } from '@data-studio/shared';
import { ReportPage } from '../core/structure/page/report/page';
import { SideLeftComponent } from '../layout/side/side.left.component';
import { PageConfigComponent } from '../../components/page.config/page.config.component';

class Session {
  private _currentPage: ReportPage;
  sideLeftComponent: SideLeftComponent;
  page = new Subject();

  set currentPage(value: ReportPage) {
    this._currentPage = value;
    this.page.next(value.reportPage);
  }

  get currentPage() {
    return this._currentPage;
  }

  get currentPage$(): Observable<any> {
    return this.page.asObservable();
  }

  createPageConfig(): ComponentRef<BasePageConfig> {
    return this.sideLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
  }

  createGraphicConfig(configComponentDef: Type<BaseConfigSourceComponent>): ComponentRef<BaseConfigSourceComponent> {
    return this.sideLeftComponent.forwardCreateGraphicConfig(configComponentDef);
  }

  attachConfigViewRef(viewRef: ViewRef) {
    this.sideLeftComponent.attachDataProperty(viewRef);
  }
}

export const session = new Session();
