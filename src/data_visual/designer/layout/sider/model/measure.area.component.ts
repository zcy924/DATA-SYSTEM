import {
  AfterViewInit,
  Component, ElementRef, HostBinding, OnDestroy,
} from '@angular/core';
import { draggableHelper } from '../../../utils/draggable.helper';
import { DataModel } from '../../../data/data.model.interface';
import { dataModelManager } from '../../../data/data.model.manager';
import { Destroyable } from '@barca/shared';

@Component({
  selector: 'app-measure-area',
  templateUrl: './measure.area.component.html',
  styleUrls: ['./measure.area.component.less'],
})
export class MeasureAreaComponent extends Destroyable implements AfterViewInit, OnDestroy {
  private _$element: JQuery;
  dataModel: DataModel;

  @HostBinding('class.measure-area') measureArea = true;

  constructor(private _elementRef: ElementRef) {
    super();
    this._$element = $(_elementRef.nativeElement);
    this.dataModel = dataModelManager.getDefaultDataset();
  }

  ngAfterViewInit() {
    const subscription = dataModelManager.currentDataModelObservable.subscribe((dataModel) => {
      this.dataModel = dataModel;
    });
    this.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  doDragStart(event: DragEvent, item) {
    event.dataTransfer
      .setData('Text', (<HTMLElement>event.target).getAttribute('fieldid'));
    draggableHelper.dragInfo = item;
  }

  toggleList(event: MouseEvent) {
    const dataModel = this.dataModel;
    if (dataModel) {
      this.dataModel.state.collapsedMeasure = !this.dataModel.state.collapsedMeasure;
      if (this.dataModel.state.collapsedMeasure) {
        this._$element.find(`li[datamodelname='${this.dataModel.id}']`).hide();
      } else {
        this._$element.find(`li[datamodelname='${this.dataModel.id}']`).show();
      }
    }
  }

  ngOnDestroy() {
    this._elementRef = null;
    this._$element = null;
    this.destroy();
  }

}

