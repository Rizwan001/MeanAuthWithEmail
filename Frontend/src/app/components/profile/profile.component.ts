import { Component, OnInit ,OnDestroy,ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import {RegisterComponent} from '../register/register.component';


declare var $:any;

@Component({


  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit , OnDestroy{

  @ViewChild(RegisterComponent ) register: RegisterComponent;

  user:object;
  users$: object[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title:any = '';
  userId:any = '';
  timerValue:boolean = false;
  registerModalShown = false;


  constructor(
              private authService:AuthService,
              private router:Router,

            ) {

            }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {

      this.user = profile['user'];
      console.log('Profile is ' , this.user);
    },
     err => {
       console.log(err);
       return false;
     });


     this.dtOptions = {
           pagingType: 'full_numbers',
           pageLength: 5,
           processing: true
         };

         this.authService.getAllUsers().subscribe(data => {
           console.log(data);
           this.users$ = data['users'];
           this.dtTrigger.next();
         });




  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  openModal(id?: string){
      this.register.openModal();
      this.register.onRegisterSubmit(id);
  }


  // openModal(id?: string){
  //   this.register.clearForm();
  //       this.title = 'Add new user';
  //       if(id !== undefined){

  //         this.title = 'Update User';
  //         this.userId = id;
  //         console.log('UserId is Atif');
  //         this.register.onRegisterSubmit(this.userId);


  //       console.log('Clicked');

  //       }

  //     }

}
