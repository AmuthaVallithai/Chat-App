import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { profileUser } from '../../models/user-profile';

export function passwordMatchValidator(): ValidatorFn{
  return (control:AbstractControl): ValidationErrors | null =>{
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    if( password && confirmPassword && password !== confirmPassword){
      return {
        passwordDontMatch:true
      }
    }
    return null;

  }
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  user:profileUser[]=[];
  uid="1"

    constructor(private authservice:AuthenticationService,private router: Router,
      private userservice: UsersService
    ){}
    signupForm = new FormGroup({
      displayName: new FormControl("",Validators.required),
      email: new FormControl("",[Validators.required,Validators.email]),
      password: new FormControl("",Validators.required),
      confirmPassword : new FormControl("",Validators.required)
    })
    get displayName(){
      return this.signupForm.get("displayName");
    }
    get email(){
      return this.signupForm.get("email");
    }
    get password(){
      return this.signupForm.get("password");
    }
    get confirmPassword(){
      return this.signupForm.get("confirmPassword");
    }
    submit() {
      if (!this.signupForm.valid) return;
    
      const { displayName, email, password } = this.signupForm.value;
    
      this.authservice.signup(email, password).pipe(
        switchMap((response) => {
          const user = response.user;
          
          if (user) {
            const { uid } = user;
            this.router.navigate(['/home']);
            return this.userservice.addUser({ uid, email, displayName });
          } else {
            throw new Error("User not found after signup");
          }
        })
      ).subscribe({
        next: (result) => {
          console.log('User added:', result);
        },
        error: (error) => {
          console.error('Error during signup or adding user:', error);
        }
      });
    }
    
}
