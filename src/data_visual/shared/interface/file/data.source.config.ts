export interface IDataSourceConfig {
  id: string;
  displayName: string;
  comment?: string;
  metaData: {
    dataType: string;
    dimensions?: Array<IDataSourceDimension>;
  },
  generatorPath: string;
  generatorParams: any;

  [key: string]: any;
}

export interface IDataSourceDimension {
  name: string;
  displayName?: string;
  comment?: string;
  type: 'number' | 'ordinal' | 'float' | 'int' | 'time';
}

