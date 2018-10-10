import { Component, OnInit,Input } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as alertify from 'alertify.js';
declare var $:any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

   @Input() title = ``;
   @Input() userId = '';
  form;
  message;
  messageClass;
  processing:boolean = false;
  emailValid;
  emailMessage ;
  usernameValid;
  usernameMessage;
  user:Object;
  editUser:boolean;


    constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {
      this.createForm(); // Create Angular 2 Form when component loads
    }

    // Function to create registration form
    createForm() {
      this.form = this.formBuilder.group({
        // Email Input
        email: ['', Validators.compose([
          Validators.required, // Field is required
          Validators.minLength(5), // Minimum length is 5 characters
          Validators.maxLength(30), // Maximum length is 30 characters
          this.validateEmail // Custom validation
        ])],
        // Username Input
        username: ['', Validators.compose([
          Validators.required
        ])],

        // title Input
        title: ['', Validators.compose([
        ])],
        // Password Input
        password: ['', Validators.compose([
          Validators.required, // Field is required
          Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(50), // Maximum length is 35 characters
        ])],
        // Confirm Password Input
        confirm: ['', Validators.required] // Field is required
      }, { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords
    }

    // Function to disable the registration form
    disableForm() {
      this.form.controls['email'].disable();
      this.form.controls['username'].disable();
      this.form.controls['password'].disable();
      this.form.controls['confirm'].disable();
    }

    // Function to enable the registration form
    enableForm() {
      this.form.controls['email'].enable();
      this.form.controls['username'].enable();
      this.form.controls['password'].enable();
      this.form.controls['confirm'].enable();
    }

    // Function to validate e-mail is proper format
    validateEmail(controls) {
      // Create a regular expression
      const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      // Test email against regular expression
      if (regExp.test(controls.value)) {
        return null; // Return as valid email
      } else {
        return { 'validateEmail': true } // Return as invalid email
      }
    }



clearForm(){
  this.form.controls['username'].setValue('');
  this.form.controls['email'].setValue('');
  this.form.controls['password'].setValue('');
  this.form.controls['confirm'].setValue('');

}

    // Funciton to ensure passwords match
    matchingPasswords(password, confirm) {
      return (group: FormGroup) => {
        // Check if both fields are the same
        if (group.controls[password].value === group.controls[confirm].value) {
          return null; // Return as a match
        } else {
          return { 'matchingPasswords': true } // Return as error: do not match
        }
      }
    }


    // Function to submit form
    onRegisterSubmit(userId?: string) {

    this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
    //this.disableForm(); // Disable the form
    // Create user object form user's inputs
    const user = {
      email: this.form.get('email').value, // E-mail input field
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

    // Function from authentication service to register user
    this.authService.registerUser(user).subscribe(data => {
      console.log('response data',data);
      // Resposne from registration attempt
      if (data['success'] == 'false') {
      
        this.processing = false; // Re-enable submit button
        this.enableForm(); // Re-enable form
        alertify.logPosition('top right').error("Something went wrong please try again");//example
      } else {
        alertify.logPosition('top right').success("User Registered Sucessfully");//example
        this.router.navigate(['/login']);
      }
    });








      
  }

    // Function to check if e-mail is taken
    checkEmail() {
      // Function from authentication file to check if e-mail is taken
      this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
        // Check if success true or false was returned from API

        if (!data['success']) {
          this.emailValid = false; // Return email as invalid
          this.emailMessage = data['message']; // Return error message

        } else {
          this.emailValid = true; // Return email as valid
          this.emailMessage = data['message']; // Return success message
        }
      });
    }



    ngOnInit() {
      this.emailValid = true;
      this.emailMessage = '';

    }

    clearMessages(){
      this.emailMessage = '';
      this.emailValid = true;
    }

    openModal(){
      this.clearMessages();
      this.clearForm();
      $('#myModal').modal('show');
    }

    registerRoute(){
      this.router.navigate(['register']);
    }


  }
