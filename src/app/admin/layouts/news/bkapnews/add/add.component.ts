import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { News } from './../../../../shared/models';
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
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {

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
  news: News={  Title: '', CategoryId: '', Content: '', Description: '', Images: '', Created: null, Status: 0 };
  catalogs: NewsCatalog[];
  // Init Form
  Title = new FormControl('' , [ Validators.required ]);
  Content = new FormControl('');
  Description = new FormControl('');
  CategoryId = new FormControl('' , [ Validators.required]);
  // slug = new FormControl('' , [ Validators.required]);
  Status = new FormControl('' , [ Validators.required]);
  Created = new FormControl(new Date() , [ Validators.required]);
  Images = new FormControl('' , [ Validators.required]);
  file = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  imgURL: any ='assets/img/no-image.png';

  // Constructor
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
      }
    if (this.subscription1) {
        this.subscription1.unsubscribe();
      }
  }
  ngOnInit() {
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
  loadCatalog(){
    this.apiService.show('Categories/GetAll').subscribe(
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
      const endpoint = `News`;
      const imgEndpoint = `Students/Uploads`;
      this.subscription = this.apiService.updateFile(this.formImages, imgEndpoint).subscribe(
        (res: any) => {
          // console.log("ok1");
          if(res.StatusCode == 200){
             this.news.Images = res.Data;
             const date = new Date();
             this.news.Created = date.toLocaleDateString();
            //  this.news.NewsId = 3;
             this.subscription1 = this.apiService.store(this.news, endpoint).subscribe(
               // tslint:disable-next-line: no-shadowed-variable
               ( res: any) => {
                 console.log(res);
               }
             );
          }
          this.router.navigate(['/admin/tin-tuc']);
          // this.router.navigateByUrl('/admin/tin-tuc');
        }
    );
}
read(){
  console.log("ok");
}
uploadFile(event){
    let elem = event.target;
    if(elem.files.length > 0) {
      // console.log(elem.files[0])
      this.formImages.append('file', elem.files[0], elem.files[0].name);
      var reader = new FileReader();
      this.imagePath = elem;
      reader.readAsDataURL(elem.files[0]);
      reader.onload = ( _event ) => {
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
}
