import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Students, Config } from './../../../shared';
import { ApiService } from './../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  students: Students[];
  displayedColumns: string[] = [ 'ID','Code', 'Name', 'ClassName', 'Email', 'Phone', 'Address','Image','Birthday','Gender','Status','Action'];
  dataSource: MatTableDataSource<Students>;
  endpoint =`Students/GetAll`;
  subscription: Subscription;
  urlCfg = new Config;
  imgURL: any = this.urlCfg.url;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  constructor(private api: ApiService) { }

  ngOnInit() {
  	this.loadStudents();
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
  loadStudents() {
    this.subscription= this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.students = res.Data;
            console.log(this.students);
            for(let i in this.students){
              if(this.students[i]['Gender']== 1){
                this.students[i]['gender'] = "Nam";
              }else{
                this.students[i]['gender'] = "Nữ";
              }
            }
            this.dataSource = new MatTableDataSource(this.students);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.students);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteStudent(id: any){
    const endpoint =`student/std/delete`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadStudents();
          this.message = res.message;
          this.isDeleted = true;
        },
        (err: any)=> {
          this.message= err.message;
          this.isDeleted = false;
          console.log(err);
        }
      )
    }
    }
  apply(id, status) {
    status = !status;
    const formData = {status: status};
    const endpoint = 'student/std'
    return this.api.quickUpdate(id, formData, endpoint).subscribe(
            (res: any) => {
              this.loadStudents();
            }
      );
  }
}
