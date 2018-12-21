import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanisManageComponent } from './component/companis-manage.component';


const routes: Routes = [
  {
    path: '',
    redirectTo:'companis-manage'
  },
  {
    path: 'companis-manage',
    component: CompanisManageComponent,
    data: { title: '公司设置' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformManageRoutingModule { }
