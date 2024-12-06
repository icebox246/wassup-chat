import { Message, User } from '@prisma/client';
import prisma from '~/lib/prisma';
import { getCurrentUser } from '~/utils';

interface MessagesResult {
  messages?: Array<Message & { author: User }>,
  err?: Error | undefined
}

export default defineEventHandler(async (event): Promise<MessagesResult> => {
  try {
    const channelId = Number.parseInt(getRouterParam(event, 'channelId') ?? 'nan');
    if (isNaN(channelId)) {
      throw Error("Invalid channel Id")
    }

    const user = await getCurrentUser(event);

    const messages = await prisma.message.findMany({
      where: {
        channel: {
          id: channelId
        }
      },
      orderBy: {
        sentDate: 'desc'
      },
      take: 16,
      include: {
        author: true
      }
    })

    return { messages: messages.toReversed() };
  } catch (e) {
    console.error("Failed to get messages:", e);
    return { err: e as Error }
  }
})
