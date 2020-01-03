import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { learningCategory } from './../../../../shared';
import { ApiService } from './../../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  learningCategory: learningCategory[];
  displayedColumns: string[] = ['id', 'name','status','action'];
  dataSource: MatTableDataSource<learningCategory>;
  endpoint =`DocumentTypes/GetAll`;
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
  	this.loadCategory();
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
  loadCategory() {
    this.subscription = this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.learningCategory = res.Data;
            this.dataSource = new MatTableDataSource(this.learningCategory);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.learningCategory);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteCategory(id: any){
    const endpoint =`DocumentTypes/Remove`;
    if(id == 1 || id==2 || id ==3 || id == 5 || id ==14 || id==15){
      alert('Bạn không thể xóa mục này!')
      return false;
    }else{
      const check = confirm('Bạn có chắc chắn muốn xóa?');
      if (check) {
        this.api.destroy(id, endpoint).subscribe(
          (res: any)=>{
            this.loadCategory();
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

    }
  apply(id, status) {
    status = !status;
    const formData = {status: status};
    const endpoint = 'learning/catalog'
    return this.api.quickUpdate(id, formData, endpoint).subscribe(
            (res: any) => {
              this.loadCategory();
            }
      );
  }

}
