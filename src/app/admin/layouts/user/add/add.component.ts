import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { User } from './../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// import { uniquePhone } from 'src/app/admin/shared/directive/highlight.directive';
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
  subscription: Subscription;
  subscription1: Subscription;
  endpoint: String;
  id: any;
  color = 'accent';
  imgURL: any ='assets/img/no-image.png';
  public imagePath;
  public formImages = new FormData();
  genders: any[] = [ {id:0, name:'Nam'}, {id:1, name:'Nữ'}];
  // Init Object
  // tslint:disable-next-line: max-line-length
  user: User={ UserName: '', FullName: '', Password:'', Address: '', Gender: true, Birthday: '',  Avatar: '', Status: 0 };

  // Init Form
  // UserName = new FormControl('' , [ Validators.required ], this.isCodeUnique.bind(this));
  UserName = new FormControl('' , [ Validators.required ]);
  FullName = new FormControl('' , [ Validators.required]);
  Address = new FormControl('');
  Password = new FormControl('' , [ Validators.required]);
  Avatar = new FormControl('' , [ Validators.required]);
  Birthday = new FormControl({value: '', disabled: true} );
  Gender = new FormControl('' , [ Validators.required]);
  Status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }

    ngOnInit() {
      $(".showonhover").click(function(){
        $("#image").trigger('click');
      });
      $("#upfile1").click(function(){
        $("#image").trigger('click');
      });
    }
    onFormSubmit() {
      // form data
      const endpoint = `Users`;
      const imgEndpoint = `Students/Uploads`;
      if(this.user.Status == 1)
        {
          this.user.Status = 1;
          console.log(this.user.Status)
        }else{
          this.user.Status = 0;
          console.log(this.user.Status)
        }
      this.subscription = this.api.updateFile(this.formImages, imgEndpoint).subscribe(
          (res: any) => {
            if(res.StatusCode == 200){
              this.user.Avatar = res.Data;
              this.subscription1 = this.api.store(this.user, endpoint).subscribe(
                (res: any) => {
                  if(res.StatusCode == 401){
                    alert(res.Message);
                    return false;
                  }else{
                    console.log(res);
                    this.router.navigate(['/admin/nguoi-dung']);
                  }
                }
              );
            }
          }
      );

  }
  change(){
    // tslint:disable-next-line: triple-equals
    if(this.user.Status.toString() == 'false')
    {
      this.user.Status =0;
      console.log(this.user.Status)
    }else{
      this.user.Status = 1;
      console.log(this.user.Status)
    }
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
  changeGender(){
    // tslint:disable-next-line: triple-equals
    console.log(this.user.Gender)
  }
  isCodeUnique(control: FormControl) {
    const q = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.api.getDetail(this.user,'Users/Get',control.value).subscribe(
          (res: any) => {
            console.log(res);
            if(res.StatusCode == 200){
              resolve({ 'isCodeUnique': true, 'res': console.log(res) });
            } else{
              resolve(null)
            }
          },
          (err) => { resolve(null); });
      }, 1000);
    });
    return q;
  }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.subscription1) {
      this.subscription1.unsubscribe();
    }
  }
}
