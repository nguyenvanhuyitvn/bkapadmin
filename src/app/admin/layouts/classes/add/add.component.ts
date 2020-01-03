import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Class } from './../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $: any;
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  endpoint: String;
  id: any;
  color = 'accent';
  // Init Object
  classes: Class={ id: null, ClassName: '', Status: null};
  // Init Form
  ClassName = new FormControl('', [ Validators.required ]);
  status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
  }
  onFormSubmit() {
    // form data
    const endpoint = `Classes`;
    if(this.classes.Status == 1)
      {
        this.classes.Status = 1;
        console.log(this.classes.Status)
      }else{
        this.classes.Status = 0;
        console.log(this.classes.Status)
      }
    console.log(this.classes.Status)
    this.subscription = this.api.store(this.classes, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/admin/lop-hoc']);
      }
  );
}

}
