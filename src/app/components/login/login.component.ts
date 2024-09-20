import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,CommonModule,FormsModule,MatButtonModule,MatInputModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{


    LoginForm = new FormGroup({
      email: new FormControl("",[Validators.required,Validators.email]),
      password: new FormControl("",Validators.required)
    })
    
    constructor(private authservice:AuthenticationService,private router:Router){}

    ngOnInit(){
     
    }
    get email(){
      return this.LoginForm.get("email")
    }
    get password(){
      return this.LoginForm.get("password")
    }
    submit(){
      if(!this.LoginForm.valid)
        return;
      const {email,password} = this.LoginForm.value
      this.authservice.login(email,password).subscribe(()=>{
      
      this.router.navigate(['/home'])
      })
      this.authservice.getData()
    }
    
}
