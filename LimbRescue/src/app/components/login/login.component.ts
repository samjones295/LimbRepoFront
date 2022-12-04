import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth.service';

import { User } from 'src/app/models/user'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit {


  user: User | undefined;
  isForgotPassword:boolean = false;
  isForgotPasswordEmail:boolean = false;
  newPassword:string = '';
  login_subscription: any;
  invalidLogin = false;
  loginSuccess = false;
  errorMessage = '';
  successMessage?: string;

  constructor(private router: Router, private authenticationService: AuthenticationService) {   }

  // Called when page is loaded, dont need to do anything here
  ngOnInit() {
    this.user = {} as User
  }

  // Called  when the page  is left
  ngOnDestroy(){
    // Unsubscribe from subscription to prevent resource leaks
    if(this.login_subscription != undefined){
      this.login_subscription.unsubscribe()
    }
  }

  // Called when the login button is pressed
  handleLogin() {
    // Try to do the login
    if(this.user && this.user.email && this.user.password){
    this.login_subscription = this.authenticationService.signInWithCognito(this.user.email, this.user.password).subscribe((res)=> {
      // If successful set thevariables
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.successMessage = 'Login Successful.';

      // And navigate to the home page
      this.router.navigate(['/home']);
    }, () => {
      // Otherwise keep it as invalid login
      this.invalidLogin = true;
      this.loginSuccess = false;
    });      
    }else{
      this.errorMessage = 'Please enter a valid email or password';
    }
  }
}