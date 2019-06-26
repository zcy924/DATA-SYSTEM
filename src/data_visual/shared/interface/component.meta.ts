import { Type } from '../common/type';
import { IComponentOption } from '../file/component.option';
import { IGraphic } from '../core/graphic/graphic';


export interface IComponentMeta {
  key: string;
  paletteMeta?: IPaletteMeta;
  componentOption: IComponentOption;
  graphicDef: Type<IGraphic>;
}

export interface IPaletteMeta {
  show?: boolean;
  displayName?: string;
  imageClass?: string;
  grabOption?: {
    width: number,
    height: number,
    backgroundImage: string
  };
}


