import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Course } from './../../../shared/models';
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

  subscription: Subscription;
  endpoint: String;
  id: any;
  message:any;
  color = 'accent';
  // Init Object
  course: Course={ CourseId: '', CourseName: '', Description:'', Status: 0};
  // Init Form
  CourseId = new FormControl('' , [ Validators.required ]);
  CourseName = new FormControl('' , [ Validators.required ]);
  Description = new FormControl('' , [ Validators.required ]);
  Status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadCourse();
  }
  loadCourse(){
    this.route.params.subscribe(params => {
      const endpoint = `Course/Get`;
      this.id = params['id'];
      this.api.getDetail(this.course, endpoint, params['id']).subscribe(res => {
        // console.log(res);
        this.course = res.Data;
      });
    });
  }
  onFormSubmit() {
    if(this.course.Status == 1)
    {
      this.course.Status = 1;
      console.log(this.course.Status);
    }else{
      this.course.Status = 0;
      console.log(this.course.Status);
    }
    // form data
    const endpoint = `Course/Edit`;
    this.subscription = this.api.update(this.course, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        if(res.StatusCode == 403){
          this.message = "Mã khóa học đã tồn tại.";
          alert(this.message);
          console.log(this.message);
        }else{
          this.router.navigate(['/admin/khoa-hoc']);
        }
      }
  );
}
}
