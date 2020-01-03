import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Class } from './../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  public formData = new FormData();
  subscription: Subscription;
  endpoint: String;
  id: any;
  color = 'accent';
  // Init Object
  classes: Class={ id: null, ClassName: '', Status: null};
  // Init Form
  ClassName = new FormControl('' , [ Validators.required ]);
  Status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadClass();
  }
  loadClass(){
    this.route.params.subscribe(params => {
      const endpoint = `Classes/Get`;
      this.id = params['id'];
      this.api.getDetail(this.classes, endpoint, params['id']).subscribe(res => {
        console.log(res)
        this.classes = res.Data;
      });
    });
  }
  onFormSubmit() {
    if(this.classes.Status == 1)
    {
      this.classes.Status = 1;
      console.log(this.classes.Status)
    }else{
      this.classes.Status = 0;
      console.log(this.classes.Status)
    }
    this.formData.append('slug', this.classes.ClassName);
    this.formData.append('status', this.classes.Status.toString());
    this.formData.append('_method', "PUT")
    // form data
    const endpoint = `classes/Edit`;
    this.subscription = this.api.update(this.classes, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/admin/lop-hoc']);
      }
  );
}

}
