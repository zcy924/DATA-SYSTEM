export class Menu {
  public text: String;
  public key?: String;
  public isLeaf?: Boolean;
  public isGroup?: Boolean;
  public icon?: String;
  public link?: String;
  public children?: Array<Menu>;
  constructor() {}
}
export const MENUS: Array<Menu> = [
  {
    text: '大屏',
    isGroup: true,
    children: [
      {
        text: '数据大屏',
        isLeaf: false,
        icon: 'folder',
        children: [],
      },
    ],
  },

  {
    text: '报表',
    isGroup: true,
    children: [],
  },

  {
    text: '管理中心',
    isLeaf: false,
    isGroup: true,
    children: [
      {
        text: '报表管理',
        link: `app/square/${localStorage.getItem('spaceID')}/report-manage`,
        isLeaf: true,
        icon: 'appstore-o',
      },
      {
        text: '大屏管理',
        isLeaf: true,
        icon: 'area-chart',
        link: `app/square/${localStorage.getItem('spaceID')}/screen-manage`,
      },
      {
        text: '角色管理',
        isLeaf: true,
        icon: 'usergroup-add',
        link: `app/square/${localStorage.getItem('spaceID')}/role-manage`,
      },
      {
        isLeaf: true,
        text: '用户管理',
        icon: 'user',
        link: `app/square/${localStorage.getItem('spaceID')}/user-manage`,
      },
      {
        text: '数据源管理',
        isLeaf: true,
        icon: 'database',
        link: 'user-message',
      },
      {
        text: '数据表预览',
        isLeaf: true,
        icon: 'user',
        link: 'user-message',
      },
      {
        text: 'SQL模型管理',
        isLeaf: true,
        icon: 'api',
        link: 'user-message',
      },
      {
        text: '数据值映射管理',
        isLeaf: true,
        icon: 'book',
        link: 'user-message',
      },
      {
        text: '空间设置',
        isLeaf: true,
        icon: 'setting',
        link: 'user-message',
      },
    ],
  },
];
