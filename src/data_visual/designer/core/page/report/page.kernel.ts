import { IPage } from '../../interface';
import { BasePageConfig } from '../../../../shared/core/page/page.config';
import { clipboard } from '../../../utils/clipboard';
import { ISelectManager, SelectManager } from '../../manager/select.manager';
import { RegionManager } from '../../manager/region.manager';
import { ActivateManager } from '../../manager/activate.manager';
import { ConfigSourceManager } from '../../config/config.source.manager';
import { dataOptionManager } from '../../../data/data.source.config.manager';
import { DataSourceManager } from '../../../../shared/core/data/data.source.manager';
import { GeneratorRepositoryManager } from '../../../../shared/repository/generator.repository.manager';
import { ComponentRepositoryManager } from '../../../../shared/repository/component.repository.manager';
import { graphicFactory } from '../../graphic/graphic.factory';
import { ActionManager } from '../../operate/action.manager';
import { PageConfig } from './page.outer';
import { PageView } from './page.view';
import { StandardCompRepo } from '../../../../component.packages/standard/main';
import { CustomCompRepo } from '../../../../component.packages/custom/main';
import { standardGeneratorRepo } from '../../../../data.source.packages/mock/main';

export class ReportPageKernel implements IPage {

  public pageConfig: PageConfig;
  public view: PageView;

  // manager
  public regionManager: RegionManager;
  public selectManager: ISelectManager;
  public activateManager: ActivateManager;

  public configSourceManager: ConfigSourceManager;
  public dataSourceManager: DataSourceManager;
  public actionManager: ActionManager;

  public compRepoManager = ComponentRepositoryManager.getInstance();
  public geneRepoManager = GeneratorRepositoryManager.getInstance();


  constructor(private _mode: 'design' | 'runtime') {
    this.compRepoManager.addComponentRepository(StandardCompRepo);
    this.compRepoManager.addComponentRepository(CustomCompRepo);
    this.geneRepoManager.addGeneratorRepository(standardGeneratorRepo);

    this.view = new PageView(this);
    this.pageConfig = new PageConfig(_mode);

    this.regionManager = new RegionManager();
    this.selectManager = new SelectManager();
    this.activateManager = new ActivateManager(this);

    this.configSourceManager = new ConfigSourceManager();
    this.dataSourceManager = new DataSourceManager(dataOptionManager.getDataSourceConfigSet('space1'));
    this.actionManager = new ActionManager();
  }

  get mode(): 'design' | 'runtime' {
    return this._mode;
  }

  init() {
    this.accept(this.pageConfig.model);
    this.view.accept(this.pageConfig.model);
    this._init();
  }

  /**
   * 监听model事件
   * @param {BasePageConfig} model
   */
  accept(model: BasePageConfig) {
    model.register('themeMode', (key, oldValue, newValue) => {
      this.regionManager.regionArray.forEach((item) => {
        item.updateTheme(newValue);
      });
    });
  }


  /**
   * 监听PageView事件
   * 设置View的上下文事件处理函数生成器
   * @private
   */
  private _init() {
    this.view
      .addEventListener('select', () => {
        this.selectManager.clear();
        this.pageConfig.show();
      })
      .addEventListener('boxSelect', (left, top, width, height) => {
        const array = this.regionManager.selectByBox(left, top, width, height);
        this.selectManager.clear();
        console.log(array.length);
        array.forEach((value) => {
          this.selectManager.ctrlSelect(value);
        });
      })
      .addEventListener('deactivateRegion', () => {
        this.activateManager.deactivate();
      });

    this.view.contextMenuGenerator = () => {
      return [
        /*     {
               displayName: '新建 柱状图',
               callback: ($event) => {
                 // 如何建立关联
                 graphicFactory.createByName('barChart', this, $event.offsetX, $event.offsetY);
                 contextMenuHelper.close();
               }
             }, {
               displayName: '新建注释',
               callback: ($event) => {
                 graphicFactory.createByName('commentAuxiliary', this, $event.offsetX, $event.offsetY);
                 contextMenuHelper.close();
               }
             }, {
               displayName: '新建文本',
               callback: ($event) => {
                 graphicFactory.createByName('textAuxiliary', this, $event.offsetX, $event.offsetY);
                 contextMenuHelper.close();
               }
             },*/ 'split', {
          displayName: '剪切',
          shortcut: 'Ctrl+X',
        }, {
          displayName: '粘贴',
          shortcut: 'Ctrl+X',
          enable: clipboard.hasData(),
          callback: ($event) => {
            console.log('粘贴', clipboard.getData());
            graphicFactory.paste(clipboard.getData(), $event.offsetX, $event.offsetY);
            return false;
          },
        }, {
          displayName: '删除',
          shortcut: 'Backspace',
        },
      ];
    };
  }

  activate() {

  }

  deactivate() {
  }

  unselect() {

  }

  destroy() {
    this.activateManager.destroy();
    this.regionManager.regionArray.forEach(value => value.destroy());
    this.regionManager.destroy();
    this.selectManager.destroy();
    this.view.destroy();
  }
}

