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

export interface Dimension {
  name: string;
  displayName?: string;
  comment?: string;
  type: 'number' | 'ordinal' | 'float' | 'int' | 'time';
}

