import { User } from "@prisma/client";
import prisma from "~/lib/prisma";
import { getTokenFromCookies, getUserFromToken } from "~/utils";
import { DeleteMessageSocketMessage, isDeleteMessageMessage, isPingMessage, isPostMessageMessage, isSocketMessage, NewMessageSocketMessage, PostMessageSocketMessage, SocketMesageType } from "~/utils/socket_messages";

const peerIdToUser = new Map<string, User>

export default defineWebSocketHandler({
  async open(peer) {
    console.log("Peer requested to join:", peer.id)
    const cookieString = peer.request?.headers?.get("cookie");
    if (!cookieString) {
      peer.terminate();
      return;
    }
    const authToken = getTokenFromCookies(cookieString);
    if (!authToken) {
      peer.terminate();
      return;
    }
    const user = await getUserFromToken(authToken);
    if (!user) {
      peer.terminate();
      return;
    }

    const userWithChannels = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscribedChannels: true }
    })

    if (!userWithChannels) {
      peer.terminate()
      return;
    }

    console.log("Accepted peer with id:", peer.id)
    peerIdToUser.set(peer.id, user);

    for (const chan of userWithChannels.subscribedChannels) {
      peer.subscribe(`chan${chan.id}`)
      console.log(`Subscribed peer ${peer.id} to ${chan.id}`)
    }
  },
  async message(peer, message) {
    const data = message.json()
    const user = peerIdToUser.get(peer.id)
    if (!user) {
      peer.terminate()
      return;
    }

    if (!isSocketMessage(data)) {
      console.error("Got invalid message from peer:", peer)
      peer.close()
      return;
    }
    if (isPingMessage(data)) {
      peer.send(JSON.stringify(data))
      return;
    }

    if (isPostMessageMessage(data)) {
      const postMsg = data as PostMessageSocketMessage;
      const message = await prisma.message.create({
        data: {
          content: postMsg.message.content,
          type: postMsg.message.type,
          channelId: postMsg.message.channel_id,
          sentDate: new Date(),
          authorId: user.id,
        },
        include: {
          author: true
        }
      })
      const msg: NewMessageSocketMessage = {
        type: SocketMesageType.new_message,
        message
      }
      peer.publish(`chan${message.channelId}`, JSON.stringify(msg))
      peer.send(JSON.stringify(msg))
      console.log(`Publishing message on ${message.channelId}`)
      return;
    }

    if (isDeleteMessageMessage(data)) {
      const delMsg = data as DeleteMessageSocketMessage;
      const msgToDel = await prisma.message.findUnique({
        where: {
          id: delMsg.messageId
        }
      });
      if (msgToDel && msgToDel.authorId == user.id) {
        await prisma.message.delete({
          where: {
            id: delMsg.messageId
          }
        });

        peer.publish(`chan${msgToDel.channelId}`, JSON.stringify(delMsg));
        peer.send(JSON.stringify(delMsg));
        console.log(`Deleting message on ${msgToDel.channelId}`)
        return;
      } else {
        console.warn("Peer requested deletion of invalid message", peer.id, delMsg.messageId)
      }

      return;
    }

    console.log("Peer sent message:", peer.id, message.text())
  },
  close(peer) {
    peerIdToUser.delete(peer.id)
  },
});


