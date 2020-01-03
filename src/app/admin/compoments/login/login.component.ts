import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../shared/services/user.service';
import { User } from './../../shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import swal from 'sweetalert';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  constructor(private formBuiler: FormBuilder, private route: ActivatedRoute, public userService: UserService, public router: Router) { }

  ngOnInit() {
    var logined = localStorage.getItem('isLogged') ? JSON.parse(localStorage.getItem('isLogged')) : false;
    if(logined){
      console.log(logined);
      this.router.navigate(['/admin/dashboard']);
    }else{
      console.log('NO');
    }

    this. createForm();
    // this.checkLogin();
  }
  onFormSubmit(){
    this.userService.login(this.userForm.value ).subscribe(
      (res: any) => {
        // console.log(res.user['id']);
        if(res.StatusCode == 200) {
          sessionStorage.setItem('user_id', res.Data['UserId']);
          sessionStorage.setItem('username', res.Data['UserName']);
          localStorage.setItem('isLogged', JSON.stringify(res));
          this.router.navigate(['/admin/dashboard']);
          this.checkLogin();
        } else{
           console.log(res);
           console.log(res.message);
        }

      },
      (err: any) => {
        console.log(err);
      }
    )
  }
  createForm(){
    this.userForm = this.formBuiler.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  checkLogin(){
        if(localStorage.getItem('isLogged')){
          this.router.navigate(['/admin/dashboard']);
            console.log('đi tới trang dashboard');
        }
      }

}
