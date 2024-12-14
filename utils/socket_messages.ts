import type { Message, User } from "@prisma/client";

export enum SocketMesageType {
  ping,
  post_message,
  new_message,
}

export interface SocketMessage {
  type: SocketMesageType
}

export interface PingSocketMessage extends SocketMessage {
}

export interface PostMessageSocketMessage extends SocketMessage {
  message: {
    content: string,
    type: string,
    channel_id: number,
  }
}

export interface NewMessageSocketMessage extends SocketMessage {
  message: Message & { author: User }
}

export function isSocketMessage(message: any): message is SocketMessage {
  return message.type != undefined;
}

export function isPingMessage(message: SocketMessage): message is PingSocketMessage {
  return message.type == SocketMesageType.ping
}

export function isPostMessageMessage(message: SocketMessage): message is PostMessageSocketMessage {
  return message.type == SocketMesageType.post_message
}

export function isNewMessageMessage(message: SocketMessage): message is NewMessageSocketMessage {
  return message.type == SocketMesageType.new_message
}
