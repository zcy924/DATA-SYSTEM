import { dataModelManager } from '../data/data.model.manager';

const windowMask = `
<div class="m-window m-window-mask mask-transparent" style="z-index: 405;">
  <div class="wrap">
  </div>
</div>
`;

interface ContextMenuItem {
  displayName: string;
  _callbackNo?: string;
  callback?: Function;
  enable?: boolean;
  shortcut?: string;
  children?: Array<ContextMenuItem>;
}


function getTemplate() {

  const result = dataModelManager.list.reduce((previous, current) => {
    return previous +
      `<li class="model-item" data-model-id="${current.id}">${current.displayName}
        <i class="u-icn u-icn-delete"></i>
        <i class="u-icn u-icn-check"></i>
       </li>`;
  }, '');

  return `
          <div class="m-overlay m-overlay-dataModel top" style="z-index: 409; position: absolute; width: 167px;">
                <div class="u-overlay-blank" style="zoom: 1;">
                  <button class="add-dataModel"><i class="u-icn u-icn-add"></i>添加新数据模型</button>
                  <ul class="model-list">
                      ${result}
                  </ul>
                </div>
          </div>
          `;
}

/**
 * 数据模型选择弹出框
 */
class DataModelSelector {
  $mask: JQuery;
  $menu: JQuery;

  constructor() {
    this.$mask = $(windowMask);
    this.$mask.on('click', ($event) => {
      this.close();
      if ($event.target === this.$mask[0]) {

      }
    });
  }

  open(event: MouseEvent, callback?: Function) {
    const target = event.target as HTMLElement;
    this.$menu = $(getTemplate());
    // 设置菜单显示位置
    this.$menu.css({
      left: `${target.offsetLeft}px`,
      top: `${target.offsetTop + target.offsetHeight}px`,
    });
    // 绑定菜单项点击事件处理函数
    this.$menu.on('click', 'li.model-item', ($event) => {
      console.log('switch dataModel: ', $event.currentTarget.dataset.modelId);
      callback && callback($event.currentTarget.dataset.modelId);
      this.close();

      return false;
    });
    // 显示遮罩层/显示菜单
    $('body').append(this.$mask, this.$menu);
  }

  close() {
    this.$mask.detach();
    this.$menu.remove();
  }
}

export const dataModelSelector = new DataModelSelector();
