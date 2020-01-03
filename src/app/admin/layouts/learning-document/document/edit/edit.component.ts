import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { Config, learningCategory, Documents } from './../../../../shared';
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
export class EditComponent implements OnInit,OnDestroy {

  subscription: Subscription;
  subscription1: Subscription;
  endpoint: String;
  id: any;
  imgEdit: any ='';
  color = 'accent';
  imgURL: any ='assets/img/no-image.png';
  public imagePath;
  public formImages = new FormData();
  private flag: Boolean = false;
  // Init Object
  documents: Documents = { DocId: 0 , DocName:'', DocLink:'', DocDescription:'',DocTypeId: 0, DocImage:'', DocTypeName:'', DocStatus: 0};
  catalogs: learningCategory[]=[];
  // Init Form
  DocName = new FormControl('' , [ Validators.required ]);
  DocDescription = new FormControl('', [ Validators.required ]);
  DocTypeId = new FormControl('' , [ Validators.required]);
  DocLink = new FormControl('' , [ Validators.required]);
  DocImage = new FormControl('' , [ Validators.required]);
  DocTypeName = new FormControl('' , [ Validators.required]);
  DocStatus = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    $('#summernote').summernote({
      placeholder: 'Nội dung yêu cầu...',
      tabsize: 2,
      height: 100,                 // set editor height
      minHeight: null,             // set minimum height of editor
      maxHeight: null,             // set maximum height of editor
      focus: true                  // set focus to editable area after initializing summernote
    });
    $(".showonhover").click(function(){
      $("#file").trigger('click');
    });
    $("#upfile1").click(function(){
      $("#image").trigger('click');
    });
    this.loadCatalog();
    this.loadDocumentsById();
  }
  onFormSubmit() {
    // form data
    if(this.documents.DocStatus == 1)
    {
      this.documents.DocStatus = 1;
      console.log(this.documents.DocStatus)
    }else{
      this.documents.DocStatus = 0;
      console.log(this.documents.DocStatus)
    }
    this.documents.DocDescription = $('#summernote').summernote('code');
     // form data
    const imgEndpoint = `Students/Uploads`;
    const endpoint = `Documents/Edit`;
    if(this.flag){
      this.subscription = this.api.updateFile(this.formImages, imgEndpoint).subscribe(
        (res: any) => {
          console.log(res);
          if(res.StatusCode == 200){
            this.documents.DocImage = res.Data;
            this.subscription1 = this.api.update(this.documents, endpoint).subscribe(
              // tslint:disable-next-line: no-shadowed-variable
              ( res: any) => {
                console.log("Result:",res);
                this.router.navigate(['/admin/tai-lieu-hoc-tap']);
              }
            );
         }
          this.router.navigate(['/admin/tai-lieu-hoc-tap']);
        });
    } else{
      this.subscription1 = this.api.update(this.documents, endpoint).subscribe(
        // tslint:disable-next-line: no-shadowed-variable
        ( res: any) => {
          console.log("Result:", res);
        }
      );
      this.router.navigate(['/admin/tai-lieu-hoc-tap']);
    }
}
uploadImage(event){
    let elem = event.target;
    if(elem.files.length > 0) {
      this.flag = true;
      this.formImages.append('image', elem.files[0], elem.files[0].name);
      var reader = new FileReader();
      this.imagePath = elem;
      reader.readAsDataURL(elem.files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
  }
  loadDocumentsById() {
    const urlCfg = new Config;
    this.route.params.subscribe(params => {
      const endpoint = `Documents/Get`;
      this.id = params['id'];
      this.api.getDetail(this.documents, endpoint, params['id']).subscribe(res => {
        this.documents = res.Data;
        $('#summernote').summernote('code', this.documents.DocDescription);
        const imgName = res.Data.DocImage;
        this.imgURL = `${urlCfg.url}${imgName}`;
      });
    });
  }
  loadCatalog(){
      this.api.show('DocumentTypes/GetAll').subscribe(
        (res: any) => {
              this.catalogs = res.Data;
              console.log(this.catalogs)
        },
        (err: any) => {
          console.log(err);
        }
      );
    }

}
