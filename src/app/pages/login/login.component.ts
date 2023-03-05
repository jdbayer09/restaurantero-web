import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/security/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loading: boolean = false;
  error: string = '';
  

  loginForm: FormGroup = this.formBuilder.group({
    login: [ '' , [Validators.required, Validators.minLength(3)] ],
    contrasena: [ '', [ Validators.required, Validators.minLength(5) ] ]
  });;

  constructor(
    private authSV: AuthService, 
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    
  }

  async onSubit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    setTimeout(() => {
      this.authSV.login({ ...this.loginForm.value, plataforma: 'APP' }).then(resp => {
        if (resp) {
          this.loginForm.reset();
          this.router.navigateByUrl('/z', {replaceUrl: true});
        }        
      }).catch((error: any) => {
        this.loginForm.reset();
        this.error = `${error.viewTittle} \n ${error.viewMessage}`;
      }).finally(() => this.loading = false);
    }, 1500);
  }
}
