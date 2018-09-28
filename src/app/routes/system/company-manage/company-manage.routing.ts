import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanySettingComponent } from './component/company-setting.component';
import { SpaceSettingComponent } from './component/space-setting.component';
import { UserSettingComponent } from './component/user-setting.component';

const routes: Routes = [
  {
    path: '',
    redirectTo:'company-setting'
  },
  {
    path: 'company-setting',
    component: CompanySettingComponent,
    data: { title: '公司设置' },
  },
  {
    path: 'space-setting',
    component: SpaceSettingComponent,
    data: { title: '空间设置' },
  },
  {
    path: 'user-setting',
    component: UserSettingComponent,
    data: { title: '用户设置' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyManageRoutingModule { }
