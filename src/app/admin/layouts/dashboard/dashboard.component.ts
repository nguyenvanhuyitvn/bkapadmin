import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiService, Students } from './../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  students: Students[];
  countStudents: any;
  countFeedback: any;
  countDocuments: any;
  countSupports: any;
  subscription: Subscription;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadStudents();
    this.loadFeedback();
    this.loadDocuments();
    this.loadNews();
  }
  loadStudents() {
    const endpoint =`Students/GetAll`;
    this.subscription= this.api.show(endpoint).subscribe(
      (res: any) => {
            this.students = res.Data;
            this.countStudents = this.students.length;
            console.log(this.countStudents);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  loadFeedback() {
    const endpoint =`Feedbacks/GetAll`;
    this.subscription= this.api.show(endpoint).subscribe(
      (res: any) => {
            this.countFeedback = res.Data.length;
            console.log(this.countFeedback);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  loadDocuments() {
    const endpoint =`Documents/GetAll`;
    this.subscription= this.api.show(endpoint).subscribe(
      (res: any) => {
            this.countDocuments = res.Data.length;
            console.log(this.countDocuments);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  loadNews() {
    const endpoint =`News/GetAll`;
    this.subscription= this.api.show(endpoint).subscribe(
      (res: any) => {
            this.countSupports = res.Data.length;
            console.log(this.countSupports);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
