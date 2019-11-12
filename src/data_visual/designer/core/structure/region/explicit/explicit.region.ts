import { Region } from '../region';
import { clipboard } from '../../../../utils/clipboard';
import { RegionModel, RegionState } from '../region.model';
import { ExplicitRegionView } from './explicit.region.view';
import { IReportPageInnerFacade } from '../../page/report/page.interface';
import { GraphicActionDelete } from '../../../operate/graphic.action.delete';
import { resizeTipHelper } from '../../../helper/resize.tip.helper';
import { Coordinates, IGraphicOption, Rectangle } from '@data-studio/shared';
import { GraphicActionMove } from '../../../operate/graphic.action.move';
import { GraphicActionResize } from '../../../operate/graphic.action.resize';
import { contextMenuHelper } from '../../../helper/context.menu.helper';
import { GraphicWrapper } from '../../graphic/graphic.wrapper';

/**
 *
 * angularjs
 * 控制器是AngularJS的核心之一，它的作用主要是对视图中的数据和事件处理函数进行挂载，
 * 同时进行一定的业务功能的底层封装和处理
 *
 * 控制器的作用
 * 1、通过$scope进行数据状态的初始化操作
 * 2、通过$scope进行事件处理函数的挂载操作
 * 控制器的使用注意事项
 * 不要用控制器做下面的事情：
 * 1、ＤＯＭ操作：使用AngularJs中的数据双向绑定和自定义指令执行操作
 * 2、表单处理：使用Angular中的form controls进行操作
 * 3、 数据格式化展示：使用Angular中的过滤器Filter来进行操作
 * 4、不同控制器之间的数据共享：使用Angular中的自定义服务Service进行处理
 * 那么如何进行不同作用域之间的访问呢，在Angularjs中对于作用域访问有个$rootScope 。
 * 在这里有三个函数需要介绍下，
 * $on(name,handler)  注册一个事件处理函数，该函数在特定的事件被当前作用域收到时将被调用。
 * $emit(name,args)   向当前父作用域发送一个事件，直至根作用域。
 * $broadcast(name,args) 向当前作用域下的子作用域发送一个事件，参数是事件名称以及一个用于作用向事件提供额外数据的对象。
 *
 * 1、由Controller创建相关model
 */
/**
 * 1、创建模型并初始化  模型数据是独立的
 */
export class ExplicitRegion extends Region {

  constructor(protected _page: IReportPageInnerFacade) {
    super();
  }

  /**
   * 用户单击mover的时候调用select，进入选中状态
   *
   * unselect 点击画布  所有的region、调用unselect方法
   *
   * 用户双击mover，进入激活状态   此时已经调用了select
   *
   * 点击mask  当前激活的region调用deactivate
   */
  set state(param: RegionState) {
    this._model.state = param;
  }

  /**
   * 创建regionModel
   * @param regionOption
   * @param graphicPath
   * @param graphicOption
   */
  init(regionOption: any, { graphicPath, graphicOption }: { graphicPath: string, graphicOption?: IGraphicOption }) {
    super.init(regionOption, { graphicPath, graphicOption });

    // 1、初始化region model。
    // 新建的RegionModel不会触发z-index和state属性变化事件
    // 通过importModel批量导入模型数据也不会触发属性变化事件
    this._model = new RegionModel();
    regionOption && this._model.importModel(regionOption);

    this._view = new ExplicitRegionView(this, this._model);
    // 事件绑定 将浏览器事件转换为RegionView事件
    this._view.init();

    // 事件绑定 监听RegionView事件
    this._bindForSelect();
    this._bindForMove();
    this._bindForResize();
    this._bindForContextMenu();
    // 监听RegionModel
    this._accept();

    this._page.addChild(this);

    this.sync();

    const graphicWrapper = new GraphicWrapper(this);
    graphicWrapper.init({ graphicPath, graphicOption });

    setTimeout(() => {
      graphicWrapper.resize();
    }, 200);

    this.onDestroy(() => {
      // 1、销毁内部对象
      // 2、解除事件绑定
      // 3、解除当前对象的属性引用
      if (this._graphicWrapper) {
        this._graphicWrapper.destroy();
        this._graphicWrapper = null;
      }

      // 解除对象绑定
      this._model.destroy();
      this._model = null;

      // 解除dom事件绑定
      // 删除dom元素
      // 解除对象关系
      this._view.destroy();
      this._view = null;

      // 单纯的从相关的array中将region对象移除，并没有调用region的相关方法
      this._page.removeChild(this);
      this._page = null;
    });
  }

