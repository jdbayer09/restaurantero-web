import { Injectable } from '@angular/core';
import { UsuarioDataModel } from '../../models/usuario.model';
import { StorageService } from '../util/storage.service';
import { storageKeys } from '../../../environments/storage-keys';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { LoginModel } from '../../models/login.model';
import { HttpClient } from '@angular/common/http';

const JWT_HELPER = new JwtHelperService();
const USER_DATA_KEY = storageKeys.USER_DATA;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = '';

  constructor(
    private storage: StorageService,
    private router: Router,
    private http: HttpClient
  ) { }

  async isAuthenticated() {
    return await this.isAuthAction();
  }

  async isNotAuthenticated() {
    return await this.isNotAuthAction();
  }

  async getToken(): Promise<string> {
    if (this.token === '') {
      let userData: UsuarioDataModel = await this.storage.get(USER_DATA_KEY);
      this.token = userData ? userData.token : ''; 
    }
    return this.token;
  }

  async logoutAction() {
    this.storage.delete(USER_DATA_KEY);
    this.token = '';
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }

  async login(data: LoginModel): Promise<UsuarioDataModel | any | null> {
    return new Promise((resolve, reject) => {
      this.http.post(`http://192.168.1.7:8080/restaurantero/api/login`, data).subscribe({next: ((resp: any) => {
        if (resp && resp.token) {
          this.storage.set(USER_DATA_KEY, resp);
          resolve(resp)
        } else {
          reject(null)
        }
      }), error: (err => {
        if (err.status === 0) {
          err.viewTittle = '¡Problemas de Conexión!';
          err.viewMessage = 'Verificar la conexión del sistema';
        } else {
          err.viewTittle = err.error.message;
          err.viewMessage = err.error.error;
        }
        reject(err);
      })})
    });
  }

  private isAuthAction(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const token = await this.getToken();
      if (token && token !== '') {
        if (JWT_HELPER.isTokenExpired(token)) {
          this.logoutAction();
          resolve(false);
        } else {
          resolve(true);
        }
      } else {
        this.logoutAction();
        resolve(false);
      }  
    });
  }

  private isNotAuthAction(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const token = await this.getToken();
      if (!token || token === '') {
        this.storage.delete(USER_DATA_KEY);
        this.token = '';
        resolve(true);
      } else {
        if (JWT_HELPER.isTokenExpired(token)) {
          this.storage.delete(USER_DATA_KEY);
          this.token = '';
          resolve(true);
        } else {
          this.router.navigateByUrl('/z', {replaceUrl: true});
          resolve(false);
        }
      }  
    });
  }

}
