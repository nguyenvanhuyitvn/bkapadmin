import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Subject, Course } from './../../../shared/models';
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
export class EditComponent implements OnInit,OnDestroy {

  subscription: Subscription;
  subGetById: Subscription;
  endpoint: String;
  id: any;
  color = 'accent';
  // Init Object
  subject: Subject={SubjectId:'',  SubjectName: '', Hours: null, CourseId: null, Status: null};
  courses: Course[];
  // Init Form
  SubjectName = new FormControl('' , [ Validators.required ]);
  Hours = new FormControl('' , [ Validators.required ]);
  CourseId = new FormControl('' , [ Validators.required ]);
  Status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.subGetById) {
      this.subGetById.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadSubjectById();
    this.loadCourse();
  }
  loadSubjectById(){
    this.route.params.subscribe(params => {
      const endpoint = `Subject/Get`;
      this.id = params['id'];
      this.subGetById = this.api.getDetail(this.subject, endpoint, params['id']).subscribe(res => {
        this.subject = res.Data;
      });
    });
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
    const endpoint = `Subject/Edit`;
    const SubjectId = this.subject.SubjectId;
    this.subject.SubjectId = SubjectId.replace(/\s/g,'');
    this.subscription = this.api.update(this.subject, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/admin/mon-hoc']);
      }
      );
    }

}
