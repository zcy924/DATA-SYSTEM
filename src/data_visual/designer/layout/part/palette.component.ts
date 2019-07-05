import { AfterViewInit, Component } from '@angular/core';
import { grabHelper } from '../designer.header.component';
import { ComponentRepositoryManager } from '@data-studio/shared';
import { session } from '../../utils/session';

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

  dragstart(dragEvent: DragEvent) {
    const
      componentPath = (<HTMLElement>dragEvent.target).getAttribute('componentPath'),
      mouseMove = (event: MouseEvent) => {
        grabHelper.refresh(event.pageX, event.pageY);
      },
      mouseUp = (event: MouseEvent) => {
        console.log('document mouseup', event, session.currentPage.offset());

        session.currentPage.createGraphic(componentPath,
          event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
          event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
        grabHelper.hidden();
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    grabHelper.show(dragEvent.pageX, dragEvent.pageY, ComponentRepositoryManager.getInstance().getComponentMeta(componentPath).grabOption);
    return false;
  }

  ngAfterViewInit() {
    ComponentRepositoryManager.getInstance().paletteConfig$.subscribe((value) => {
      this.repoList = value;
    });
  }
}

