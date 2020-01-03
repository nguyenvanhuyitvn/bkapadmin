import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { Schedule, Class } from './../../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $: any;
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  endpoint: String;
  id: any;
  url: any;
  color = 'accent';
  newFile: any;
  public formData = new FormData();
  classes: Class[];
  // Init Object
  schedule: Schedule={ id: null, scheduleTitle: '', className:'', file: '', status: null, slug: ''};
  // Init Form
  scheduleTitle = new FormControl('' , [ Validators.required ]);
  className = new FormControl('', [ Validators.required ]);
  file = new FormControl('' , [ Validators.required]);
  slug = new FormControl('' , [ Validators.required]);
  status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadScheduleById();
    this.loadClass();
    $(".showonhover").click(function(){
      $("#file").trigger('click');
    });
  }
  onFormSubmit() {
    // form data
    const endpoint = `schedule/update/${this.id}`;
    if(this.schedule.status == 1)
    {
      this.schedule.status = 1;
      console.log(this.schedule.status)
    }else{
      this.schedule.status = 0;
      console.log(this.schedule.status)
    }
     // form data
    this.formData.append('scheduleTitle', this.schedule.scheduleTitle );
    this.formData.append('className', this.schedule.className);
    this.formData.append('slug', this.schedule.slug);
    this.formData.append('status', this.schedule.status.toString());
    this.formData.append('_method', "PUT")
    this.subscription = this.api.updateFile(this.formData, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/admin/bang-tin/thoi-khoa-bieu']);
      }
  );
}
loadClass(){
  const endpoint = 'classes';
  this.api.show(endpoint).subscribe(
    (res: any) => {
          this.classes = res;
          console.log(this.classes);
    },
    (err: any) => {
      console.log(err);
    }
  );
}
loadScheduleById() {
  this.route.params.subscribe(params => {
    const endpoint = `schedule/edit`;
    this.id = params['id'];
    this.api.getDetail(this.schedule, endpoint, params['id']).subscribe(res => {
      this.schedule = res;
      console.log(this.schedule);
      this.url = `http://localhost:8080/api_resful/public/uploads/${res.scheduleFile}`
    });
  });
}
uploadFile(event){
    let elem = event.target;
    if(elem.files.length > 0) {
      this.formData.append('file', elem.files[0], elem.files[0].name);
      this.newFile = elem.files[0].name;
    }
  }
ChangeToSlug()
  {
    var name, news_slug;
    // Lấy text từ thẻ input name
    name = this.schedule.scheduleTitle;
    // Đổi chữ hoa thành chữ thường
    news_slug = name.toLowerCase();
    // Đổi ký tự có dấu thành không dấu
    news_slug = news_slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    news_slug = news_slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    news_slug = news_slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    news_slug = news_slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    news_slug = news_slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    news_slug = news_slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    news_slug = news_slug.replace(/đ/gi, 'd');
    // Xóa các ký tự đặt biệt
    news_slug = news_slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // Đổi khoảng trắng thành ký tự gạch ngang
    news_slug = news_slug.replace(/ /gi, "-");
    // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    news_slug = news_slug.replace(/\-\-\-\-\-/gi, '-');
    news_slug = news_slug.replace(/\-\-\-\-/gi, '-');
    news_slug = news_slug.replace(/\-\-\-/gi, '-');
    news_slug = news_slug.replace(/\-\-/gi, '-');
    // Xóa các ký tự gạch ngang ở đầu và cuối
    news_slug = '@' + news_slug + '@';
    news_slug = news_slug.replace(/\@\-|\-\@|\@/gi, '');
    // In slug ra textbox có id “slug”
    this.schedule.slug = news_slug;
  }

}
