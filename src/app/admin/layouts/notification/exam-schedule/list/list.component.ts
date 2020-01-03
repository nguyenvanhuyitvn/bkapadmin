import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Exam } from './../../../../shared';
import { ApiService } from './../../../../shared';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  exam: Exam[];
  displayedColumns: string[] = ['id', 'examTitle', 'className', 'examFile', 'status','action'];
  dataSource: MatTableDataSource<Exam>;
  endpoint =`exam`;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadExams();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }
  loadExams() {
    this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.exam = res;
            this.dataSource = new MatTableDataSource(this.exam);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.exam);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteExams(id: any){
    const endpoint =`exam/delete`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadExams();
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
    const endpoint = 'exam'
    return this.api.quickUpdate(id, formData, endpoint).subscribe(
            (res: any) => {
              this.loadExams();
            }
      );
  }

}
