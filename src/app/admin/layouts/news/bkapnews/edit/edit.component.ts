import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { News, Config } from './../../../../shared';
import { NewsCatalog } from './../../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
declare var $: any;
/** Error when invalid control is dirty, touched, or submitted. */
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
export class EditComponent implements OnInit,OnDestroy {
  public flag: boolean=false;
  public imagePath;
  public message: string;
  editNews: FormGroup;
  public formData = new FormData();
  public formImages = new FormData();
  subscription: Subscription;
  subscription1: Subscription;
  endpoint: String;
  color = 'accent';
  // Init Object
  news: News = {  Title: '', CategoryId: '', Description: '', Images: '', Content:'', Status: 0, Created: null};
  catalogs: NewsCatalog[];
  // Init Form
  Title = new FormControl('' , [ Validators.required ]);
  Content = new FormControl('');
  Description = new FormControl('');
  CategoryId = new FormControl('' , [ Validators.required]);
  // slug = new FormControl('' , [ Validators.required]);
  Images = new FormControl('' , [ Validators.required]);
  Status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  imgURL: any ='';
  id: any;
  // Constructor
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {}
  // tslint:disable-next-line: use-lifecycle-interface

  ngOnInit() {

      this.loadNewsById();
      // SummerNote
      $('#summernote').summernote({
        placeholder: 'Nội dung yêu cầu...',
        tabsize: 2,
        height: 100,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: true                  // set focus to editable area after initializing summernote
      });
      $('#description').summernote({
        placeholder: 'Mô tả ngắn gọn yêu cầu...',
        tabsize: 2,
        height: 100,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: true                  // set focus to editable area after initializing summernote
      });
      // Custom upload file input
      $(".showonhover").click(function(){
      $("#file").trigger('click');
      });
      $('#upfile1').click(function () {
        $("#file").trigger('click');
      });
      this.loadCatalog();

  }

  loadNewsById() {
    const urlCfg = new Config;
    this.route.params.subscribe(params => {
      const endpoint = `News/Get`;
      this.id = params['id'];
      this.api.getDetail(this.news, endpoint, params['id']).subscribe(res => {
        this.news = res.Data;
        $('#summernote').summernote('code', this.news.Content);
        $('#description').summernote('code', this.news.Description);
        const imgName = res.Data.Images;
        this.imgURL = `${urlCfg.url}${imgName}`;
        console.log(this.imgURL);
      });
    });
  }
  loadCatalog(){
    this.api.show('Categories/GetAll').subscribe(
      (res: any) => {
            this.catalogs = res.Data;
            console.log(this.catalogs)
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
 // Submit Form
  onFormSubmit() {
      this.news.Content = $('#summernote').summernote('code');
      this.news.Description = $('#description').summernote('code');
      const endpoint = `News/Edit`;
      const imgEndpoint = `Students/Uploads`;
      if ( this.flag ) {
        this.subscription = this.api.updateFile(this.formImages, imgEndpoint).subscribe(
          (res: any) => {
            console.log(res);
            console.log( " Push Data: " , this.news);
            if(res.StatusCode == 200){
               this.news.Images = res.Data;
               this.subscription1 = this.api.update(this.news, endpoint).subscribe(
                 // tslint:disable-next-line: no-shadowed-variable
                 ( res: any) => {
                   console.log("Result:",res);
                   this.router.navigate(['/admin/tin-tuc']);
                 }
               );
            }
          });

      }else
      {
          console.log("Push Data:", this.news);
          this.subscription1 = this.api.update(this.news, endpoint).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            ( res: any) => {
              console.log("Result:", res);
            }
          );
          this.router.navigate(['/admin/tin-tuc']);
      }
  }
  uploadFile(event){
    let elem = event.target;
    if(elem.files.length > 0) {
      this.flag = true;
      // console.log(elem.files[0])
      this.formImages.append('file', elem.files[0], elem.files[0].name);
      // this.formImages.append('_method', "PUT");
      var reader = new FileReader();
      this.imagePath = elem;
      reader.readAsDataURL(elem.files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
  }

    change(){
      // tslint:disable-next-line: triple-equals
      if(this.news.Status.toString() == 'false')
      {
        this.news.Status = 0;
        console.log(this.news.Status)
      }else{
        this.news.Status = 1;
        console.log(this.news.Status)
      }
    }
    ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
        }
      if (this.subscription1) {
          this.subscription1.unsubscribe();
        }
    }
}
