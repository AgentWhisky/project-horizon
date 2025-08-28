import { NgModule } from '@angular/core';
import { HzBannerComponent } from './hz-banner/hz-banner.component';
import { HzBannerHeaderComponent } from './hz-banner-header/hz-banner-header.component';
import { HzBannerBodyComponent } from './hz-banner-body/hz-banner-body.component';

@NgModule({
  imports: [HzBannerComponent, HzBannerHeaderComponent, HzBannerBodyComponent],
  exports: [HzBannerComponent, HzBannerHeaderComponent, HzBannerBodyComponent],
})
export class HzBannerModule {}
