import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { session } from '../../utils/session';
import { Destroyable } from '@data-studio/shared';
import { clipboard } from '../../utils/clipboard';


@Component({
  selector: 'app-local-template',
  templateUrl: './local.template.component.html',
  styleUrls: ['./local.template.component.less'],
})
export class LocalTemplateComponent extends Destroyable implements AfterViewInit, OnDestroy {
  list: Array<any> = [];

  constructor() {
    super();
  }

  copy(option) {
    clipboard.saveData(option);
  }

  deleteItem(name) {
    session.deleteLocalTemplate(name);
  }

  ngAfterViewInit() {
    this.list = session.getTotalLocalTemplate();
    const subscription = session.localTemplateChange$().subscribe(() => {
      this.list = session.getTotalLocalTemplate();
    });
    this.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }
}

