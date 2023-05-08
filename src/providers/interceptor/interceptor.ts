import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConfigProvider} from "../config/config";

@Injectable()
export class InterceptorProvider implements HttpInterceptor {


  constructor(private configProvider: ConfigProvider) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<HttpEventType.Response>> {
    let authReq;
    if (!!localStorage.getItem("user-token")) {
      authReq = req.clone({
        setHeaders: {Authorization: localStorage.getItem("user-token")}
      });
    } else {
      authReq = req;
    }
    return next.handle(authReq);
  }

}

