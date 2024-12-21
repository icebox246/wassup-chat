import { Message, User } from '@prisma/client';
import { date } from 'yup';
import prisma from '~/lib/prisma';
import { getCurrentUser } from '~/utils';

interface MessagesResult {
  messages?: Array<Message & { author: User }>,
  err?: Error | undefined
}

export default defineEventHandler(async (event): Promise<MessagesResult> => {
  try {
    const channelId = Number.parseInt(getRouterParam(event, 'channelId') ?? 'nan');
    const { before: beforeRaw } = getQuery(event);
    if (isNaN(channelId)) {
      throw Error(`Invalid channel Id ${getRouterParam(event, 'channelId')}`)
    }

    const before = new Date(typeof beforeRaw === "string" ? parseInt(beforeRaw) : Date.now() + 1);
    console.log("Fetching before", before)

    const user = await getCurrentUser(event);

    const messages = await prisma.message.findMany({
      where: {
        channel: {
          id: channelId
        },
        sentDate: {
          lt: before
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
