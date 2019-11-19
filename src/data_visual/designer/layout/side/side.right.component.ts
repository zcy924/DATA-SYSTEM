import {
  AfterViewInit,
  Component, OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DesignerBodyComponent } from '../designer.body.component';
import { dataModelSelector } from '../../utils/data.model.selector';
import { dataModelManager } from '../../data/data.model.manager';
import { dataSourceConfigSetManager, Destroyable } from '@data-studio/shared';

@Component({
  selector: 'app-side-right',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './side.right.component.html',
  styleUrls: ['./side.right.component.less'],
})
export class SideRightComponent extends Destroyable implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(NgForm) ngForm: NgForm;

  modelName: string;

  constructor(
    private appBody: DesignerBodyComponent) {
    super();
  }

  ngOnInit() {
  }

  closeRightPanel() {
    this.appBody.closeRightPanel();
  }


  ngAfterViewInit() {
    dataModelManager.dataOptionSet = dataSourceConfigSetManager.getItem('space1');

    const subscription = dataModelManager.modelName$.subscribe((modelName) => {
      this.modelName = modelName;
    });

    this.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  /**
   * 切换当前激活Graphic组件的数据源
   * @param {MouseEvent} $event
   */
  switchDataModel($event: MouseEvent) {
    dataModelSelector.open($event, (modelID: string) => {
      dataModelManager.switchDataModel(modelID);
    });
  }

  ngOnDestroy() {

  }

}
