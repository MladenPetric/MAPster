import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Auth } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userSubject = new BehaviorSubject<User | null>(null);
 
  public user$ = this._userSubject.asObservable();
  public get user() {
    return this._userSubject.value;
  }

  public userRole$: Observable<'Admin' | 'User' | null> = this.user$.pipe(
    map(user => {
      if (!user) 
        return null;

      const groups = (user as any).signInUserSession?.idToken?.payload?.['cognito:groups'];
      return (Array.isArray(groups) && groups.length > 0) ? groups[0] : null;
    })
  )

  public get accessToken() {
    return (this.user as any)?.signInUserSession?.accessToken?.jwtToken || null;
  }


  constructor() {
    Hub.listen('auth', async (data: any) => {
      const { payload } = data;
      
      switch (payload.event) {
        case 'signIn':
        case 'cognitoHostedUI':
          const user = await Auth.currentAuthenticatedUser();
          console.log('Signied in', user);
          this._userSubject.next(user as User);
          break;

        case 'signOut':
          console.log('Signing out');
          this._userSubject.next(null);
          break;

        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.error("Sign in failed", payload.data);
          break;
      }

    });

    this.tryLoadUser();
  }


  public logIn(username: string, password: string) {
    Auth.signIn(username, password)
        .then((user: User) => this._userSubject.next(user))
        .catch((err: any) => {
          console.log("Login failed", err);
          this._userSubject.next(null);
        });
  }

  public logOut() {
    Auth.signOut()
        .then(() => this._userSubject.next(null))
        .catch((err: any) => console.log("Logout failed", err));
  }

  private async tryLoadUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this._userSubject.next(user as User);
    } catch {
      this._userSubject.next(null);
    }
  }

} 