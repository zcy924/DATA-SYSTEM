import { BasePageConfigComponent, Destroyable } from '@barca/shared';
import { ComponentRef } from '@angular/core';
import { session } from '../../../../utils/session';
import { PageConfigComponent } from '../../../../../components/page.config/page.config.component';
import { PageConfigRuntime } from '../../../../../runtime/page.config.runtime';

export class PageConfig extends Destroyable {

  private _inner: BasePageConfigComponent | ComponentRef<BasePageConfigComponent>;

  constructor(private _mode: 'design' | 'runtime') {
    super();
    switch (_mode) {
      case 'design':
        this._inner = session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);
        break;
      case 'runtime':
        this._inner = new PageConfigRuntime() as any;
        break;
    }
    this.onDestroy(() => {
      if (this._inner instanceof BasePageConfigComponent) {
        this._inner.destroy();
        this._inner = null;
      } else {
        this._inner.destroy();
        this._inner = null;
      }
    });
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
}
