import { Observable } from 'rxjs';
import { DataSourceConfig } from './data.source.config';
import { GeneratorRepositoryManager } from '@shared/manager/generator.repository.manager';


export class DataSourceFactory {

  private static _dataSourceFactory: DataSourceFactory;

  private _geneRepoManager: GeneratorRepositoryManager = GeneratorRepositoryManager.getInstance();
  // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
  // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。

  static getInstance() {
    if (!this._dataSourceFactory) {
      this._dataSourceFactory = new DataSourceFactory();
    }
    return this._dataSourceFactory;
  }

  private constructor() {
  }

  getDataSource(dataSourceConfig: DataSourceConfig): Observable<any> {
    if (dataSourceConfig) {
      const { generatorPath, generatorParams } = dataSourceConfig;
      if (this._geneRepoManager.has(generatorPath)) {
        return this._geneRepoManager
          .getDataSourceGeneratorByPath(generatorPath)
          .createDataSource(generatorParams);
      }
    }
  }
}


