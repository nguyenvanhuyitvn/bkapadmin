import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareEqualValidatorDirective } from './directive/confirm-equal-validator.directive';
import { UniqueDirective } from './directive/highlight.directive';
import { CheckNumberDirective } from './directive/check-number.directive';
@NgModule({
  declarations: [CompareEqualValidatorDirective, UniqueDirective, CheckNumberDirective],
  imports: [
    CommonModule
  ],
  exports: [CompareEqualValidatorDirective, CheckNumberDirective, UniqueDirective]
})
export class SharedModule { }
