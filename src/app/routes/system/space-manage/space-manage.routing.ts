import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReportDetailComponent} from './component/report-detail.component';
import {ReportManageComponent} from './component/report-manage/report-manage.component';
import {ScreenManageComponent} from './component/screen-manage/screen-manage.component';
import {RoleManageComponent} from './component/role-manage/role-manage.component';
import {UserManageComponent} from './component/user-manage/user-manage.component';
import {ScreenDetailComponent} from './component/screen-detail.component';
import {SpaceSettingComponent} from "./component/space-setting/space-setting.component";
import {ApiManageComponent} from "./component/api-manage/api-manage.component";
import {DatabaseManageComponent} from "./component/database-manage/database-manage.component";

const routes: Routes = [
  {
    path: 'report-detail/:reportId',
    component: ReportDetailComponent,
    data: {title: '报表详情'},
  },
  {
    path: 'screen-detail/:screenId',
    component: ScreenDetailComponent,
    data: {title: '大屏详情'}
  },
  {
    path: 'report-manage',
    component: ReportManageComponent,
    data: {title: '报表管理'},
  },
  {
    path: 'screen-manage',
    component: ScreenManageComponent,
    data: {title: '大屏管理'},
  },
  {
    path: 'role-manage',
    component: RoleManageComponent,
    data: {title: '角色管理'},
  },
  {
    path: 'user-manage',
    component: UserManageComponent,
    data: {title: '用户管理'},
  },
  {
    path: 'space-setting',
    component: SpaceSettingComponent,
    data: {title: '空间设置'},
  },
  {
    path: 'api-manage',
    component: ApiManageComponent,
    data: {title: 'api管理'}
  },
  {
    path: 'database-manage',
    component: DatabaseManageComponent,
    data: {title: '数据直连'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpaceManageRoutingModule {
}
