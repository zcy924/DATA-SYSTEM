import {
  AfterViewInit,
  Component, ElementRef, HostBinding, OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { draggableHeler } from '../../../../utils/draggable.helper';
import { fromEvent } from 'rxjs';
import { DataModel } from '../../../data/data.model.interface';
import { dataModelManager } from '../../../data/data.model.manager';
import { Destroyable } from '@barca/shared';


@Component({
  selector: 'app-dimension-area',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './dimension.area.component.html',
  styleUrls: ['./dimension.area.component.less'],
})
export class DimensionAreaComponent extends Destroyable implements AfterViewInit, OnDestroy {
  private _$element: JQuery;
  dataModel: DataModel;

  @HostBinding('class.dimension-area') dimensionArea = true;

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
    draggableHeler.dragInfo = item;
  }

  dragStartForDragBar(event: DragEvent) {
    const subscription = fromEvent(document, 'mousemove')
    /*.pipe(throttleTime(30))*/
      .subscribe((mouseEvent: MouseEvent) => {
        console.log(this._$element.offset());
        console.log(mouseEvent.pageX, mouseEvent.pageY);
        this._$element.height(Math.max(36, mouseEvent.pageY - this._$element.offset().top));
      });
    const mouseupHandler = () => {
      subscription.unsubscribe();
      document.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mouseup', mouseupHandler);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  toggleList(event: MouseEvent) {
    const dataModel = this.dataModel;
    if (dataModel) {
      dataModel.state.collapsedDimension = !dataModel.state.collapsedDimension;
      if (this.dataModel.state.collapsedDimension) {
        this._$element.find(`li[datamodelname='${dataModel.id}']`).hide();
      } else {
        this._$element.find(`li[datamodelname='${dataModel.id}']`).show();
      }
    }
  }

  ngOnDestroy() {
    this._elementRef = null;
    this._$element = null;
    this.destroy();
  }

}

