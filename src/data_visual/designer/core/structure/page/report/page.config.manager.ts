import { ComponentRef } from '@angular/core';
import { BasePageConfig, DefaultPageConfig, Destroyable } from '@data-studio/shared';
import { session } from '../../../../utils/session';
import { OpenMode } from './page.interface';

/**
 * 管理设计时或运行时的PageConfig
 */
export class PageConfigManager extends Destroyable {

  private _inner: BasePageConfig | ComponentRef<BasePageConfig>;

  constructor(private _mode: OpenMode) {
    super();
  }

  init() {
    // 根据使用模式确定使用哪种pageConfig
    switch (this._mode) {
      case 'design':
        this._inner = session.createPageConfig();
        break;
      case 'runtime':
        this._inner = new DefaultPageConfig();
        break;
    }

    this.onDestroy(() => {
      if (this._inner) {
        this._inner.destroy();
        this._inner = null;
      }
      this._mode = null;
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
    if (!(this._inner instanceof BasePageConfig)) {
      session.attachConfigViewRef(this._inner.hostView);
    }
  }

  hide() {

  }
}
