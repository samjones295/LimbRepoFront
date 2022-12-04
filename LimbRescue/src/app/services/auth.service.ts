import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/global/Constants';

const baseUrl = Constants.IP;

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  // Create variables for login authentication
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Getter method to return the logged in variable as an observable
  get getLoggedIn(){
    return this.loggedIn.asObservable();
  }

  // Set method to set the logged in variable
  setLoggedIn(value: boolean){
    this.loggedIn.next(value)
  }

  constructor(private http: HttpClient) {}

  // Method used to call authentication on the backend
  signInWithCognito(username: string, password: string) {
    return this.http.post<any>(`http://localhost:8443/getcredentials`, {"username": username, "password": password},{ 
        withCredentials: true}).pipe(map((res) => {
          this.registerSuccessfulLogin(username, password);
        }));
  }

  // Set a session storage item to keep the username for persistance
  registerSuccessfulLogin(username:string , password:string) {
    this.loggedIn.next(true)
  }

  // Used to check if a user is logged in
  isUserLoggedIn() {
    return this.loggedIn.getValue() 
  }



  // Called on clicking the login button
  logout() {
    this.loggedIn.next(false)
  }

}