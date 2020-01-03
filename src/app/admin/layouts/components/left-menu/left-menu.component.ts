import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService, Menu } from 'src/app/admin/shared';
@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {
  protected subscription: Subscription;
  public DocumentTypeMenu: any = [];
  public Menus: any = [];
  // tslint:disable-next-line: new-parens
  userName = sessionStorage.getItem('user_id')
  constructor(private api: ApiService) {

  }

  ngOnInit() {
    // this.Menus = new Menu(this.api);
    // this.Menus.loadMenus();
    this.loadDocumentTypeMenu();
  }
  loadDocumentTypeMenu(){
    this.subscription = this.api.show('DocumentTypes/GetAll').subscribe(
      (res: any) => {
        this.DocumentTypeMenu = res.Data;
        console.log(this.DocumentTypeMenu);
      },
      (err: any ) => { console.log(err) }
    )
  }
}
