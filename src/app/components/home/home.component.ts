import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { User } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatListModule, MatSelectionList } from "@angular/material/list"
import { profileUser } from '../../models/user-profile';
import { ChatService } from '../../chat.service';
import { Chat, Message } from '../../models/chat';
import { DateDisplayPipe } from "../../pipes/date-display.pipe";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatListModule,
    MatSelectionList,
     DateDisplayPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('endOfChat')
  endOfchat!: ElementRef;
  user!: Observable<User | any>;
  userName: any;
  users$!:Observable<profileUser[]>
 
  searchControl = new FormControl()
  chatListControl = new FormControl()
  messageControl = new FormControl('')
  user$!: Observable<profileUser | null>;
  myChats$!:Observable<Chat[]>
  selectedChat$!: Observable<any>;
  message$!: Observable<Message[]>;

  constructor(public authservice:AuthenticationService,
    private router :Router,
    private userservice:UsersService,
    private chatservice:ChatService

  ){}

  ngOnInit(): void {
    this.myChats$ = this.chatservice.myChats$; 
   this.user$=this.userservice.currentUserProfile
    this.users$= combineLatest([this.userservice.allUsers$,this.user$,this.searchControl.valueChanges.pipe(startWith(""))]).pipe(
      map(([users,user,searchString])=> users.filter((u) => u.displayName?.toLowerCase().includes(searchString.toLowerCase())&& u.uid != user?.uid)))
    

     this. selectedChat$ = combineLatest([this.chatListControl.valueChanges.pipe(startWith([])),this.myChats$]).pipe(
        map(([value,chats])=>{
          if (Array.isArray(value) && value.length > 0) {
            return chats.find(c => c.id === value[0]) || null;
          }
          return null;
        })
        )
        this.message$ = this.chatListControl.valueChanges.pipe(
          startWith([]), // Default to an empty array
          map(value => {
            // Ensure value is an array and has at least one element
            return Array.isArray(value) && value.length > 0 ? value[0] : null;
          }),
          switchMap(chatId => {
            if (chatId) {
              return this.chatservice.getChatMessage(chatId);
            } else {
              return of([]); // Return an empty observable if chatId is null
            }
          }),
        tap(()=>{
        this.scrollToBottom()
  }))
      
    this.user=this.authservice.currentUser.pipe(
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

  createChat(otheruser:profileUser){
    this.chatservice.isExistingChat(otheruser?.uid).pipe(
    switchMap((chatId) =>{
      if(chatId){
        return of(chatId)
      }
      else{
        return this.chatservice.createChat(otheruser);
      }
    })
    ).subscribe((chatId) =>{
      this.chatListControl.setValue([chatId])
    });
  }

  sendMessage(){
    const message = this.messageControl.value;
    const selectedChatValue = this.chatListControl.value;
    const selectedChatId = Array.isArray(selectedChatValue) && selectedChatValue.length > 0 
    ? selectedChatValue[0] 
    : null;
;

    if(message && selectedChatId){
      this.chatservice.addChatMessage(selectedChatId,message).subscribe(()=>{
      this.scrollToBottom()
    });
      this.messageControl.setValue('');
    }
  }

  scrollToBottom(){
    setTimeout(()=>{
      if(this.endOfchat){
        this.endOfchat.nativeElement.scrollIntoView({behaviour:"smooth"})
      }
    },100);
   
  }
}