import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) {}

  // Function used for routing
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Return the value of isLoggedIn 
    return this.auth.getLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        // if logged in set the variables and login
        if (!isLoggedIn && !this.auth.isUserLoggedIn()) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      })
    );
  }
}
