import { Type } from './type';
import { IComponentOption } from '../shared/file/component.option';
import { IGraphic } from '@core/node/graphic/graphic';

export interface IComponentMeta {
  key: string;
  paletteMeta?: IPaletteMeta;
  componentOption?: IComponentOption;
  graphicDef?: Type<IGraphic>;
}

export interface IPaletteMeta {
  displayName: string;
  imageClass?: string;
  grabOption?: {
    width: number,
    height: number,
    backgroundImage: string
  };
}

