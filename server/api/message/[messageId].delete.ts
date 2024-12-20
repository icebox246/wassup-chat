import prisma from '~/lib/prisma';
import type { Channel } from '@prisma/client'
import { getCurrentUser } from '~/utils';

export default defineEventHandler(async (event): Promise<{ err?: Error }> => {
  try {
    const id = Number.parseInt(getRouterParam(event, 'messageId') ?? 'nan');
    if (isNaN(id)) {
      throw Error("Invalid message Id")
    }

    const user = await getCurrentUser(event);

    const oldMessage = await prisma.message.findUnique({
      where: {
        id
      },
    })

    if (!oldMessage) {
      setResponseStatus(event, 404, "Not Found");
      return { err: Error("Message does not exist") };
    }

    if (oldMessage.authorId != user.id) {
      setResponseStatus(event, 403, "Forbidden");
      return { err: Error("Cannot remove messages belonging to other users") };
    }

    await prisma.message.delete({
      where: {
        id
      }
    })

    return {};
  } catch (err) {
    setResponseStatus(event, 500, "Internal error")
    console.error(err)
    return { err: err as Error }
  }
})

