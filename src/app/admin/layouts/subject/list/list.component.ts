import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from './../../../shared';
import { ApiService } from './../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  subjects: Subject[];
  displayedColumns: string[] = ['id', 'subjectName','subjectHours','course_id','status','action'];
  dataSource: MatTableDataSource<Subject>;
  endpoint =`Subjects/GetAll`;
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
  	this.loadSubjects();
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
  loadSubjects() {
    this.subscription= this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.subjects = res.Data;
            this.dataSource = new MatTableDataSource(this.subjects);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.subjects);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteSubject(id: any){
    const endpoint =`Subjects/Remove`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadSubjects();
        },
        (err: any)=> {
          console.log(err);
        }
      )
    }
    }
  apply(id, status) {
    status = !status;
    const formData = {status: status};
    const endpoint = 'Subjects'
    return this.api.quickUpdate(id, formData, endpoint).subscribe(
            (res: any) => {
              this.loadSubjects();
            }
      );
  }

}
