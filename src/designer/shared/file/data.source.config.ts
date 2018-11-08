import { Dimension } from '../../core/data/data.model.interface';

export interface IDataSourceConfig {
  id: string;
  displayName: string;
  comment?: string;
  metaData: {
    dataType: string;
    dimensions?: Array<Dimension>;
  },
  generatorPath: string;
  generatorParams: any;
  [key: string]: any;
}
