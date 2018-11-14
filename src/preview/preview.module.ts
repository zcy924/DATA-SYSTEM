import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PreviewComponent } from './preview.component';

import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from '../data_visual/components/shared/color-picker/color-picker.module';


const COMPONENTS = [
  PreviewComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ColorPickerModule,
  ],
  providers: [],
  exports: [
    ...COMPONENTS,
  ],
})
export class PreviewModule {
}
