import { IConfigSourceFactory } from '../../../../shared/core/config/config.source.factory';
import { session } from '../../../utils/session';
import { DesignGraphicConfig } from '../../../../shared/core/source/config.source/design.config.source';

import { GraphicConfigManager } from './graphic.config.manager';
import { graphicConfigDefinitionMap } from '../../../config/graphic.config.definition.map';
import { Type } from '../../../../shared/common/type';

export class DesignConfigSourceFactory implements IConfigSourceFactory {

  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new DesignConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  private constructor() {
  }

  getConfigSource({ graphicId, graphicKey, configOption }: { graphicId: string, graphicKey: string, configOption: any }) {
    const xxx: Type<DesignGraphicConfig> = graphicConfigDefinitionMap.get(graphicKey),
      configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(xxx);

    // 步骤四
    configComponentRef.instance.importOption(configOption);
    GraphicConfigManager.getInstance().add(graphicId, configComponentRef);


    return configComponentRef.instance.configSource;
  }
}

