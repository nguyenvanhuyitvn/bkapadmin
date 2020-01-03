import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User, Config } from './../../../shared';
import { ApiService } from './../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  users: User[];
  urlCfg = new Config;
  imgURL: any = this.urlCfg.url;
  id: any;
  displayedColumns: string[] = ['id', 'fullname','username','birthday','address','gender','avatar','status','action'];
  dataSource: MatTableDataSource<User>;
  endpoint =`Users/GetAll`;
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
    this.loadUsers();
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

  loadUsers() {
    const endpoint = 'Users/GetAll'
    this.subscription = this.api.show(endpoint).subscribe(
        (res: any)=> {
          this.users = res.Data;
          for(let i in this.users){
            if(this.users[i]['Gender']== true){
              this.users[i]['gender'] = "Nam";
            }else{
              this.users[i]['gender'] = "Nữ";
            }
          }
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        (err:any)=>{
          console.log(err);
        }
    )
  }
  deleteUser(id: any){
    const endpoint =`Users/Remove`;
    if(id=='ce8bcf1b-d234-4a8f-b291-1d89d1f67cea'){
      alert('Bạn không thể xóa tài khoản Administrator!');
      return false;
    }else{
      const check = confirm('Bạn có chắc chắn muốn xóa?');
      if (check) {
        this.api.destroy(id, endpoint).subscribe(
          (res: any)=>{
            this.loadUsers();
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
    const endpoint = 'Users'
    return this.api.quickUpdate(id, formData, endpoint).subscribe(
            (res: any) => {
              this.loadUsers();
            }
      );
  }

}
