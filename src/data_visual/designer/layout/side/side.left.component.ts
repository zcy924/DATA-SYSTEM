import {
  AfterViewInit,
  Component,
  ComponentFactory, ComponentFactoryResolver, ComponentRef,
  KeyValueDiffer, NgZone, Type, ViewChild,
  ViewContainerRef, ViewRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataHeaderComponent } from '../../../components/graphic.config/html/header.component';
import { DesignerBodyComponent } from '../designer.body.component';
import { session } from '../../utils/session';
import { BaseConfigSourceComponent, BasePageConfig } from '@data-studio/shared';

@Component({
  selector: 'app-side-left',
  templateUrl: './side.left.component.html',
  styleUrls: ['./side.left.component.less'],
})
export class SideLeftComponent implements AfterViewInit {


  @ViewChild('configContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('shadowContainer', { read: ViewContainerRef }) shadowContainer: ViewContainerRef;

  @ViewChild(NgForm) ngForm: NgForm;

  private _differ: KeyValueDiffer<any, any>;
  componentRef: any;

  constructor(
    private _resolver: ComponentFactoryResolver,
    private _zone: NgZone,
    private _designerBody: DesignerBodyComponent) {
  }

  openRightPanel() {
    this._designerBody.openRightPanel();
  }

  createComponent(type: string) {
    this.container.clear();
    const factory: ComponentFactory<DataHeaderComponent> =
      this._resolver.resolveComponentFactory(DataHeaderComponent);
    this.componentRef = this.container.createComponent(factory);
    // this.componentRef.instance.type = type;
    this.componentRef.instance.output.subscribe((msg: string) => {
    });
  }

  createGraphicConfig(type: Type<BaseConfigSourceComponent>): ComponentRef<BaseConfigSourceComponent> {
    let retComponentRef: ComponentRef<BaseConfigSourceComponent>;
    this._zone.run(() => {
      this.container.detach();
      this.container.clear();
      const factory: ComponentFactory<BaseConfigSourceComponent> =
        this._resolver.resolveComponentFactory(type);
      retComponentRef = this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.type = type;
      // this.componentRef.instance.output.subscribe((msg: string) => {
      //   console.log('我是', msg);
      //   if (reportGlobal.instance) {
      //     reportGlobal.instance.update(msg);
      //   }
      // });
    });
    return retComponentRef;
  }

  forwardCreateGraphicConfig(type: Type<BaseConfigSourceComponent>): ComponentRef<BaseConfigSourceComponent> {
    let retComponentRef: ComponentRef<BaseConfigSourceComponent>;
    this._zone.run(() => {
      // this.shadowContainer.detach();
      // this.shadowContainer.clear();
      const factory: ComponentFactory<BaseConfigSourceComponent> =
        this._resolver.resolveComponentFactory(type);
      retComponentRef = this.componentRef = this.shadowContainer.createComponent(factory);
      this.componentRef.instance.type = type;
      // this.shadowContainer.detach();
      // this.componentRef.instance.output.subscribe((msg: string) => {
      //   console.log('我是', msg);
      //   if (reportGlobal.instance) {
      //     reportGlobal.instance.update(msg);
      //   }
      // });
    });
    return retComponentRef;
  }

  forwardCreateCanvasConfig(type: Type<BasePageConfig>): ComponentRef<BasePageConfig> {
    let retComponentRef: ComponentRef<BasePageConfig>;
    this._zone.run(() => {
      // this.shadowContainer.detach();
      // this.shadowContainer.clear();
      const factory: ComponentFactory<BasePageConfig> =
        this._resolver.resolveComponentFactory(type);
      retComponentRef = this.componentRef = this.shadowContainer.createComponent(factory);
      // this.componentRef.instance.type = type;
      // this.shadowContainer.detach();
      // this.componentRef.instance.output.subscribe((msg: string) => {
      //   console.log('我是', msg);
      //   if (reportGlobal.instance) {
      //     reportGlobal.instance.update(msg);
      //   }
      // });
    });
    return retComponentRef;
  }

  attachDataProperty(viewRef: ViewRef) {
    this._zone.run(() => {
      const index = this.shadowContainer.indexOf(viewRef);
      if (index >= 0) {
        this.shadowContainer.detach(index);
      }
      this.container.detach();
      this.container.clear();
      this.container.insert(viewRef);
    });
  }


  ngAfterViewInit() {
    session.sideLeftComponent = this;
  }

}
