import { ComponentRef } from '@angular/core';
import { BasePageConfig, Destroyable } from '@data-studio/shared';
import { PageConfigRuntime } from '@data-studio/runtime';
import { session } from '../../../../utils/session';
import { PageConfigComponent } from '../../../../../components/page.config/page.config.component';

export class PageConfigAgent extends Destroyable {

  private _inner: BasePageConfig | ComponentRef<BasePageConfig>;

  constructor(private _mode: 'design' | 'runtime') {
    super();
    // 根据使用模式确定使用哪种pageConfig
    switch (_mode) {
      case 'design':
        this._inner = session.sideLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        break;
      case 'runtime':
        this._inner = new PageConfigRuntime() as any;
        break;
    }
    this.onDestroy(() => {
      if (this._inner instanceof BasePageConfig) {
        this._inner.destroy();
        this._inner = null;
      } else {
        this._inner.destroy();
        this._inner = null;
      }
    });
  }

  get model(): BasePageConfig {
    if (this._inner instanceof BasePageConfig) {
      return this._inner;
    } else {
      return this._inner.instance;
    }
  }

  show() {
    if (this._inner instanceof BasePageConfig) {

    } else {
      session.sideLeftComponent.attachDataProperty(this._inner.hostView);
    }
  }

  hide() {

  }
}
