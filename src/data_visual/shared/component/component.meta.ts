import { IComponentOption } from '../interface/file';
import { IGraphic } from '../core/graphic';
import { Type } from '../common';

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


