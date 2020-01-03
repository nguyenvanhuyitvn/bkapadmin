import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Students, Class, Config } from './../../../shared';
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
  student: Students={ Code: '', Name: '', ClassName:'', Email: '', Phone: '', Address: '', Password: '', Image: '',Token:'', Birthday: null, Gender: 0, Status: 0 };
  classes: Class[];
  // Init Form
  Code = new FormControl({value: '', disabled: true} );
  Name = new FormControl('', [ Validators.required ]);
  ClassName = new FormControl('' , [ Validators.required]);
  Email = new FormControl('' , [ Validators.required]);
  Phone = new FormControl('' , [ Validators.required]);
  Address = new FormControl('');
  Password = new FormControl('' , [ Validators.required]);
  Image = new FormControl('' , [ Validators.required]);
  Token = new FormControl('' , [ Validators.required]);
  Birthday = new FormControl({value: '', disabled: true} );
  Gender = new FormControl('' , [ Validators.required]);
  Status = new FormControl('' , [ Validators.required]);
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }
  ngOnDestroy(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadClass();
    this.loadNewsById();
    $(".showonhover").click(function(){
      $("#image").trigger('click');
    });
    $("#upfile1").click(function(){
      $("#image").trigger('click');
    });
  }
  loadClass(){
    const endpoint = 'Classes/GetAll';
    this.api.show(endpoint).subscribe(
      (res: any) => {
            this.classes = res.Data;
            console.log(this.classes);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  loadNewsById() {
    const urlCfg = new Config;
    this.route.params.subscribe(params => {
      const endpoint = `Students/GetByCode`;
      this.id = params['id'];
      this.api.getDetail(this.student, endpoint, params['id']).subscribe(res => {
        console.log(res);
        const imgName = res.Data['Image'];
        this.imgURL = `${urlCfg.url}${imgName}`;
        this.student = res.Data;
      });
    });
  }
  onFormSubmit() {
    const imgEndpoint = `Students/Uploads`;
    const endpoint = `Students/Edit`;
    if ( this.flag ) {
      this.subscription = this.api.updateFile(this.formImages, imgEndpoint).subscribe(
        (res: any) => {
          console.log(res);
          if(res.StatusCode == 200){
             this.student.Image = res.Data;
             this.subscription1 = this.api.update(this.student, endpoint).subscribe(
               ( res: any) => {
                 console.log(res);
                  this.router.navigate(['/admin/sinh-vien/danh-sach']);
               }
             );
          }
        });

    }else
    {
        console.log("Push Data:", this.student);
        this.subscription1 = this.api.update(this.student, endpoint).subscribe(
          // tslint:disable-next-line: no-shadowed-variable
          ( res: any) => {
            this.router.navigate(['/admin/sinh-vien/danh-sach']);
          }
        );
    }
}
change(){
  // tslint:disable-next-line: triple-equals
  if(this.student.Status.toString() == 'false')
    {
      this.student.Status =0;
      console.log(this.student.Status)
    }else{
      this.student.Status = 1;
      console.log(this.student.Status)
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
