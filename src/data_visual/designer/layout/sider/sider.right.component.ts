import {
  AfterViewInit,
  Component, OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DesignerBodyComponent } from '../designer.body.component';
import { dataModelList } from '../../utils/dataModel';
import { HttpClient } from '@angular/common/http';
import { dataModelManager } from '../../data/data.model.manager';
import { DataSourceConfigSetManager } from '../../data/data.source.config.set.manager';
import { Destroyable } from '@barca/shared';

@Component({
  selector: 'app-sider-right',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sider.right.component.html',
  styleUrls: ['./sider.right.component.less'],
})
export class SiderRightComponent extends Destroyable implements AfterViewInit, OnInit, OnDestroy {

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
    dataModelManager.dataOptionSet = DataSourceConfigSetManager.getInstance().getItem('space1');

    const subscription = dataModelManager.modelNameObservable.subscribe((modelName) => {
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
    dataModelList.open($event, (modelID: string) => {
      dataModelManager.switchDataModel(modelID);
    });
  }

  ngOnDestroy() {

  }

}
