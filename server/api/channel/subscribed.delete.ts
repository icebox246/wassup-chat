import prisma from "~/lib/prisma";
import { getCurrentUser } from "~/utils";

export default defineEventHandler(async (event) => {
  try {
    const { channelId } = await readBody(event);
    const user = await getCurrentUser(event)

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        subscribedChannels: {
          disconnect: {
            id: channelId
          }
        }
      }
    })

    await prisma.channel.update({
      where: {
        id: channelId
      },
      data: {
        members: {
          disconnect: {
            id: user.id
          }
        }
      }
    })

    return "ok"
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err: err as Error }
  }
})

