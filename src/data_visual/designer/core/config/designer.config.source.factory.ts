import { session } from '../../utils/session';

import { ConfigSourceComponentRefManager } from './config.source.component.ref.manager';
import { graphicConfigDefinitionMap } from '../../../components/graphic.config/graphic.config.definition.map';
import { ConfigSourceComponent, IConfigSourceFactory, IConfigSourceOption, Type } from '@barca/shared';

/**
 * 设计时 配置源工厂
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

  getConfigSource({ graphicId, graphicKey, configOption }: IConfigSourceOption) {
    const configComponentDefinition: Type<ConfigSourceComponent> = graphicConfigDefinitionMap.get(graphicKey),
      configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(configComponentDefinition);

    configComponentRef.instance.importOption(configOption);
    ConfigSourceComponentRefManager.getInstance().add(graphicId, configComponentRef);

    return configComponentRef.instance.configSource;
  }
}

