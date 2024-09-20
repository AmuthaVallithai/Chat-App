import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { UserInfo, updateProfile } from 'firebase/auth';
import { User } from '@angular/fire/auth';
import firebase  from 'firebase/compat/app';
import { UsersService } from './users.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser: Observable<firebase.User | any>;
  user!:Promise< User | null>;

  constructor(
    private auth: AngularFireAuth,
    private firestore: Firestore,
    
  )
   {
    this.currentUser = this.auth.authState;

  }
  getUserDisplayName(): Promise<any> {
    return this.auth.currentUser.then((user) => {
      if (user) {
        console.log(user.displayName);
      } else {
        console.log('No user is signed in.');
      }
    }).catch((error) => {
      console.error('Error fetching user display name:', error);
    });
  }
  signup(email: any, password: any, ){
    return from( this.auth.createUserWithEmailAndPassword(email, password))
     
     
  }

  async getData(): Promise<void> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const snapshot = await getDocs(usersCollection);
      snapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data(  ))}`);
      });
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  }

  login(email: any, password: any): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  async updateProfileData(profileData: Partial<any>): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      await updateProfile(user, profileData);
     
      console.log(profileData)
     
    } else {
      throw new Error('Not Authenticated');
    }
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
