import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PassportRoutingModule } from './passport.routing';
import { UserLoginComponent } from './login/login.component';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { UserRegisterComponent } from './register/register.component';

const modules = [SharedModule,PassportRoutingModule];
const components = [UserLoginComponent,UserRegisterResultComponent,UserRegisterComponent];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [],
})
export class PassportModule {}
