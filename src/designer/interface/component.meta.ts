import { IPaletteItemMeta } from './palette.item.meta';
import { IComponentOption } from './file/component.option';
import { Type } from './type';
import { IGraphic } from '@core/node/graphic/graphic';

interface IComponentMeta {
  paletteMeta: IPaletteItemMeta;
  componentOption: IComponentOption;
  graphicDef: Type<IGraphic>;
}
