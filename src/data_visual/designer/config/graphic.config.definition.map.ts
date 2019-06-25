import { BarConfigComponent } from '../../components/graphic.config/chart/bar.config.component';
import { ImageConfigComponent } from '../../components/graphic.config/auxiliary/image.config.component';
import { LineConfigComponent } from '../../components/graphic.config/chart/line.config.component';
import { PieConfigComponent } from '../../components/graphic.config/chart/pie.config.component';
import { TextConfigComponent } from '../../components/graphic.config/auxiliary/text.config.component';
import { GaugeConfigComponent } from '../../components/graphic.config/chart/gauge.config.component';
import { RingConfigComponent } from '../../components/graphic.config/chart/ring.config.component';
import { MapConfigComponent } from '../../components/graphic.config/chart/map.config.component';
import { WordCloudConfigComponent } from '../../components/graphic.config/chart/word.cloud.config.component';

export const graphicConfigDefinitionMap = new Map();

graphicConfigDefinitionMap.set('bar.chart.graphic', BarConfigComponent);
graphicConfigDefinitionMap.set('line.chart.graphic', LineConfigComponent);
graphicConfigDefinitionMap.set('pie.chart.graphic', PieConfigComponent);
graphicConfigDefinitionMap.set('lines.chart.graphic', LineConfigComponent);
graphicConfigDefinitionMap.set('image.graphic', ImageConfigComponent);
graphicConfigDefinitionMap.set('text.graphic', TextConfigComponent);
graphicConfigDefinitionMap.set('clock.graphic', TextConfigComponent);
graphicConfigDefinitionMap.set('table.graphic', WordCloudConfigComponent);
graphicConfigDefinitionMap.set('flip.number.graphic', WordCloudConfigComponent);
graphicConfigDefinitionMap.set('gauge.chart.graphic', GaugeConfigComponent);
graphicConfigDefinitionMap.set('ring.chart.graphic', RingConfigComponent);
graphicConfigDefinitionMap.set('map.chart.graphic', MapConfigComponent);
graphicConfigDefinitionMap.set('wordCloud.chart.graphic', WordCloudConfigComponent);
