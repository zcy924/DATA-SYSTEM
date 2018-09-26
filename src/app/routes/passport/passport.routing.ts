import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './login/login.component';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { UserRegisterComponent } from './register/register.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  }, {
    path: 'login',
    component: UserLoginComponent,
    data: { title: '登录', titleI18n: 'pro-login' },
  },
  {
    path: 'register',
    component: UserRegisterComponent,
    data: { title: '注册', titleI18n: 'pro-register' },
  },
  {
    path: 'register-result',
    component: UserRegisterResultComponent,
    data: { title: '注册结果', titleI18n: 'pro-register-result' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassportRoutingModule {
}
