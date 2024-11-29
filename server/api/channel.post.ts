import prisma from '~/lib/prisma';
import { getUserFromToken } from '~/utils';
import type { Channel } from '@prisma/client'

export default defineEventHandler(async (event): Promise<{ channel?: Channel, err?: Error }> => {
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

  const { name, topic } = await readBody(event);

  try {
    const channel = await prisma.channel.create({
      data: {
        name, topic,
        admin: {
          connect: user
        },
        members: {
          connect: user
        }
      }
    })
    console.log("created a channel:", channel)

    return { channel }
  } catch (err) {
    console.error("failed to create user:", err)
    return { err: err as Error }
  }
})
