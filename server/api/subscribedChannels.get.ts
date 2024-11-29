import type { Channel } from "@prisma/client";
import prisma from "~/lib/prisma";
import { getCurrentUser } from "~/utils";

interface SubscribedChannelsResult {
  channels?: Channel[],
  err?: Error
}


export default defineEventHandler(async (event): Promise<SubscribedChannelsResult> => {
  try {
    const user = await getCurrentUser(event)

    const res = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        subscribedChannels: true
      }
    })

    return { channels: res?.subscribedChannels }
  } catch (err) {
    return { err: err as Error }
  }
})
