import {
  BaseConfigSourceComponent,
  Destroyable,
  IConfigSourceFactory,
  IConfigSourceOptionWrapper,
  Type,
} from '@data-studio/shared';
import { session } from '../../utils/session';
import { graphicConfigDefinitionMap } from '../../../components/graphic.config/graphic.config.definition.map';

/**
 * 设计时 配置源工厂
 * 单例模式
 * 关闭一个页面时，该页面关联的配置源应当全部关闭
 */
export class DesignerConfigSourceFactory extends Destroyable implements IConfigSourceFactory {
  constructor(private _configSourceComponentRefManager) {
    super();
    this.onDestroy(() => {
      this._configSourceComponentRefManager = null;
    });
  }

  /**
   * 新建配置源
   * @param instanceID
   * @param classID
   * @param configSourceOption
   */
  getConfigSource({ id, classID, configSourceOption }: IConfigSourceOptionWrapper) {
    const configComponentDefinition: Type<BaseConfigSourceComponent> = graphicConfigDefinitionMap.get(classID),
      configSourceComponentRef = session.createGraphicConfig(configComponentDefinition);

    configSourceComponentRef.instance.importOption(configSourceOption);
    this._configSourceComponentRefManager.add(id, configSourceComponentRef);

    return configSourceComponentRef.instance.config$;
  }
}

