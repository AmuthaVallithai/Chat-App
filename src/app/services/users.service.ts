import { Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { profileUser } from '../models/user-profile';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { user } from '@angular/fire/auth';
import { collection, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get currentUserProfile():Observable<profileUser |null>{
    return from(this.authservice.currentUser).pipe(
    switchMap((user) =>{
      if(!user?.uid){
        return of(null)
      }
      const ref = doc(this.firestore,"users",user?.uid)
      return docData (ref) as Observable<profileUser>;

    })
  )
  }


  constructor(private firestore:Firestore,private authservice:AuthenticationService) {


   }
   get allUsers$():Observable<profileUser[]>{
    const ref=collection(this.firestore,"users");
    const queryAll =query(ref);
    return collectionData(queryAll) as Observable<profileUser[]>
   }
   getUserProfile(uid: string): Observable<profileUser | null> {
    const userRef = doc(this.firestore, 'users', uid);
    return from(getDoc(userRef)).pipe(
      map(doc => (doc.exists() ? { ...doc.data(), uid } : null))
    );
  }

  addUser(user:profileUser ) :Observable<any>{
    const ref = doc(this.firestore,'users',user?.uid);
    return from( setDoc(ref,{...user}));
  }
 

  updateUser(user:profileUser):Observable<any>{
    return new Observable(observer => {
      this.authservice.currentUser.subscribe(currentUser => {
        if (currentUser && currentUser.uid) {
          user.uid = currentUser.uid; 
          const userRef = doc(this.firestore, 'users', user.uid);
  
          
          getDoc(userRef).then(docSnapshot => {
            if (docSnapshot.exists()) {
              from(updateDoc(userRef, { ...user })).subscribe({
                next: () => {
                  observer.next();
                  observer.complete();
                },
                error: (err) => {
                  observer.error(err);
                }
              });
            } else {
              from(setDoc(userRef, { ...user })).subscribe({
                next: () => {
                  observer.next();
                  observer.complete();
                },
                error: (err) => {
                  observer.error(err);
                }
              });
            }
          }).catch(err => {
            observer.error(err);
          });
        } else {
          observer.error(new Error('User UID is required to update the user document.'));
        }
      });
    });
}
}