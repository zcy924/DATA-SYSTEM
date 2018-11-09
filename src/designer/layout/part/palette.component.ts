import { AfterViewInit, Component } from '@angular/core';
import { session } from '@core/node/utils/session';
import { graphicFactory } from '@core/node/factory/graphic.factory';
import * as _ from 'lodash';
import { grabHelper } from '../designer.header.component';
import { customGraphicMeta } from '@core/node/config/default.graphic.meta.map';
import { ComponentRepositoryManager } from '@shared/manager/component.repository.manager';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.less'],
})
export class PaletteComponent implements AfterViewInit {

  report;

  constructor() {

  }

  repoList: any;

  get customComponentList() {
    return _.toPairs(customGraphicMeta);
  }

  dragstart(dragEvent: DragEvent) {
    const
      componentName = (<HTMLElement>dragEvent.target).getAttribute('componentName'),
      mouseMove = (event: MouseEvent) => {
        grabHelper.refresh(event.pageX, event.pageY);
      },
      mouseUp = (event: MouseEvent) => {
        console.log('document mouseup', event, session.currentPage.offset());

        graphicFactory.createByName(componentName, session.currentPage,
          event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
          event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
        grabHelper.hidden();
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    grabHelper.show(dragEvent.pageX, dragEvent.pageY, ComponentRepositoryManager.getInstance().getComponentMetaByPath(componentName).grabOption);
    return false;
  }

  ngAfterViewInit() {
    ComponentRepositoryManager.getInstance().paletteConfig$.subscribe((value) => {
      this.repoList = value;
    });
  }
}

