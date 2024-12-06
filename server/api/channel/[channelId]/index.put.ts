import prisma from '~/lib/prisma';
import type { Channel } from '@prisma/client'
import { getCurrentUser } from '~/utils';

export default defineEventHandler(async (event): Promise<{ channel?: Channel, err?: Error }> => {
  try {
    const id = Number.parseInt(getRouterParam(event, 'channelId') ?? 'nan');
    if (isNaN(id)) {
      throw Error("Invalid channel Id")
    }

    const { name, topic } = await readBody(event);

    const user = await getCurrentUser(event);

    const oldChannel = await prisma.channel.findUnique({
      where: {
        id
      }
    })

    if (!oldChannel) {
      setResponseStatus(event, 404, "Not Found");
      return { err: Error("Channel does not exist") };
    }

    if (oldChannel.adminId != user.id) {
      setResponseStatus(event, 403, "Forbidden");
      return { err: Error("Cannot edit channels belonging to other users") };
    }

    const channel = await prisma.channel.update({
      where: {
        id
      },
      data: {
        name, topic
      }
    })

    return { channel };
  } catch (err) {
    setResponseStatus(event, 500, "Internal error")
    console.error(err)
    return { err: err as Error }
  }
})
