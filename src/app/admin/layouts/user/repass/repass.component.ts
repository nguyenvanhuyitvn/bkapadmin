import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../../shared/services';
import { User } from './../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-repass',
  templateUrl: './repass.component.html',
  styleUrls: ['./repass.component.css']
})
export class RepassComponent implements OnInit, OnDestroy {

  repassForm: FormGroup;
    user: User={ UserName: '', Password: '', FullName:'',Birthday:'',Avatar: '', Gender: true,Address:'', Status: 0};
    id= '';
    firstName: '';
    lastName: '';
    oldPassword: '';
    newPassword: '';
    confirmPassword='';
    email: '';
    status: 0;
    is_updated: number;
    message: string;
    public subscription: Subscription;
    constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private api: ApiService) { }
    ngOnDestroy(){
      if(this.subscription){
        this.subscription.unsubscribe();
      }
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
          const endpoint = `users/edit`;
          this.api.getDetail(this.user, endpoint, params['id']).subscribe(res => {this.user = res;});
        });
        this.createForm();
      }
    onFormSubmit(){
        this.id  = this.route.snapshot.paramMap.get("id");
        const endpoint = `users/updatePassword/${this.id}`;
        if(this.repassForm.invalid){
          return;
        }
        this.subscription = this.api.update(this.repassForm.value, endpoint).subscribe(
          (res: any) => {
            console.log(res);
            if(res.is_exist == '1'){
                console.log(res.error);
                this.is_updated = 1;
                this.message = res.error;
                alert(`Tài khoản không tồn tại`);
              }
            else
              {
                this.is_updated = 0;
                this.message = res.message;
                console.log(res.message);
                alert(`Đã cập nhật mật khẩu thành công!`);
                this.router.navigate(['/admin/nguoi-dung']);
              }
          }
        )
      }
    createForm(){
        this.repassForm = this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          oldPassword: ['', [Validators.required, Validators.minLength(6)]],
          newPassword: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
          email: ['', Validators.required],
          status: [0]
        })
      }
}
