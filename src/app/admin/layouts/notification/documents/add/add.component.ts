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
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit,OnDestroy {
  subscription: Subscription;
  endpoint: String;
  id: any;
  color = 'accent';
  public formData = new FormData();
  // Init Object
  documents: Documents={ DocId: 0, DocName: '', DocLink:'', DocTypeId: null, DocTypeName: '', DocImage: '', DocDescription: '', DocStatus: 0};
  // Init Form
   // Datepicker
  minDate = new Date(2019, 0, 1);
  maxDate = new Date(2100, 0, 1);
  DocName = new FormControl('' , [ Validators.required ]);
  documentsDescription = new FormControl('', [ Validators.required ]);
  documentsDate = new FormControl('' , [ Validators.required]);
  file = new FormControl('' , [ Validators.required]);
  slug = new FormControl('' , [ Validators.required]);
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
  }
  onFormSubmit() {
    // form data
    const endpoint = `documents`;
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
    this.formData.append('DocName', this.documents.DocName );
    this.formData.append('DocDescription', this.documents.DocDescription);
    this.formData.append('DocLink', this.documents.DocLink);
    this.formData.append('DocTypeId', this.documents.DocTypeId.toString());
    this.formData.append('DocStatus', this.documents.DocStatus.toString());
    this.subscription = this.api.store(this.formData, endpoint).subscribe(
      (res: any) => {
        console.log(res);
        this.router.navigate(['/admin/bang-tin/van-ban']);
      }
  );
}
uploadFile(event){
    let elem = event.target;
    if(elem.files.length > 0) {
      this.formData.append('DocImage', elem.files[0], elem.files[0].name);
    }
  }

}
