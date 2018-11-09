import { IComponentOption } from './component.option';
import { IDataSourceConfig } from './data.source.config';

export interface IFileStructure {
  name: string;
  manifest: {
    version: string;
    vendor: {
      id: string;
      name: string;
    };
    designer: {
      version: string;
    };
  };
  dependencies: {
    componentRepositories: Array<string>;
    generatorRepositories: Array<string>;
  };
  main: {
    option: any;
    children: Array<IComponentOption>;
  };
  data?: Array<IDataSourceConfig>;
}


