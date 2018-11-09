import { ReportPageInner } from '@core/node/page/report/page.inner';
import { session } from '@core/node/utils/session';
import { PageConfigComponent } from '../../../../components/page.config/page.config.component';
import { graphicFactory } from '@core/node/factory/graphic.factory';
import { ComponentRef } from '@angular/core';
import { PageConfig } from '../../../../components/page.config/page.config';
import { IReportPage } from '@core/node/page/report/page.interface';
import { ReportPage } from '@core/node/page/report/page';
import { RuntimePageConfig } from '../../../../components/page.config/runtime.page.config';
import { RegionController } from '@core/node/region/region.controller';
import * as _ from 'lodash';

export class PageConfigWrapper {

  private _inner: ComponentRef<PageConfig> | PageConfig;

  constructor(mode: 'design' | 'runtime') {
    switch (mode) {
      case 'design':
        this._inner = session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        break;
      case 'runtime':
        this._inner = new RuntimePageConfig();
        break;
    }
  }

  get model(): PageConfig {
    if (this._inner instanceof PageConfig) {
      return this._inner;
    } else {
      return this._inner.instance;
    }
  }

  show() {
    if (this._inner instanceof PageConfig) {

    } else {
      session.siderLeftComponent.attachDataProperty(this._inner.hostView);
    }
  }

  hide() {

  }

  destroy() {
    if (this._inner instanceof PageConfig) {
    } else {
      this._inner.destroy();
      this._inner = null;
    }
  }
}


export class ReportPageOuter {

  private _pageInner: ReportPageInner;
  private _page: IReportPage;

  constructor(mode: 'design' | 'runtime') {
    this._pageInner = new ReportPageInner(mode);
    this._pageInner.init();
    this._page = new ReportPage(this._pageInner);
  }

  get mode(): 'design' | 'runtime' {
    return this._pageInner.mode;
  }

  get $element() {
    return this._pageInner.view.$element;
  }

  offset() {
    return this._pageInner.view.offset();
  }

  get reportPage(): IReportPage {
    return this._page;
  }

  get actionManager() {
    return this._pageInner.actionManager;
  }

  load(option: any) {
    this._pageInner.pageConfigWrapper.model.importOption(option.option);
    option.children.forEach((value) => {
      graphicFactory.paste(value);
    });
  }

  save() {
    const main = {
      option: this._pageInner.pageConfigWrapper.model.exportOption(),
      children: this._pageInner.regionManager.saveAs(),
    };
    let keys = _.uniq(main.children.map((value, index, array) => {
      return value.graphic.dataSourceKey;
    }));
    console.log(JSON.stringify(keys));
    keys = this._pageInner.dataSourceManager.getDependencies(keys);
    return {
      dependencies: {
        generatorRepositories: keys,
      },
      main,
    };
  }

  clear() {
    this._pageInner.regionManager.regionArray.forEach((value: RegionController) => {
      value.destroy();
    });
  }

  enterFullScreen() {
    this._pageInner.view.enterFullScreen();
  }

  destroy() {
    if (this._page) {
      this._page.destroy();
      this._page = null;
    }
  }

}
