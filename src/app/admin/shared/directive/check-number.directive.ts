import { Directive, Input } from "@angular/core";
import {
  Validator,
  NG_VALIDATORS,
  ValidationErrors,
  AbstractControl
} from "@angular/forms";
import { Subscription } from "rxjs";
import { isFulfilled } from "q";
import { MatGridTileHeaderCssMatStyler } from "@angular/material";
import { type } from "os";
@Directive({
  selector: "[checkNumber][ngModel]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CheckNumberDirective,
      multi: true
    }
  ]
})
export class CheckNumberDirective implements Validator {
  private _number = null;
  private _onChange = null;
  @Input()
  get checkNumber() {
    return this._number;
  }
  set checkNumber(value: Number) {
    if (typeof value === "string") {
      this._number = parseInt(value);
    } else if (typeof value === "number") {
      this._number = value;
      console.log(this._number);
    } else {
      this._number = null;
    }
    if (this._onChange) this._onChange();
  }
  constructor() {}

  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error("Method not implemented.");
    this._onChange = fn;
  }
  validate(c: AbstractControl): ValidationErrors {
    this._number = c.value;
    return isNaN(this._number)
      ? {
          invalidNumber: true
        }
      : null;
  }
}
