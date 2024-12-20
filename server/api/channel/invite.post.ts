import prisma from '~/lib/prisma';
import { getCurrentUser } from '~/utils';

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event);
    const { inviteCode } = await readBody(event);

    if (!inviteCode) {
      throw Error("Invite code is required");
    }

    const channel = await prisma.channel.findUnique({
      where: { inviteCode },
    });

    if (!channel) {
      setResponseStatus(event, 404, "Channel not found");
      return { err: "Channel not found" };
    }

    const updatedChannel = await prisma.channel.update({
      where: { id: channel.id },
      data: {
        members: {
          connect: { id: user.id },
        },
      },
    });

    return { channel: updatedChannel };
  } catch (err) {
    return { err: (err as Error).message };
  }
  
});
