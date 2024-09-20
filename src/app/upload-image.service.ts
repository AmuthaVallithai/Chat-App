import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { Observable, switchMap } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  photoURL!: string ;

  constructor(private storage:Storage){ }
  uploadImage(image:File,path:string):Observable<string>{
    const storageref = ref(this.storage,path);
    const uploadTask = from(uploadBytes(storageref,image))
    return uploadTask.pipe(
      switchMap((result)=> getDownloadURL(result.ref))
    )
  
   
  }
}
