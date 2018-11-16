import {BarConfigComponent} from '../../components/graphic.config/chart/bar.config.component';
import {ImageConfigComponent} from '../../components/graphic.config/auxiliary/image.config.component';
import {LineConfigComponent} from '../../components/graphic.config/chart/line.config.component';
import {PieConfigComponent} from '../../components/graphic.config/chart/pie.config.component';
import {TextConfigComponent} from '../../components/graphic.config/auxiliary/text.config.component';
import {GaugeConfigComponent} from '../../components/graphic.config/chart/gauge.config.component';
import {RingConfigComponent} from '../../components/graphic.config/chart/ring.config.component';
import {MapConfigComponent} from '../../components/graphic.config/chart/map.config.component';
import {WordCloudConfigComponent} from '../../components/graphic.config/chart/word.cloud.config.component';

const map1 = new Map();
map1.set('bar.chart.graphic', BarConfigComponent);
map1.set('line.chart.graphic', LineConfigComponent);
map1.set('pie.chart.graphic', PieConfigComponent);
map1.set('lines.chart.graphic', LineConfigComponent);
map1.set('image.graphic', ImageConfigComponent);
map1.set('text.graphic', TextConfigComponent);
map1.set('clock.graphic', TextConfigComponent);
map1.set('table.graphic', WordCloudConfigComponent);
map1.set('flip.number.graphic', WordCloudConfigComponent);
map1.set('gauge.chart.graphic', GaugeConfigComponent);
map1.set('ring.chart.graphic', RingConfigComponent);
map1.set('map.chart.graphic', MapConfigComponent);
map1.set('wordCloud.chart.graphic', WordCloudConfigComponent);
export const graphicConfigMap = map1;