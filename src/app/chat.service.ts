import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, query, Timestamp, where } from '@angular/fire/firestore';
import { profileUser } from './models/user-profile';
import { UsersService } from './services/users.service';
import { concatMap, map, Observable, take } from 'rxjs';
import { Chat, Message } from './models/chat';
import { timeStamp } from 'console';
import { orderBy, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private firestore:Firestore,
    private userservice:UsersService
  ) { }
  createChat(otheruser:profileUser):Observable<any>{
    const ref = collection(this.firestore,"chats");
    return this.userservice.currentUserProfile.pipe(
      take(1),
      concatMap(user => addDoc(ref,{
        userIds:[user?.uid,otheruser.uid],
        users:[
          {
            displayName:user?.displayName??"",
            photoUrl:user?.photoUrl ?? "",
          },
          {
            displayName:otheruser?.displayName??"",
            photoUrl:otheruser?.photoUrl ?? "",
          },
        ]
      })),
      map(ref => ref.id)
    )

  }

  get myChats$():Observable<Chat[]>{
    const ref = collection(this.firestore,"chats");
    return this.userservice.currentUserProfile.pipe(
      concatMap((user)=>{
        const myQuery= query(ref,where('userIds',"array-contains",user?.uid))
        return collectionData(myQuery,{idField:"id"}).pipe(map(
          chats => this.addChatNameAndPic(user?.uid ?? '',chats as Chat[])
        )) as Observable<Chat[]>
      })
    )
  }

  addChatMessage(chatId:string, message:string):Observable<any>{
    const ref = collection(this.firestore,"chats", chatId,"messages");
    const chatRef = doc(this.firestore, 'chats',chatId);
    const today = Timestamp.fromDate(new Date())
    return this.userservice.currentUserProfile.pipe(
      take(1),
      concatMap((user)=>
        addDoc(ref, {
          text:message,
          senderId: user?.uid,
          sentDate: today

        })
      ),
      concatMap(()=> updateDoc(chatRef,{lastMessage:message, lastMessageDate:today}))
    )
  }
  getChatMessage(chatId:string):Observable<Message[]>{
    const ref = collection(this.firestore,"chats", chatId,"messages");
    const queryAll = query(ref,orderBy('sentDate','asc'));
    return collectionData(queryAll ) as Observable<Message[]>;
  }

  addChatNameAndPic(currentUserId: string,chats:Chat[]):Chat[]{
    chats.forEach(chat => {
      const otherIndex = chat.userIds.indexOf(currentUserId)===0 ? 1:0;
      const {displayName,photoUrl}= chat.users[otherIndex];
      chat.chatName= displayName;
      chat.chatPic = photoUrl
    })
    return chats;
  } 
  isExistingChat(otherUserId:string):Observable<string | null>{
    return this.myChats$.pipe(
      take(1),
      map(chats =>{
        for( let i=0; i< chats.length;i++ ){
          if(chats[i].userIds.includes(otherUserId)){
            return chats[i].id;
          }
        }
        return null;
      })
    )
  }

}
