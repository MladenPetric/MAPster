import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { BehaviorSubject, map } from "rxjs";
import { Hub, Auth } from "aws-amplify";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userSubject = new BehaviorSubject<User | null>(null);
 
  public user$ = this._userSubject.asObservable();
  public get user() {
    return this._userSubject.value;
  }

  public userRole$ = this.user$.pipe(
    map(user => this.getRole(user || {}))
  )
  public get userRole() {
    return this.getRole(this.user || {});
  }

  public get accessToken() {
    return (this.user as any)?.signInUserSession?.accessToken?.jwtToken || null;
  }


  constructor() {
    Hub.listen('auth', async (data: any) => {
      const { payload } = data;
      console.log('Auth event: ', payload.event);

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


  public async logIn(username: string, password: string) {
    const user = await Auth.signIn(username, password);
    //await Auth.completeNewPassword(user, password);

    // try {
    //   Auth.signIn(username, password)
    //     .then(async (user) => {
    //       if (user.challengeName == 'NEW_PASSWORD_REQUIRED') {
    //         await Auth.completeNewPassword(username, password);
    //       }
    //       this._userSubject.next(user);
    //     })
    //     .catch((err: any) => {
    //       //console.log("Login failed", err);
    //       this._userSubject.next(null);
    //     });
    // } catch (error) {
    //   //console.error('Login failed', error);
    // } 
  }

  public async logOut() {
    await Auth.signOut();
    // try {
    //   Auth.signOut()
    //     .then(() => this._userSubject.next(null))
    //     .catch((err: any) => {});
    // } catch (err) {
    //   //console.log("Logout failed", err);
    // }
  }

  public async register(request: any) {
    const { username, password } = request;

    const { user } = await Auth.signUp({
      username, 
      password,
      attributes: Object.fromEntries(
        Object.entries(request).filter(([key]) => ["given_name", "familiy_name", "birthdate", "email"].includes(key))
      )
    });
  }

  private async tryLoadUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this._userSubject.next(user as User);
    } catch {
      this._userSubject.next(null);
    }
  }

  private getRole(user: any) {
    console.log("User", user)
    const groups = (user as any).signInUserSession?.idToken?.payload?.['cognito:groups'];
    return (Array.isArray(groups) && groups.length > 0) ? `ROLE_${groups[0].toUpperCase()}` as any : null;
  }

} 