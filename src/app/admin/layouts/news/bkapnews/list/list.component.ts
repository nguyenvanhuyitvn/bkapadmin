import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { News, Config } from './../../../../shared';
import { ApiService } from './../../../../shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  news: News[];
  displayedColumns: string[] = ['id', 'newsTitle', 'newsCatalog', 'newsContent', 'image', 'action'];
  dataSource: MatTableDataSource<News>;
  endpoint = `News/GetAll`;
  urlCfg = new Config;
  imgURL: any = this.urlCfg.url;
  subNews: Subscription;
  subDelete: Subscription;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public message: String = '';
  public isDeleted = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  constructor(private api: ApiService) { }

  ngOnInit() {
  	this.loadNews();
  }
  ngOnDestroy() {
    if (this.subNews) {
      this.subNews.unsubscribe();
    }
    if (this.subDelete) {
      this.subDelete.unsubscribe();
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
  loadNews() {
    this.subNews = this.api.show(this.endpoint).subscribe(
      (res: any) => {
            this.news = res.Data;
            this.dataSource = new MatTableDataSource(this.news);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // console.log(this.dataSource);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  deleteNews(id: any) {
    const endpoint = `News/Remove`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if ( check ) {
        this.subDelete = this.api.destroy(id, endpoint).subscribe(
          (res: any) => {
            this.loadNews();
            this.message = res.message;
            this.isDeleted = true;
          },
          (err: any) => {
            this.message = err.message;
            this.isDeleted = false;
            console.log( err );
          }
        );
      }
    }

}
