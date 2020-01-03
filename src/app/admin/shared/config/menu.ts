import { OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ApiService, learningCategory } from "src/app/admin/shared";
export class Menu {
  protected subscription: Subscription;
  public Menus: learningCategory[];

  constructor(private api: ApiService) {}

  // ngOnInit() {
  //   this.loadMenus();
  // }
loadMenus() {
  // tslint:disable-next-line: quotemark
  this.subscription = this.api.show("DocumentTypes/GetAll").subscribe(
  (res: any) => {
    console.log(res.Data);
    var title, slug;
    this.Menus = res.Data;
    var k = 0;
    for (let i in this.Menus) {

      title = this.Menus[i]["DocTypeName"];
      console.log(title)
      //Đổi chữ hoa thành chữ thường
      slug = title.toLowerCase();
      //Đổi ký tự có dấu thành không dấu
      slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
      slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
      slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
      slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
      slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
      slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
      slug = slug.replace(/đ/gi, "d");
      //Xóa các ký tự đặt biệt
      slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,"");
      //Đổi khoảng trắng thành ký tự gạch ngang
      slug = slug.replace(/ /gi, " - ");
      //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
      //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
      slug = slug.replace(/\-\-\-\-\-/gi, "-");
      slug = slug.replace(/\-\-\-\-/gi, "-");
      slug = slug.replace(/\-\-\-/gi, "-");
      slug = slug.replace(/\-\-/gi, "-");
      //Xóa các ký tự gạch ngang ở đầu và cuối
      slug = "@" + slug + "@";
      slug = slug.replace(/\@\-|\-\@|\@/gi, "");
      //In slug ra textbox có id “slug”
      this.Menus[k]["slug"] = slug;
    }
      console.log(this.Menus);
    },
    (err: any) => {
      console.log(err);
    }
  );
}
}
