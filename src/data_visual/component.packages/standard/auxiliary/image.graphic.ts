import { Observable, Subscription } from 'rxjs';
import { ImageAuxiliary } from './graphic.view/image.auxiliary';
import { DefaultGraphic } from '@barca/shared/core/graphic/default.graphic';

const template = `
<div class="graphic m-graphic m-graphic-image">
  <div class="frame"
  style="border: 0px solid rgb(204, 204, 204); background-color: rgba(255, 255, 255, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class ImageGraphic extends DefaultGraphic {
  $element: JQuery;

  constructor() {
    super();
    this.$element = $(template);
  }

  init(region: any) {
    this._view = new ImageAuxiliary(this);
    this.$element.find('.frame').append(this._view.$element);

    const $frame = this.$element.find('.frame');
    this._modelEventTarget
      .register('add.borderRadius borderRadius', (key, oldValue, newValue) => {
        $frame.css({
          'borderRadius': newValue,
        });
      }).register('add.borderWidth borderWidth', (key, oldValue, newValue) => {
      $frame.css({
        'borderWidth': newValue,
      });
    }).register('add.borderColor borderColor', (key, oldValue, newValue) => {
      $frame.css({
        'borderColor': newValue,
      });
    }).register('add.borderStyle borderStyle', (key, oldValue, newValue) => {
      $frame.css({
        'borderStyle': newValue,
      });
    }).register('add.backgroundColor backgroundColor', (key, oldValue, newValue) => {
      $frame.css({
        'backgroundColor': newValue,
      });
    }).register('add.image image', (key, oldValue, newValue) => {
      if (this._view && newValue && newValue.dataUrl) {
        region.setDimensions && region.setDimensions(newValue.width, newValue.height);
        this._view.update(newValue);
      }
    });
  }

  accept(modelSource: Observable<any>): Subscription {
    let lastConfig;
    return modelSource.subscribe((modelArray: Array<any>) => {
      console.log('model change');
      const [config, data] = modelArray;
      if (!!config && config !== lastConfig) {
        this._modelEventTarget.trigger(config);
        lastConfig = config;
      }
    });
  }

  private _initForUpdate() {

  }

}