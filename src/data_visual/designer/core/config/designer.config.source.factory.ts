import { session } from '../../utils/session';

import { GraphicConfigManager } from './graphic.config.manager';
import { graphicConfigDefinitionMap } from '../../../components/graphic.config/graphic.config.definition.map';
import { DesignerGraphicConfig, IConfigSourceFactory, Type } from '@barca/shared';

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

  getConfigSource({ graphicId, graphicKey, configOption }: { graphicId: string, graphicKey: string, configOption: any }) {
    const configComponentDefinition: Type<DesignerGraphicConfig> = graphicConfigDefinitionMap.get(graphicKey),
      configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(configComponentDefinition);

    configComponentRef.instance.importOption(configOption);
    GraphicConfigManager.getInstance().add(graphicId, configComponentRef);

    return configComponentRef.instance.configSource;
  }
}

