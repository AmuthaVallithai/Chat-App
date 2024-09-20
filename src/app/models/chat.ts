import { Timestamp } from "firebase/firestore";
import { profileUser } from "./user-profile";

export interface Chat{
    id: string;
    lastMessage?:string;
    lastMessageDate?:Date & Timestamp;
    userIds:string[];
    users:profileUser[];

    chatPic?:string;
    chatName?:string;
}

export interface Message{
    text:string;
    senderId:string;
    sentDate:Date & Timestamp;
}