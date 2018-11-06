import { IComponentOption } from './component.option';

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
    dataSourceGeneratorRepositories: Array<string>;
  };
  main: {
    option: any;
    children: Array<IComponentOption>;
  };
  data?: Array<any>;
}


