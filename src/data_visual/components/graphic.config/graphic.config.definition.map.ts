import { BarConfigComponent } from './chart/bar.config.component';
import { ImageConfigComponent } from './auxiliary/image.config.component';
import { LineConfigComponent } from './chart/line.config.component';
import { PieConfigComponent } from './chart/pie.config.component';
import { TextConfigComponent } from './auxiliary/text.config.component';
import { GaugeConfigComponent } from './chart/gauge.config.component';
import { RingConfigComponent } from './chart/ring.config.component';
import { MapConfigComponent } from './chart/map.config.component';
import { WordCloudConfigComponent } from './chart/word.cloud.config.component';

export const graphicConfigDefinitionMap = new Map();

graphicConfigDefinitionMap.set('image.graphic', ImageConfigComponent);
graphicConfigDefinitionMap.set('text.graphic', TextConfigComponent);
graphicConfigDefinitionMap.set('clock.graphic', TextConfigComponent);
graphicConfigDefinitionMap.set('table.graphic', WordCloudConfigComponent);
graphicConfigDefinitionMap.set('bar.chart.graphic', BarConfigComponent);
graphicConfigDefinitionMap.set('line.chart.graphic', LineConfigComponent);
graphicConfigDefinitionMap.set('lines.chart.graphic', LineConfigComponent);
graphicConfigDefinitionMap.set('pie.chart.graphic', PieConfigComponent);
graphicConfigDefinitionMap.set('flip.number.graphic', WordCloudConfigComponent);
graphicConfigDefinitionMap.set('gauge.chart.graphic', GaugeConfigComponent);
graphicConfigDefinitionMap.set('ring.chart.graphic', RingConfigComponent);
graphicConfigDefinitionMap.set('map.chart.graphic', MapConfigComponent);
graphicConfigDefinitionMap.set('wordCloud.chart.graphic', WordCloudConfigComponent);
