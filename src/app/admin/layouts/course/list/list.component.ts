import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from './../../../shared';
import { ApiService } from './../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  course: Course[];
  displayedColumns: string[] = ['id', 'CourseName', 'Description','Status','action'];
  dataSource: MatTableDataSource<Course>;
  endpoint =`Course/GetAll`;
  subscription: Subscription;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  constructor(private api: ApiService) { }

  ngOnInit() {
  	this.loadCourse();
  }
  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }
  loadCourse() {
    this.subscription= this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.course = res.Data;
            this.dataSource = new MatTableDataSource(this.course);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.course);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteCourse(id: any){
    const endpoint =`Course/Remove`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadCourse();
        },
        (err: any)=> {
          console.log(err);
        }
      )
    }
    }
  apply(id, Status) {
    Status = !Status;
    const formData = {Status: Status};
    const endpoint = 'Course'
    return this.api.quickUpdate(id, formData, endpoint).subscribe(
            (res: any) => {
              this.loadCourse();
            }
      );
  }

}
