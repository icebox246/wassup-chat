import prisma from '~/lib/prisma';
import type { Channel } from '@prisma/client'
import { getCurrentUser } from '~/utils';

export default defineEventHandler(async (event): Promise<{ err?: Error }> => {
  try {
    const id = Number.parseInt(getRouterParam(event, 'channelId') ?? 'nan');
    if (isNaN(id)) {
      throw Error("Invalid channel Id")
    }

    const user = await getCurrentUser(event);

    const oldChannel = await prisma.channel.findUnique({
      where: {
        id
      },
      include: {
        members: true
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

    console.log("disconnecting", JSON.stringify(oldChannel.members))

    await prisma.channel.delete({
      where: {
        id
      },
    })

    return {};
  } catch (err) {
    setResponseStatus(event, 500, "Internal error")
    console.error(err)
    return { err: err as Error }
  }
})
