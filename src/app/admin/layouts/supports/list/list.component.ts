import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Supports } from './../../../shared';
import { ApiService } from './../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  supports: Supports[];
  displayedColumns: string[] = ['id', 'title', 'description', 'classes', 'date', 'support_room', 'status','action'];
  dataSource: MatTableDataSource<Supports>;
  endpoint =`student/support`;
  subscription: Subscription;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public  supportRoom = [
    { id: 1, name: 'Trung tâm phần mềm'},
    { id: 2, name: 'Trung tâm BKNET' }
  ];
  constructor(private api: ApiService) { }

  ngOnInit() {
  	this.loadSupports();
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
  loadSupports() {
    this.subscription= this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.supports = res;
            // tslint:disable-next-line: forin
            for (const i in this.supportRoom) {
              for (const j in this.supports) {
                // tslint:disable-next-line: triple-equals
                if (this.supports[j].support_room == this.supportRoom[i].id) {
                  this.supports[j]['room'] = this.supportRoom[i].name;
                }
              }
            }
            this.dataSource = new MatTableDataSource(this.supports);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.supports);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteSupports(id: any){
    const endpoint =`student/supports/delete`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadSupports();
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
              this.loadSupports();
            }
      );
  }

}
