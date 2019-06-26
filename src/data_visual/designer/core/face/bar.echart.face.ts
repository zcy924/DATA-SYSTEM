import {BarConfigComponent} from '../../../components/graphic.config/chart/bar.config.component';
import { EchartFace } from './echart.face';

export class BarEchartFace extends EchartFace {
  configClass = BarConfigComponent;

  constructor(host: HTMLElement) {
    super(host);
  }

  destroy() {
    delete this.configClass;
    super.destroy();
  }
}
