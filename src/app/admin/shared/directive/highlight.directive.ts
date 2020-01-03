import { Directive, Input } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { ApiService } from '../services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[appUnique][ngModel]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueDirective, multi: true }]
})
export class UniqueDirective implements AsyncValidator{
  private _string = null;
  private _onChange = null;
  @Input()
  get checkNumber() {
    return this._string;
  }
  set checkNumber(value: string) {
    if (typeof value === "string") {
      this._string = value;
    } else if (typeof value === "number") {
      this._string = value;
      console.log(this._string);
    } else {
      this._string = null;
    }
    if (this._onChange) this._onChange();
  }
  constructor(private api: ApiService) { }
  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error("Method not implemented.");
    this._onChange = fn;
  }
  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>{
    const q = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.api.getStudentByCode(c.value).subscribe(
          (res: any) => {
                console.log(res);
                if(res.StatusCode == 200){
                  resolve({ 'isCodeUnique': true});
                } else{
                  resolve(null);
                }
          },
          (err) => { resolve(null); });
      }, 1000);
    });
    return q;
  }

}
