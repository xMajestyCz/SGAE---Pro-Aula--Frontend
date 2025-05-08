import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.currentToken;
        const authRequest = token 
        ? request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
            })
        : request;

        return next.handle(authRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && this.authService.currentRefreshToken) {
                return this.handle401Error(request, next);
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
                const newToken = this.authService.currentToken;
                const authReq = newToken 
                ? request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${newToken}`
                    }
                    })
                : request;
                return next.handle(authReq);
            }),
            catchError((err) => {
                this.authService.logout();
                return throwError(() => err);
            })
        );
    }
}