  /**
   * 同步视图和数据模型
   * 当从外部设置位置、维度时调用  graphicActionMove从外部记录、恢复位置 graphicActionResize
   * 内部 move事件、resize事件导致位置和维度变化需要调用
   * init 初始化的时候  因为是第一次设置位置和维度，因此需要进行同步
   */
  sync() {
    this._view.$element.css({
      width: this._model.width,
      height: this._model.height,
      left: this._model.left,
      top: this._model.top,
      zIndex: this._model.zIndex,
    });

    // 激活状态下需要更新辅助元素mask的状态
    if (this._model.state === RegionState.activated) {
      this._page.regionResize(this);
    }
  }

  getOption() {
    const retObj = {
      region: {
        regionKey: 'explicit.region',
        regionOption: this._model.exportModel(),
      },
      graphic: this._graphicWrapper.getOption(),
    };
    return retObj;
  }

  private _bindForSelect() {
    this._view
      .addEventListener('select', () => {
        this._page.select(this);
      })
      .addEventListener('ctrlSelect', () => {
        this._page.ctrlSelect(this);
      })
      .addEventListener('activateRegion', () => {
        this._page.activateRegion(this);
      });
  }

  private _bindForMove() {
    const model = this._model, view = this._view;

    // move相关辅助变量
    let scale = 1,
      originPageX, originPageY,
      moveStartCoordinates: Coordinates,
      moveStopCoordinates: Coordinates;

    view.addEventListener('moveStart', (pageX, pageY) => {
      scale = this._page.scale;
      view.$element.addClass('no-transition');
      moveStartCoordinates = model.coordinates;
      resizeTipHelper.show(
        originPageX = pageX,
        originPageY = pageY,
        moveStartCoordinates.left,
        moveStartCoordinates.top);
    })
      .addEventListener('moving', (pageX, pageY) => {
        model.left = moveStartCoordinates.left + ((pageX - originPageX) / scale);
        model.top = moveStartCoordinates.top + ((pageY - originPageY) / scale);
        moveStopCoordinates = {
          left: model.left,
          top: model.top,
        };
        resizeTipHelper.refresh(pageX, pageY, model.left, model.top);
        // region 位置或维度发生变化  需要手工同步model和view
        this.sync();
      })
      .addEventListener('moveEnd', () => {
        view.$element.removeClass('no-transition');
        resizeTipHelper.hide();
        this._page.actionManager.execute(new GraphicActionMove(this, moveStartCoordinates, moveStopCoordinates));
      });
  }

  private _bindForResize() {

    // resize相关辅助变量
    let scale = 1,
      which: string,
      offsetX, offsetY,
      offset: Coordinates,
      resizeStartRectangle: Rectangle;

    const model = this._model, view = this._view,
      getReal = (num) => (num / scale),
      handleResize = (pageX, pageY) => {
        switch (which) {
          case 'resize-left':
            if (pageX < (offset.left + resizeStartRectangle.width)) {
              offsetX = getReal(pageX - offset.left);
              model.left = resizeStartRectangle.left + offsetX;
              model.width = resizeStartRectangle.width - offsetX;
            }
            break;
          case 'resize-top':
            if (pageY < (offset.top + resizeStartRectangle.height)) {
              offsetY = getReal(pageY - offset.top);
              model.top = resizeStartRectangle.top + offsetY;
              model.height = resizeStartRectangle.height - offsetY;
            }
            break;
          case 'resize-right':
            if (pageX > offset.left) {
              model.width = getReal(pageX - offset.left);
            }
            break;
          case 'resize-topLeft':
            if (pageY < (offset.top + resizeStartRectangle.height) && pageX < (offset.left + resizeStartRectangle.width)) {
              offsetX = getReal(pageX - offset.left),
                offsetY = getReal(pageY - offset.top);
              model.coordinates = {
                left: resizeStartRectangle.left + offsetX,
                top: resizeStartRectangle.top + offsetY,
              };
              model.dimensions = {
                width: resizeStartRectangle.width - offsetX, height: resizeStartRectangle.height - offsetY,
              };
            }
            break;
          case 'resize-topRight':
            if (pageY < (offset.top + resizeStartRectangle.height)) {
              offsetY = getReal(pageY - offset.top);
              model.top = resizeStartRectangle.top + offsetY;
              model.height = resizeStartRectangle.height - offsetY;
            }
            if (pageX > offset.left) {
              model.width = getReal(pageX - offset.left);
            }
            break;
          case 'resize-bottomRight':
            if (pageX > offset.left) {
              model.width = getReal(pageX - offset.left);
            }
            if (pageY > offset.top) {
              model.height = getReal(pageY - offset.top);
            }
            break;
          case 'resize-bottomLeft':
            if (pageX < (offset.left + resizeStartRectangle.width)) {
              offsetX = getReal(pageX - offset.left);
              model.left = resizeStartRectangle.left + offsetX;
              model.width = resizeStartRectangle.width - offsetX;
            }
            if (pageY > offset.top) {
              model.height = getReal(pageY - offset.top);
            }
            break;
          case 'resize-bottom':
            if (pageY > offset.top) {
              model.height = getReal(pageY - offset.top);
            }
            break;
        }
      };


    view
      .addEventListener('resizeStart', (pageX, pageY, targetWhich) => {
        // 记录resize事件开始时刻的数据状态
        scale = this._page.scale;
        offset = view.$element.offset();
        resizeStartRectangle = model.rectangle;
        which = targetWhich;
        resizeTipHelper.show(pageX, pageY, model.width, model.height);
        this.$element.addClass('no-transition');
      })
      .addEventListener('resizing', (pageX, pageY) => {
        handleResize(pageX, pageY);
        resizeTipHelper.refresh(pageX, pageY, model.width, model.height);
        this.sync();
      })
      .addEventListener('resizeEnd', (pageX, pageY) => {
        view.$element.removeClass('no-transition');
        handleResize(pageX, pageY);
        resizeTipHelper.hide();
        this._page.actionManager.execute(new GraphicActionResize(this, resizeStartRectangle, model.rectangle));

        if (this._graphicWrapper) {
          this._graphicWrapper.resize();
        }
      });
  }

