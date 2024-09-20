import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { concatMap, Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UploadImageService } from '../../upload-image.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Storage } from '@angular/fire/storage';
import { UsersService } from '../../services/users.service';
import { profileUser } from '../../models/user-profile';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user!: Observable<profileUser |any>;
  profileForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private imageUploadService: UploadImageService,
  
    private userService: UsersService
  ) {
   
    this.profileForm = new FormGroup({
      uid: new FormControl(''),
      displayName: new FormControl(''),
      photoUrl: new FormControl(''),
      email: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
    });
  }

  ngOnInit() {
    this.user = this.userService.currentUserProfile;
  
    this.userService.currentUserProfile.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          uid: user.uid, 
          firstName:user.firstName,
          lastName:user.lastName,
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          address: user.address,
        });
      }
    });
  }
  
  saveProfile() {

    if (this.profileForm.valid) {
      const profileData: profileUser = this.profileForm.value;
      console.log('Profile data being sent:', profileData); 
      this.userService.updateUser(profileData).subscribe({
        next: () => console.log('User profile updated successfully'),
        error: (err) => console.error('Error updating user profile:', err)
      });
    } else {
      console.error('Form is invalid');
    }
  }
  
  uploadImage(event: any, user: profileUser) {
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      concatMap((photoUrl) => this.userService.updateUser({uid:user.uid, photoUrl }))
    ).subscribe({
      next: () => console.log('Profile image updated successfully'),
      error: (err) => console.error('Error uploading image:', err)
    });
  }
}
