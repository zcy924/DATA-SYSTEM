import { session } from '../../utils/session';

import { ConfigSourceComponentRefManager } from './config.source.component.ref.manager';
import { graphicConfigDefinitionMap } from '../../../components/graphic.config/graphic.config.definition.map';
import { BaseConfigSourceComponent, IConfigSourceFactory, IConfigSourceOptionWrapper, Type } from '@data-studio/shared';

/**
 * 设计时 配置源工厂
 * 单例模式
 * 关闭一个页面时，该页面关联的数据源应当全部关闭
 */
export class DesignerConfigSourceFactory implements IConfigSourceFactory {

  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new DesignerConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  private constructor() {
  }

  /**
   * 新建配置源
   * @param instanceID
   * @param classID
   * @param configSourceOption
   */
  getConfigSource({ instanceID, classID, configSourceOption }: IConfigSourceOptionWrapper) {
    const configComponentDefinition: Type<BaseConfigSourceComponent> = graphicConfigDefinitionMap.get(classID),
      configSourceComponentRef = session.sideLeftComponent.forwardCreateGraphicConfig(configComponentDefinition);

    configSourceComponentRef.instance.importOption(configSourceOption);
    ConfigSourceComponentRefManager.getInstance().add(instanceID, configSourceComponentRef);

    return configSourceComponentRef.instance.configSource;
  }
}

