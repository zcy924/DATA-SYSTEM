import * as _ from 'lodash';

interface GraphicMeta {
  region: {
    regionKey: string;
    regionOption?: any;
  };
  graphic: {
    graphicKey: string,
    configOption: any,
    dataSourceKey: string
  };
  regionOption?: any;
  grabOption?: {
    width: number,
    height: number,
    backgroundImage: string
  };
  displayName?: string;
  imageClass?: string;
}

interface GraphicMetaMap {
  [key: string]: GraphicMeta;
}
