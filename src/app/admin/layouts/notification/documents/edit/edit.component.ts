import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../../shared/services';
import { Documents } from './../../../../shared/models';
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
  // Init Object
  documents: Documents={ DocId: 0, DocName: '', DocDescription:'',DocTypeId:0, DocLink: '', DocImage: '', DocTypeName: '', DocStatus: 0};
  // Init Form

  DocName = new FormControl('' , [ Validators.required ]);
  DocDescription = new FormControl('', [ Validators.required ]);
  DocLink = new FormControl('' , [ Validators.required]);
  DocImage = new FormControl('' , [ Validators.required]);
  DocTypeName = new FormControl('' , [ Validators.required]);
  DocDocStatus = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadDocumentsById();
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
  }
  onFormSubmit() {
    // form data
    const endpoint = `documents/update/${this.id}`;
    if(this.documents.DocStatus == 1)
    {
      this.documents.DocStatus = 1;
      console.log(this.documents.DocStatus)
    }else{
      this.documents.DocStatus = 0;
      console.log(this.documents.DocStatus)
    }
    console.log(this.documents.DocTypeName);
    // date
    // let month = this.documentsDate.value.getMonth()+1;
    // let date =  this.documentsDate.value.getFullYear()+'-'+ month +'-'+ this.documentsDate.value.getDate();
    // this.documents.documentsDate = date;
    this.documents.DocDescription = $('#summernote').summernote('code');
     // form data
    this.formData.append('DocName', this.documents.DocName );
    this.formData.append('DocDescription', this.documents.DocDescription);
    this.formData.append('DocLink', this.documents.DocLink);
    this.formData.append('DocTypeId', this.documents.DocTypeId.toString());
    this.formData.append('DocTypeName', this.documents.DocTypeName);
    this.formData.append('DocStatus', this.documents.DocStatus.toString());
    this.formData.append('_method', "PUT")
    this.subscription = this.api.updateFile(this.formData, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/admin/bang-tin/van-ban']);
      }
  );
}
loadDocumentsById() {
  this.route.params.subscribe(params => {
    const endpoint = `documents/edit`;
    this.id = params['id'];
    this.api.getDetail(this.documents, endpoint, params['id']).subscribe(res => {
      this.documents = res;
      console.log(this.documents);
      $('#summernote').summernote('code', this.documents.DocDescription);
      this.url = `http://localhost:8080/api_resful/public/uploads/${res.documentsFile}`
    });
  });
}
uploadFile(event){
    let elem = event.target;
    if(elem.files.length > 0) {
      this.formData.append('DocImage', elem.files[0], elem.files[0].name);
      this.newFile = elem.files[0].name;
    }
  }

}
