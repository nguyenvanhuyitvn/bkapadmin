import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { learningCategory, learningDocument, Config } from './../../../../shared';
import { ApiService } from './../../../../shared';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  documents: learningDocument[] = [];
  // catalog: learningCategory[] = [];
  displayedColumns: string[] = ['id', 'documentsName', 'documentsCate', 'documentsDescription','documentsFile', 'thumpnail','status','action'];
  dataSource: MatTableDataSource<learningDocument>;
  cate_slug: string = 'all';
  endpoint =`Documents/GetAll`;
  subscription: Subscription;
  subscription1: Subscription;
  subId: Subscription;
  DocumentTypeId: any;
  DocumentTypes: learningCategory[] = [];
  title: string ="Tiêu đề";
  // Image Url
  urlCfg = new Config;
  imgURL: any = this.urlCfg.url;
  // endpoint =`learning/document/index`;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.route.params.subscribe(params =>{
      this.DocumentTypeId = params['type'];
    });
  }

  ngOnInit() {
    this.loadDocumentTypeMenu();
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
    this.subId = this.route.params.subscribe(params => {
      this.DocumentTypeId = params['type'];
      this.subscription = this.api.show(this.endpoint).subscribe(
        (res: any) => {
            this.documents = [];
            var k = 0;
            for(let i in res.Data){
              if( res.Data[i]['DocTypeId'] == this.DocumentTypeId ) {
                this.title = res.Data[i]['DocTypeName'];
                this.documents[k] = res.Data[i];
                k++;
              }
            }
            this.dataSource = new MatTableDataSource(this.documents);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
              // console.log(this.paginator);
        },
        (err: any) => {
          console.log(err);
        }
      );
    });

  }
  deleteDocument(id: any){
    const endpoint =`Documents/Remove`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.subscription1 = this.api.destroy(id, endpoint).subscribe(
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
  loadDocumentTypeMenu(){
    this.subscription = this.api.show('DocumentTypes/GetAll').subscribe(
      (res: any) => {
        this.DocumentTypes = res.Data;
      },
      (err: any ) => { console.log(err) }
    )
  }
  apply(id, DocStatus) {
    DocStatus = !DocStatus;
    const formData = {DocStatus: DocStatus};
    const endpoint = 'Documents'
    return this.api.quickUpdate(id, this.documents, endpoint).subscribe(
            (res: any) => {
              this.loadDocuments();
            }
      );
  }
  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    if(this.subscription1){
      this.subscription1.unsubscribe();
    }
    if(this.subId){
      this.subId.unsubscribe();
    }
  }
}
