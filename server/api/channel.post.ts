import prisma from '~/lib/prisma';
import type { Channel } from '@prisma/client'
import { getCurrentUser } from '~/utils';

export default defineEventHandler(async (event): Promise<{ channel?: Channel, err?: Error }> => {
  try {
    const user = await getCurrentUser(event);
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
  } catch (err) {
    return { err: err as Error }
  }
})
