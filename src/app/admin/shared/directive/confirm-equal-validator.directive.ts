import { Validator, NG_VALIDATORS, ValidationErrors, AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[compare]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CompareEqualValidatorDirective,
    multi: true
  }]
})
export class CompareEqualValidatorDirective implements Validator {

  @Input('compare') controlNameToCompare: string;
      validate(c: AbstractControl): ValidationErrors |null {
        // check match khi thay đổi ở input.password
        if(c.value ===null || c.value.length === 0){
          return null;
        }
        // check match giữa hai ô input.password và input.confirmPassword
        const controlToCompare = c.root.get(this.controlNameToCompare);
        if(controlToCompare){
          const subscription: Subscription = controlToCompare.valueChanges.subscribe(()=>{
            c.updateValueAndValidity();
            console.log(controlToCompare);
            subscription.unsubscribe();
          });
        }
        return controlToCompare && controlToCompare.value !== c.value? {'compare': true} : null;
    }

}
