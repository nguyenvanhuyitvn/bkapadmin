import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewsCatalog } from './../../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-dialog-boxx',
  templateUrl: './dialog-boxx.component.html',
  styleUrls: ['./dialog-boxx.component.css']
})
export class DialogBoxxComponent implements OnInit {
  ngOnInit() {

  }
    addForm: FormGroup
    action:string;
    local_data:any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogBoxxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: NewsCatalog) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
  createForm(){
    this.addForm = this.fb.group({
      CategoryName: ['', Validators.required]
    });
  }
}
