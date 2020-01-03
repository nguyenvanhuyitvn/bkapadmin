import { Injectable } from '@angular/core';
import { Observable, of, throwError} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse,HttpParams  } from '@angular/common/http';
import { User } from './../models/user';
const httpOptions ={
  headers: new HttpHeaders({
    // 'Content-Type':'application/x-www-form-urlencoded',
    'Content-Type':'application/json'
  })
}
// const uri= 'http://localhost:2222/api_resful/public/api/users';
const uri ='http://product.bachkhoa-aptech.edu.vn/BkapServices/Portal';
@Injectable({
  providedIn: 'root'
})
export class UserService {

 private handleError<T>(operation = 'operation', result?:T){
    return (error: any): Observable<T> =>{
      console.error(error);
      return of(result as T);
    }
  }
  constructor(private http: HttpClient){}
	login(user: User): Observable<User>{
	    console.log(user);
	    const url = `${uri}/Users/Login`;
	    return this.http.post(url,user,httpOptions).pipe(
	      tap((user: User)=> console.log(user)),
	      catchError(this.handleError<User>('success'))
	    )
	  }
	addUser(user: User): Observable<User>{
	    const url = `${uri}/add`;
	    console.log(user);
	    return this.http.post(url, user,httpOptions).pipe(
	      tap((user: User)=> console.log(user)),
	      catchError(this.handleError<User>('Added successfully'))
	    )
	  }


}
