import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { learningCategory } from './../../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  subscription: Subscription;
  endpoint: String;
  color = 'accent';
  // Init Object
  category: learningCategory={ DocTypeId: 0, DocTypeName: '', DocTypeStatus: 0};
  // Init Form
  DocTypeId: any;
  DocTypeStatus = new FormControl('' , [ Validators.required ]);
  DocTypeName = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  // Constructor
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {}
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
      }
  }
  ngOnInit() {
    this.loadCategoryById();
   }

  loadCategoryById() {
    this.route.params.subscribe(params => {
      const endpoint = `DocumentTypes/Get`;
      this.DocTypeId = params['id'];
      this.api.getDetail(this.category, endpoint, params['id']).subscribe(res => {
        this.category = res.Data;
        console.log(this.category);
      });
    });
    }
 // Submit Form
 onFormSubmit() {
      const endpoint = `DocumentTypes/Edit`;
      this.subscription = this.api.update(this.category, endpoint).subscribe(
        (res: any) => {
          console.log(res);
          this.router.navigate(['/admin/tai-lieu-hoc-tap/danh-muc']);
        }
    );
}

}
