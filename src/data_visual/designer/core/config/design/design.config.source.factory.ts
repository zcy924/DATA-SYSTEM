import {IConfigSourceFactory} from '../../../../shared/core/config/config.source.factory';
import {session} from '../../../utils/session';
import {DesignGraphicConfig} from '../../../../shared/core/source/config.source/design.config.source';

import {GraphicConfigManager} from './graphic.config.manager';
import {graphicConfigMap} from '../../../config/graphic.map';
import { Type } from '../../../../shared/interface/type';

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

  getConfigSource(configSourceOption: { graphicId: string, graphicKey: string, configOption: any }) {
    const {graphicId, graphicKey, configOption} = configSourceOption,
      xxx: Type<DesignGraphicConfig> = graphicConfigMap.get(graphicKey),
      configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(xxx);

    // 步骤四
    configComponentRef.instance.importOption(configOption);
    GraphicConfigManager.getInstance().add(graphicId, configComponentRef);


    return configComponentRef.instance.configSource;
  }
}


