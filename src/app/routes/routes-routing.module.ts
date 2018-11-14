import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
// passport pages

// single pages
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { PersonalCenterComponent } from './system/personal-center/personal-center.component';
import { SpaceSquareComponent } from './system/space-square/space-square.component';
import { SpaceManageComponent } from './system/space-manage/space-manage.component';
import { CompanyManageComponent } from './system/company-manage/company-manage.component';
import { HarfScreenComponent } from '../layout/harfscreen/harfscreen.component';
import { PlatformManageComponent } from './system/platform-manage/platform-manage.component';
import { LoginComponent } from './system/login/login.component';
import { Log } from '@angular/core/testing/src/logger';
import { AuthGuard } from '@core/guard/auth-guard.service';
import { DesignerComponent } from '../../designer/designer/layout/designer.component';

const routes: Routes = [
  {
    path: 'app',
    component: LayoutDefaultComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'user',
        component: PersonalCenterComponent,
        data: { title: '用户中心' },
        loadChildren:
          './system/personal-center/personal-center.module#PersonalCenterModule',
      },
      {
        path: 'square/:spaceId',
        component: SpaceManageComponent,
        data: { title: '空间管理' },
        loadChildren:
          './system/space-manage/space-manage.module#SpaceManageModule',
      },
      {
        path: 'company',
        component: CompanyManageComponent,
        data: { title: '公司管理' },
        loadChildren:
          './system/company-manage/company-manage.module#CompanyManageModule',
      },
      {
        path: 'platform',
        component: PlatformManageComponent,
        data: { title: '平台管理' },
        loadChildren:
          './system/platform-manage/platform-manage.module#PlatformManageModule',
      },
      // 业务子模块
      // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
    ],
  },
  {
    path: 'content',
    component: HarfScreenComponent,
    children: [
      {
        path: 'square',
        data: { title: '空间广场' },
        component: SpaceSquareComponent,
      },
    ],
  },
  {
    path: '',
    data: { title: '登录' },
    component: LoginComponent,
  },
  {
    path: 'designer/:id',
    data: { title: '设计器' },
    component: DesignerComponent,
  },
  {
    path: 'report-designer/:id',
    data: {title: '报表设计器'},
    component: DesignerComponent,
  },
  {
    path: 'platform',
    data: { title: '平台管理登录' },
    component: LoginComponent,
    // loadChildren: './passport/passport.module#PassportModule',
  },
  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //       { path: '', redirectTo: 'screen', pathMatch: 'full' },
  //       { path: 'screen', component: DashboardComponent, data: { title: '仪表盘', titleI18n: 'dashboard' } },
  //     ]
  // },
  // passport

  // 单页不包裹Layout
  // { path: 'callback/:type', component: CallbackComponent },
  {
    path: 'lock',
    component: UserLockComponent,
    data: { title: '锁屏', titleI18n: 'lock' },
  },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
