import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { learningDocument, learningCategory, Documents } from './../../../../shared/models';
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
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  subscription1: Subscription;
  endpoint: String;
  id: any;
  color = 'accent';
  imgURL: any ='assets/img/no-image.png';
  public imagePath;
  public formImages = new FormData();
  // Init Object
  // tslint:disable-next-line: max-line-length
  documents: Documents = { DocId: 0 , DocName:'', DocLink:'', DocDescription:'',DocTypeId: 0,DocImage:'', DocTypeName:'', DocStatus: 0};
  catalogs: learningCategory[]=[];
  // Init Form
  DocName = new FormControl('' , [ Validators.required ]);
  DocLink = new FormControl('', [ Validators.required ]);
  DocDescription = new FormControl('' , [ Validators.required]);
  DocTypeId = new FormControl('' , [ Validators.required]);
  DocTypeName = new FormControl('' , [ Validators.required]);
  DocImage = new FormControl('' , [ Validators.required]);
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
  }
  onFormSubmit() {
    // form data
    const endpoint = `Documents`;
    const imgEndpoint = `Students/Uploads`;
    if(this.documents.DocStatus == 1)
    {
      this.documents.DocStatus = 1;
      console.log(this.documents.DocStatus)
    }else{
      this.documents.DocStatus = 0;
      console.log(this.documents.DocStatus)
    }
    this.documents.DocDescription = $('#summernote').summernote('code');
    this.subscription = this.api.updateFile(this.formImages, imgEndpoint).subscribe(
      (res: any) => {
        if(res.StatusCode == 200){
          this.documents.DocImage = res.Data;
          this.subscription1 = this.api.store(this.documents, endpoint).subscribe(
            (res: any) => {
              console.log(res);
              this.router.navigate(['/admin/tai-lieu-hoc-tap']);
            }
          );
        }
      }
  );

}

uploadImage(event){
    let elem = event.target;
    if(elem.files.length > 0) {
      this.formImages.append('image', elem.files[0], elem.files[0].name);
      var reader = new FileReader();
      this.imagePath = elem;
      reader.readAsDataURL(elem.files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
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
  change(){
    // tslint:disable-next-line: triple-equals
    if(this.documents.DocStatus.toString() == 'false')
    {
      this.documents.DocStatus = 0;
      console.log(this.documents.DocStatus)
    }else{
      this.documents.DocStatus = 1;
      console.log(this.documents.DocStatus)
    }
  }
}
