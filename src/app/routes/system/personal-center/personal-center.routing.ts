import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCollectComponent } from './report-collect/report-collect.component';
import { ScreenCollectComponent } from './screen-collect/screen-collect.component';
import { UserInfoComponent } from './user-info/user-info.component';
const routes: Routes = [
  {
    path: 'user-report',
    component: ReportCollectComponent,
    data: { title: '报表收藏管理' },
  },
  {
    path: 'user-screen',
    component: ScreenCollectComponent,
    data: { title: '大屏收藏管理' },
  },
  {
    path: 'user-message',
    component: UserInfoComponent,
    data: { title: '用户信息管理' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalCenterRoutingModule { }
