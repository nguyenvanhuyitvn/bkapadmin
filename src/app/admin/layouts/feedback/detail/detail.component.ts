import { Component, OnInit, OnDestroy } from '@angular/core';
import { Feedback, User } from './../../../shared';
import { ApiService } from './../../../shared';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {

  users: User[];
  feedback: Feedback = { FeedbackId: null, Code: '', FbTitle:'',FbContent: '', CreatedDate: '', Status: null};
  // Init Form
  FeedbackId: any;
  Code = new FormControl('' , [ Validators.required ]);
  FbTitle = new FormControl('' , [ Validators.required ]);
  FbContent = new FormControl('' , [ Validators.required ]);
  CreatedDate = new FormControl('' , [ Validators.required ]);
  Status = new FormControl('' , [ Validators.required ]);
  endpoint =`Feedbacks/GetAll`;
  subscription: Subscription;
  subscription1: Subscription;
  subUser: Subscription;
  public message: String = '';
  public isDeleted: boolean = false;
  public  typeFeedBack = [
    { id: 1, name: 'Chương trình đào tạo'},
    { id: 2, name: 'Hoạt động giảng dạy' },
    { id: 3, name: 'Cơ sở vật chất' },
    { id: 4, name: 'Dịch vụ đào tạo' }
  ];
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.loadUsers();
    this.loadFeedbackById();
  }
  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    if(this.subscription1){
      this.subscription1.unsubscribe();
    }
  }
  loadFeedbackById(){
    this.route.params.subscribe(params => {
      const endpoint = `Feedbacks/Get`;
      this.FeedbackId = params['id'];
      this.subscription1 = this.api.getDetail(this.feedback, endpoint, params['id']).subscribe(res => {
        this.feedback = res.Data;
        for(const i in this.users){
            if(this.feedback.Code == this.users[i]['Code']){
                this.feedback['Email']= this.users[i]['Email'];
            }
        }
        console.log(this.feedback);
      });
    });
  }

  loadUsers() {
    const endpoint = 'Students/GetAll'
    this.subscription = this.api.show(endpoint).subscribe(
        (res: any)=> {
          this.users = res.Data;
        },
        (err:any)=>{
          console.log(err);
        }
    )
  }
  deleteFeeback(id: any){
    const endpoint =`Feedbacks/Remove`;
    const check = confirm('Bạn có chắc chắn muốn xóa?');
    if (check) {
      this.api.destroy(id, endpoint).subscribe(
        (res: any)=>{
          this.message = res.message;
          this.isDeleted = true;
        },
        (err: any)=> {
          this.message= err.message;
          this.isDeleted = false;
          console.log(err);
        }
      )
    }
  }
  apply(id, status) {
    status = !status;
    this.feedback.Status=status;
    const endpoint = `Feedbacks/Edit`;
    return this.api.update(this.feedback, endpoint).subscribe(
            (res: any) => {
              this.router.navigate(['/admin/gop-y']);
            }
      );
  }
}
