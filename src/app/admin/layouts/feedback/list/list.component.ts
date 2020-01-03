import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Feedback, User } from './../../../shared';
import { ApiService } from './../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  feedbacks: Feedback[];
  users: User[];
  displayedColumns: string[] = ['id', 'name', 'description','date','status','action'];
  dataSource: MatTableDataSource<Feedback>;
  endpoint =`Feedbacks/GetAll`;
  subscription: Subscription;
  subUser: Subscription;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public  typeFeedBack = [
    { id: 1, name: 'Chương trình đào tạo'},
    { id: 2, name: 'Hoạt động giảng dạy' },
    { id: 3, name: 'Cơ sở vật chất' },
    { id: 4, name: 'Dịch vụ đào tạo' }
  ];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadUsers();
    this.loadFeedbacks();
  }
  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
      if(this.subUser){
        this.subUser.unsubscribe();
      }
    }
  }
  loadUsers() {
    const endpoint = 'Students/GetAll'
    this.subUser = this.api.show(endpoint).subscribe(
        (res: any)=> {
          this.users = res.Data;
          console.log(this.users)
        },
        (err:any)=>{
          console.log(err);
        }
    )
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }
  loadFeedbacks() {
    this.subscription= this.api.show(this.endpoint).subscribe(
      (res: any) => {
        this.feedbacks = res.Data;
        this.dataSource = new MatTableDataSource(this.feedbacks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.feedbacks);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteFeeback(id: any){
    const endpoint =`Feedbacks/Remove`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadFeedbacks();
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
