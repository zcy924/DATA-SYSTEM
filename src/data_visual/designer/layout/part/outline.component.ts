import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';
import { Region } from '../../core/structure/region/region';
import { IReportPageInner } from '../../core/structure/page/report/page.interface';
import { session } from '../../utils/session';
import { Destroyable } from '@data-studio/shared';


@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.less'],
})
export class OutlineComponent extends Destroyable implements AfterViewInit, OnDestroy {
  list: Array<any> = [];

  constructor() {
    super();
  }

  ngAfterViewInit() {
    let _regionArrayChangeSubscription: Subscription, _subscription = new Subscription();
    _subscription.add(session.page.subscribe((currentPage: IReportPageInner) => {
      if (_regionArrayChangeSubscription) {
        _regionArrayChangeSubscription.unsubscribe();
        _subscription.remove(_regionArrayChangeSubscription);
      }
      _regionArrayChangeSubscription = currentPage
        .regionArray$.pipe(debounceTime(50),delay(100)).subscribe((regionArray: Array<Region>) => {
          console.log('regionArray', regionArray.length, regionArray);
          this.list = regionArray.map((region: Region) => {
            return region.invoke('desc');
          });
        });
      _subscription.add(_regionArrayChangeSubscription);
    }));
    this.onDestroy(() => {
      _subscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }
}

