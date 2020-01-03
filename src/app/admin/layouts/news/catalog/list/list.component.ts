import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NewsCatalog } from './../../../../shared';
import { ApiService } from './../../../../shared';

import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxxComponent } from './../dialog-boxx/dialog-boxx.component';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  newsCatalog: NewsCatalog[];
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: any;
  endpoint =`Categories`;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>; //add
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  constructor(private api: ApiService, public dialog: MatDialog) { }

  ngOnInit() {
  	this.loadCatalogs();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }
  loadCatalogs() {
    const url= `${this.endpoint}/GetAll`;
    this.api.show(url).subscribe(
      (res: any) => {
            this.newsCatalog = res.Data;
            this.dataSource = new MatTableDataSource(this.newsCatalog);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // console.log(this.paginator);
            console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteStudent(id: any){
    const endpoint =`Categories/Remove`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadCatalogs();
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
    // add
    openDialog(action,obj) {
      obj.action = action;
      console.log(obj.CategoryId);
      const dialogRef = this.dialog.open(DialogBoxxComponent, {
        width: '550px',
        data:obj
      });
      let id= obj.CategoryId;
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
          this.addRowData(result.data);
        } else if(result.event == 'Edit'){
          this.updateRowData(result.data, `Categories/Edit`);
        } else if(result.event == 'Remove'){
          this.deleteRowData(id,`Categories/Remove`);
        }
      });
    }
    addRowData(row_obj){
      this.api.store(row_obj,'Categories').subscribe(
        (res: any) => {
              this.loadCatalogs();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    updateRowData(row_obj, endpoint){
      this.api.update(row_obj, endpoint).subscribe(
        (res: any) => {
          this.loadCatalogs();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    deleteRowData(id, endpoint){
      if(id==1 || id ==14 ){
        alert('Bạn không thể xóa mục này!');
        return false;
      }else{
        this.api.destroy(id, endpoint).subscribe(
          (res: any) => { this.loadCatalogs(); },
          (err: any) => {
            console.log(err);
          }
        )
      }
    }
}
