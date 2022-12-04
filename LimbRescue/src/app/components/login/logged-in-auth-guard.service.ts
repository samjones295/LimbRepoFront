import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/auth.service';

@Injectable()
export class LoggedInAuthGuardService implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) {}

  // Function used for routing
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Return the value of isLoggedIn 
    return this.auth.getLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        // if logged in set the variables and login
        if(this.auth.isUserLoggedIn()){
          this.auth.setLoggedIn(true)
          this.router.navigate(['home']);
          return false;
        }
        return true;
      })
    );
  }
}
