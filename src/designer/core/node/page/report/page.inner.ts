import { IPage } from '../../interface';
import { PageConfig } from '../../../../shared/core/page/page.config';
import { graphicFactory } from '@core/node/factory/graphic.factory';
import { clipboard } from '@core/node/utils/clipboard';
import { ISelectManager, SelectManager } from '@core/node/manager/select.manager';
import { PageView } from '@core/node/page/report/page.view';
import { RegionManager } from '@core/node/manager/region.manager';
import { ActivateManager } from '@core/node/manager/activate.manager';
import { ConfigSourceManager } from '@core/config/config.source.manager';
import { dataOptionManager } from '@core/data/data.source.config.manager';
import { ActionManager } from '@core/node/operate/action.manager';
import { PageConfigWrapper } from '@core/node/page/report/page.outer';
import { AbstractPageView } from '@core/node/page/report/abstract.page.view';
import { DataSourceManager } from '@shared/core/data/data.source.manager';
import { GeneratorRepositoryManager } from '@shared/manager/generator.repository.manager';
import { ComponentRepositoryManager } from '@shared/manager/component.repository.manager';

export class ReportPageInner implements IPage {

  public pageConfigWrapper: PageConfigWrapper;
  public view: AbstractPageView;
  public regionManager: RegionManager;
  public selectManager: ISelectManager;
  public activateManager: ActivateManager;

  public configSourceManager: ConfigSourceManager;
  public dataSourceManager: DataSourceManager;
  public actionManager: ActionManager;

  public compRepoManager = ComponentRepositoryManager.getInstance();
  public geneRepoManager = GeneratorRepositoryManager.getInstance();


  constructor(private _mode: 'design' | 'runtime') {
    this.view = new PageView(this);
    this.pageConfigWrapper = new PageConfigWrapper(_mode);
    this.regionManager = new RegionManager();
    this.selectManager = new SelectManager();
    this.activateManager = new ActivateManager(this);
    this.configSourceManager = new ConfigSourceManager(_mode);
    this.dataSourceManager = new DataSourceManager(dataOptionManager.getDataSourceConfigSet('space1'));
    this.actionManager = new ActionManager();
  }

  get mode(): 'design' | 'runtime' {
    return this._mode;
  }

  init() {
    this.accept(this.pageConfigWrapper.model);
    this.view.accept(this.pageConfigWrapper.model);
    if (this._mode === 'design') {
      this._init();
    }
  }

  /**
   * 监听model事件
   * @param {PageConfig} model
   */
  accept(model: PageConfig) {
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
        this.pageConfigWrapper.show();
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
             }, {
               displayName: '新建 Image',
               callback: ($event) => {
                 // 如何建立关联
                 graphicFactory.createByName('imageAuxiliary', this, $event.offsetX, $event.offsetY);
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
    this.view.destroy();
    this.regionManager;
  }
}

