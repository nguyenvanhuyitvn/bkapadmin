import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortArticlePipe } from './short-article.pipe';
import { TimeformatPipe } from './timeformat.pipe';
@NgModule({
  declarations: [ShortArticlePipe, TimeformatPipe],
  imports: [
    CommonModule
  ],
  exports: [ShortArticlePipe, TimeformatPipe]
})
export class PipeModule { }
