import prisma from "~/lib/prisma";
import { getUserFromToken } from "~/utils";

import type { Channel } from "@prisma/client"

interface SubscribedChannelsResult {
  channels?: Channel[],
  err?: Error
}


export default defineEventHandler(async (event): Promise<SubscribedChannelsResult> => {
  const token = getCookie(event, 'auth-cookie')
  if (!token) {
    setResponseStatus(event, 403, "Forbidden");
    return { err: Error("Not signed in") };
  }
  const user = await getUserFromToken(token)
  if (!user) {
    setResponseStatus(event, 401, "Forbidden");
    return { err: Error("Invalid token") };
  }

  const res = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    include: {
      subscribedChannels: true
    }
  })

  return { channels: res?.subscribedChannels }
})
