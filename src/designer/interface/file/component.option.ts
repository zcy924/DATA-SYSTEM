import { IRegionOption } from './region.option';

export interface IComponentOption {
  region: {
    regionKey: string;
    regionOption: IRegionOption;
  };
  graphic: {
    graphicKey: string;
    configOption: any;
    dataSourceKey: string;
  }
}
