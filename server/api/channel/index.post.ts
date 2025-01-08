import prisma from '~/lib/prisma';
import type { Channel } from '@prisma/client'
import { getCurrentUser } from '~/utils';

export default defineEventHandler(async (event): Promise<{ channel?: Channel, err?: Error }> => {
  try {
    const user = await getCurrentUser(event);
    const { name, topic, inviteCode } = await readBody(event);

    if (inviteCode) {
      const invitedUser = await prisma.user.findUnique({
        where: { inviteCode },
      });

      if (!invitedUser) {
        return { err: new Error('Invalid invite code.') };
      }

      if (invitedUser.id === user.id) {
        return { err: new Error('Cannot create a direct channel with yourself.') };
      }

      const existingChannel = await prisma.channel.findFirst({
        where: {
          isDirect: true,
          members: {
            every: {
              id: { in: [user.id, invitedUser.id] },
            },
          },
        },
      });

      if (existingChannel) {
        return { channel: existingChannel };
      }

      try {
        const channel = await prisma.channel.create({
          data: {
            isDirect: true,
            name: `${user.username} ${invitedUser.username}`,
            topic: topic || '',
            admin: {
              connect: { id: user.id },
            },
            members: {
              connect: [{ id: user.id }, { id: invitedUser.id }],
            },
          },
        });
        console.log("Created a private channel:", channel);
        return { channel };
      } catch (err) {
        console.error("Failed to create private channel:", err);
        return { err: err as Error };
      }
    } else {
      try {
        const channel = await prisma.channel.create({
          data: {
            name,
            topic,
            admin: {
              connect: { id: user.id },
            },
            members: {
              connect: { id: user.id },
            },
          },
        });
        console.log("Created a public channel:", channel);
        return { channel };
      } catch (err) {
        console.error("Failed to create channel:", err);
        return { err: err as Error };
      }
    }
  } catch (err) {
    return { err: err as Error };
  }
});