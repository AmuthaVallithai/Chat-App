import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { User } from 'firebase/auth';
import { ProfileComponent } from './profile/profile/profile.component';
import { profileUser } from './models/user-profile';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    CommonModule,
    ProfileComponent,
  RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  user$!: Observable<User | any>;
  userProfile$!: Observable<profileUser | null>;
   
 
 

  constructor(
    public authservice:AuthenticationService,
    private router :Router,
    private userservice: UsersService
  ){

  }

  ngOnInit(): void {
   
    this.userProfile$ = this.authservice.currentUser.pipe(
      switchMap(user => {
        if (user && user.uid) {
          return this.userservice.getUserProfile(user.uid); 
        }
        return of(null);
      })
    );
  }

  logout(){
    this.authservice.logout().subscribe(()=>{
      this.router.navigate(['/landing'])
     
    })
  }
}
