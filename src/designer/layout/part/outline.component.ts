import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { session } from '@core/node/utils/session';
import { Subscription } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';
import { IReportPage } from '@core/node/page/report/page.interface';
import { RegionController } from '@core/node/region/region.controller';
import { Destroyable } from '../../shared/interface/destroyable';


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
    _subscription.add(session.pageChange.subscribe((currentPage: IReportPage) => {
      if (_regionArrayChangeSubscription) {
        _regionArrayChangeSubscription.unsubscribe();
        _subscription.remove(_regionArrayChangeSubscription);
      }
      _regionArrayChangeSubscription = currentPage
        .regionArray$.pipe(debounceTime(50),delay(100)).subscribe((regionArray: Array<RegionController>) => {
          console.log('regionArray', regionArray.length, regionArray);
          this.list = regionArray.map((region: RegionController) => {
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

