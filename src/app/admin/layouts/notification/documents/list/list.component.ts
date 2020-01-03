import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Documents, Config } from './../../../../shared';
import { ApiService } from './../../../../shared';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  documents: Documents[];
  displayedColumns: string[] = ['id', 'documentsName', 'documentsDescription', 'documentsDate', 'documentsFile', 'status','action'];
  dataSource: MatTableDataSource<Documents>;
  endpoint =`documents`;
  docUrl: any ='';
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadDocuments();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }
  loadDocuments() {
    let urlCfg= new Config;
    this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.documents = res;
            this.dataSource = new MatTableDataSource(this.documents);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            const documentsName = res.Data[0].documentsFile;
            this.docUrl = `${urlCfg.url}/${documentsName}`;
            console.log(this.documents);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteDocuments(id: any){
    const endpoint =`student/std/delete`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.loadDocuments();
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
    const endpoint = 'documents'
    return this.api.quickUpdate(id, formData, endpoint).subscribe(
            (res: any) => {
              this.loadDocuments();
            }
      );
  }
}
