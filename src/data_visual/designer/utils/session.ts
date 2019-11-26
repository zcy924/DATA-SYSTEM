import { ComponentRef, Type, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseConfigSourceComponent, BasePageConfig } from '@data-studio/shared';
import { ReportPage } from '../core/structure/page/report/page';
import { SideLeftComponent } from '../layout/side/side.left.component';
import { PageConfigComponent } from '../../components/page.config/page.config.component';
import { delay } from 'rxjs/operators';

class Session {
  private _currentPage: ReportPage;
  sideLeftComponent: SideLeftComponent;
  page = new Subject();

  private _localTemplateKey = '_localTemplateKey';
  private _localTemplateChangeSubject = new Subject();

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

  addLocalTemplate(name, option) {
    if (option) {
      const array = this.getTotalLocalTemplate();
      array.push({
        name, option,
      });
      localStorage.setItem(this._localTemplateKey, JSON.stringify(array));
      this._localTemplateChangeSubject.next(true);
    }
  }

  deleteLocalTemplate(name: string) {
    if (name) {
      const array = this.getTotalLocalTemplate();
      localStorage.setItem(this._localTemplateKey, JSON.stringify(array.filter(value => value.name !== name)));
      this._localTemplateChangeSubject.next(true);
    }
  }

  getTotalLocalTemplate() {
    const str = localStorage.getItem(this._localTemplateKey);
    try {
      return !!str ? JSON.parse(str) : [];
    } catch (e) {
      console.error(e);
      localStorage.removeItem(this._localTemplateKey);
      return [];
    }

  }

  localTemplateChange$() {
    return this._localTemplateChangeSubject.asObservable().pipe(delay(100));
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