  /**
   * 绑定region的右键菜单
   * @private
   */
  private _bindForContextMenu() {
    const contextMenu = [
      {
        displayName: '复制',
        shortcut: 'Ctrl+C',
        callback: () => {
          // 保存当前region的选项信息，该信息的结构应该符合IComponentOption接口
          clipboard.saveData(this.getOption());
          console.log('复制:', this.getOption());
          return false;
        },
      },
      {
        displayName: '剪切',
        shortcut: 'Ctrl+X',
        callback: () => {
          clipboard.saveData(this.getOption());
          this.destroy();
          return false;
        },
      },
      {
        displayName: '删除',
        shortcut: 'Backspace',
        callback: () => {
          if (this.page.isSelected(this)) {
            const arr = this.page.selectedArray;
            this._page.actionManager.execute(new GraphicActionDelete(this._page, arr));
          } else {
            this._page.actionManager.execute(new GraphicActionDelete(this._page, [this]));
          }
          return false;
        },
      }, 'split', {
        displayName: '上移一层',
        shortcut: 'F',
        callback: () => {
          this._model.zIndex = this._model.zIndex + 1;
          return false;
        },
      }, {
        displayName: '下移一层',
        shortcut: 'B',
        callback: () => {
          this._model.zIndex = this._model.zIndex - 1;
          return false;
        },
      }, {
        displayName: '置顶',
        shortcut: 'R',
        callback: () => {
          this._model.zIndex = this._page.topIndex + 1;
          return false;
        },
      }, {
        displayName: '置底',
        shortcut: 'K',
        callback: () => {
          this._model.zIndex = this._page.bottomIndex - 1;
          return false;
        },
      }, {
        displayName: '保存为组件模版',
        shortcut: 'K',
        callback: () => {
          this._model.zIndex = this._page.bottomIndex - 1;
          return false;
        },
      }];

    this._view.addEventListener('rightClick', ($event) => {
      contextMenuHelper.open(contextMenu, $event.pageX, $event.pageY, $event);
    });
  }


  /**
   * 监听模型变化
   * 一般情况下在视图内部监听model，由于region中，当部门属性发生变化时，需要graphic
   * @private
   */
  private _accept() {
    const model = this._model, view = this._view;
    model
      .register('state', (key, oldValue, newValue, option) => {
        const $element = view.$element;
        if (oldValue !== newValue) {
          switch (oldValue) {
            case RegionState.selected:
              $element.removeClass('selected');
              break;
            case RegionState.multiSelected:
              $element.removeClass('multi-selected');
              break;
            case RegionState.activated:
              $element.removeClass('activated');
          }
          switch (newValue) {
            case RegionState.default:
              $element.removeClass('selected multi-selected activated');
              break;
            case RegionState.selected:
              $element.addClass('selected');
              break;
            case RegionState.multiSelected:
              $element.addClass('multi-selected');
              break;
            case RegionState.activated:
              $element.addClass('activated');
              break;
          }
        }

        switch (newValue) {
          case RegionState.default:
            if (oldValue === RegionState.activated) {
              this._graphicWrapper && this._graphicWrapper.deactivate();
            }
            break;
          case RegionState.selected:
            this._graphicWrapper && this._graphicWrapper.activateConfig();
            break;
          case RegionState.multiSelected:
            break;
          case RegionState.activated:
            this._graphicWrapper && this._graphicWrapper.activate();
            break;
        }
      })
      .register('left top width height', (key, oldValue, newValue, option) => {

      })
      .register('z-index', (key, oldValue, newValue, option) => {
        view.$element.css('z-index', newValue);
      });
  }

}
