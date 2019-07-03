import { BasePageConfigComponent } from '@barca/shared';
import { ComponentRef } from '@angular/core';
import { session } from '../../../../utils/session';
import { PageConfigComponent } from '../../../../../components/page.config/page.config.component';
import { PageConfigRuntime } from '../../../../../runtime/page.config.runtime';

export class PageConfig {

  private _inner: BasePageConfigComponent | ComponentRef<BasePageConfigComponent>;

  constructor(private _mode: 'design' | 'runtime') {
    switch (_mode) {
      case 'design':
        this._inner = session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        break;
      case 'runtime':
        this._inner = new PageConfigRuntime() as any;
        break;
    }
  }

  get model(): BasePageConfigComponent {
    if (this._inner instanceof BasePageConfigComponent) {
      return this._inner;
    } else {
      return this._inner.instance;
    }
  }

  show() {
    if (this._inner instanceof BasePageConfigComponent) {

    } else {
      session.siderLeftComponent.attachDataProperty(this._inner.hostView);
    }
  }

  hide() {

  }

  destroy() {
    if (this._inner instanceof BasePageConfigComponent) {
    } else {
      this._inner.destroy();
      this._inner = null;
    }
  }
}
