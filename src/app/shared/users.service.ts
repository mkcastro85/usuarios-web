import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = 'http://127.0.0.1:8000/api/user';  // URL to web api
  constructor(private http: HttpClient) { }

  /*
  * Metodo que se encarga de obtener todos los usuarios
  */
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url)
      .pipe(
        tap(user => this.log('fetched usuario')),
        catchError(this.handleError('getAll', []))
      );
  }

  /**
   * Metodo encargado de guardar usuarios
   */
  save(user: User): Observable<User> {
    return this.http.post<User>(this.url, user, httpOptions);
  }

  /**
   * Metodo encargado de actualizar usuarios
   */
  update(user: User,idUsuario: number): Observable<User> {
    return this.http.put<User>(this.url + "/"+idUsuario, user, httpOptions);
  }

   /**
   * Metodo encargado de borrar usuarios
   */
  delete(idUsuario: number): Observable<User> {
    return this.http.delete<User>(this.url  + "/"+idUsuario);
  }

  /**
 * Lanza http si hay error
 * 
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log de aplicacion */
  private log(message: string) {
    console.log(message);
  }
}
