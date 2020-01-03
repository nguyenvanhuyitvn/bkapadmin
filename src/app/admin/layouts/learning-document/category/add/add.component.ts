import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { learningCategory } from './../../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class AddComponent implements OnInit,OnDestroy {

  public message: string;
  public formData = new FormData();
  subscription: Subscription;
  endpoint: String;
  color = 'accent';
  // Init Object
  category: learningCategory={ DocTypeId: 0, DocTypeName: '', DocTypeStatus: 0};
  categories: learningCategory[];
  // Init Form
  DocTypeName = new FormControl('' , [ Validators.required]);
  DocTypeStatus = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  // Constructor
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}
  ngOnInit() {
    this.loadCategory();
   }
  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
      }
  }
  loadCategory() {
    this.subscription = this.apiService.show('DocumentTypes/GetAll').subscribe(
      (res: any) => {
            this.categories = res.Data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
 // Submit Form
  onFormSubmit() {
        if(this.category.DocTypeStatus == 1)
          {
            this.category.DocTypeStatus = 1;
          }
        else {
            this.category.DocTypeStatus = 0;
          }
        const endpoint = `DocumentTypes`;
        this.subscription = this.apiService.store(this.category, endpoint).subscribe(
          (res: any) => {
            console.log(res);
            this.router.navigate(['/admin/tai-lieu-hoc-tap/danh-muc']);
          }
      );
        // this.router.navigate(['/admin/tai-lieu-hoc-tap/danh-muc']);
  }

}
