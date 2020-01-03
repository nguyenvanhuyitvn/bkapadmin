import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { User } from './../../../shared/models';
import { FormControl, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/admin/shared/config/config';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  public flag: boolean=false;
  subscription: Subscription;
  subscription1: Subscription;
  endpoint: String;
  id: any;
  imgURL: any ='assets/img/no-image.png';
  public imagePath;
  public formImages = new FormData();
  genders: any[] = [ {id:0, name:'Nam'}, {id:1, name:'Nữ'}];
  color = 'accent';
  // Init Object
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
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.subscription1) {
      this.subscription1.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadNewsById();
    $(".showonhover").click(function(){
      $("#image").trigger('click');
    });
    $("#upfile1").click(function(){
      $("#image").trigger('click');
    });
  }
  loadNewsById() {
    const urlCfg = new Config;
    this.route.params.subscribe(params => {
      const endpoint = `Users/Get`;
      this.id = params['id'];
      this.api.getDetail(this.user, endpoint, params['id']).subscribe(res => {
        console.log(res);
        const imgName = res.Data['Avatar'];
        this.imgURL = `${urlCfg.url}${imgName}`;
        this.user = res.Data;
      });
    });
  }
  onFormSubmit() {
    const imgEndpoint = `Students/Uploads`;
    const endpoint = `Users/Edit`;
    if ( this.flag ) {
      this.subscription = this.api.updateFile(this.formImages, imgEndpoint).subscribe(
        (res: any) => {
          console.log(res);
          if(res.StatusCode == 200){
             this.user.Avatar = res.Data;
             this.subscription1 = this.api.update(this.user, endpoint).subscribe(
               ( res: any) => {
                  console.log(res);
                  // this.router.navigate(['/admin/nguoi-dung']);
                  if(confirm('Bạn phải đăng nhập lại!')){
                    localStorage.removeItem('isLogged');
                    sessionStorage.removeItem('user_id');
                    location.reload();
                  }
               }
             );
          }
        });

    }else
    {
        console.log("Push Data:", this.user);
        this.subscription1 = this.api.update(this.user, endpoint).subscribe(
          // tslint:disable-next-line: no-shadowed-variable
          ( res: any) => {
            // this.router.navigate(['/admin/nguoi-dung']);
            if(confirm('Bạn phải đăng nhập lại!')){
              localStorage.removeItem('isLogged');
              sessionStorage.removeItem('user_id');
              location.reload();
            }
          }
        );
    }
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

}
