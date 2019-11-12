import { clipboard } from '../../../../utils/clipboard';
import { SelectManager } from '../../../manager/select.manager';
import { RegionManager } from '../../../manager/region.manager';
import { ActivateManager } from '../../../manager/activate.manager';
import { ConfigSourceManager } from '../../../config/config.source.manager';
import { dataSourceConfigSetManager } from '../../../../data/data.source.config.set.manager';
import { ActionManager } from '../../../operate/action.manager';
import { PageConfigAgent } from './page.config.agent';
import { PageView } from './page.view';
import {
  BasePageConfig,
  DataSourceManager, Destroyable, IConfigSourceOptionWrapper,
  IPage,
} from '@data-studio/shared';
import { session } from '../../../../utils/session';
import { contextMenuHelper } from '../../../helper/context.menu.helper';
import { Observable } from 'rxjs';

export class ReportPageKernel extends Destroyable implements IPage {

  public pageConfigAgent: PageConfigAgent;
  public view: PageView;

  // manager
  public regionManager: RegionManager;
  public selectManager: SelectManager;
  public activateManager: ActivateManager;

  public configSourceManager: ConfigSourceManager;
  public dataSourceManager: DataSourceManager;
  public actionManager: ActionManager;


  constructor(private _mode: 'design' | 'runtime') {
    super();

    // 创建页面视图，并初始化
    this.view = new PageView(this);
    this.view.init();
    // 创建页面模型
    this.pageConfigAgent = new PageConfigAgent(_mode);

    // 创建管理工具 管理所有的图表/选中的图表/当前激活的图表。
    this.regionManager = new RegionManager();
    this.selectManager = new SelectManager();
    this.activateManager = new ActivateManager(this);

    this.configSourceManager = new ConfigSourceManager();
    this.dataSourceManager = new DataSourceManager(dataSourceConfigSetManager.getItem('space1'));
    this.actionManager = new ActionManager();

    this.onDestroy(() => {
      this.activateManager.destroy();
      this.regionManager.regionArray.forEach(value => value.destroy());
      this.regionManager.destroy();
      this.selectManager.destroy();
      this.pageConfigAgent.destroy();
      this.view.destroy();
    });
  }

  get mode(): 'design' | 'runtime' {
    return this._mode;
  }

  init() {
    // 1、监听model事件
    this.pageConfigAgent.model.register('themeMode', (key, oldValue, newValue) => {
      this.updateTheme(newValue);
    });
    this.view.accept(this.pageConfigAgent.model);

    // 2、监听PageView事件
    this._init();
  }

  /**
   * 监听PageView事件
   * @private
   */
  private _init() {
    const getContextMenu=()=>{
      return [
        'split', {
          displayName: '剪切',
          shortcut: 'Ctrl+X',
        }, {
          displayName: '粘贴',
          shortcut: 'Ctrl+X',
          enable: clipboard.hasData(),
          callback: ($event) => {
            console.log('粘贴', clipboard.getData());
            session.currentPage.paste(clipboard.getData(), $event.offsetX, $event.offsetY);
            return false;
          },
        }, {
          displayName: '删除',
          shortcut: 'Backspace',
        },
      ];
    }

    this.view
      .addEventListener('select', () => {
        this.selectManager.clear();
        this.pageConfigAgent.show();
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
      })
      .addEventListener('rightClick', ($event) => {
        contextMenuHelper.open(getContextMenu(), $event.pageX, $event.pageY, $event);
      });
    this.onDestroy(() => {
      //contextMenu = null;
    });
  }

  /**
   * 页面切换主题
   * @param theme
   */
  updateTheme(theme: string) {
    this.regionManager.regionArray.forEach((item) => {
      item.updateTheme(theme);
    });
  }

  /**
   * 当处于activated状态下  用户的快捷键将作用于当前页面
   */
  activate() {

  }

  deactivate() {
  }

  addChild(child: any): any {
  }

  removeChild(child: any): any {
  }

  getConfigSource(option: IConfigSourceOptionWrapper): Observable<any> {
    return null;
  }

  getDataSource(id: string): Observable<any> {
    return null;
  }

  unselect() {

  }
}

