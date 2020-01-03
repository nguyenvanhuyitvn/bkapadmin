import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Subject, Course } from './../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


function isNumber(c: AbstractControl):{ [key: string]:boolean} | null{
  if (c.value !== undefined && (isNaN(c.value))) {
    return { 'isNumber': true };
}
  return null;
}

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
  message: any;
  color = 'accent';
  // Init Object

  subject: Subject={SubjectId:'', SubjectName: '', CourseId:null, Hours: null, Status: 0};
  courses: Course[];
  // Init Form
  SubjectId = new FormControl('' , [ Validators.required ]);
  SubjectName = new FormControl('' , [ Validators.required ]);
  CourseId = new FormControl('', [ Validators.required ]);
  Hours = new FormControl('' , [ Validators.required]);
  Status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadCourse();

  }
  loadCourse(){
    const endpoint = 'Course/GetAll';
    this.api.show(endpoint).subscribe(
      (res: any) => {
            this.courses = res.Data;
            console.log(this.courses);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  onFormSubmit() {
    const endpoint = `Subjects`;
    if(this.subject.Status == 1)
      {
        this.subject.Status = 1;
      }
    else {
        this.subject.Status = 0;
      }
    // console.log(typeof this.subject.CourseId);
    const SubjectId = this.subject.SubjectId;
    this.subject.SubjectId = SubjectId.replace(/\s/g,'');
    this.subscription = this.api.store(this.subject, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        if(res.StatusCode == 401){
          this.message = "Mã môn học đã tồn tại.";
          alert("Mã môn học đã tồn tại.");
          console.log(this.message);
        }else{
          this.router.navigate(['/admin/mon-hoc']);
        }
      }
  );
}

}
