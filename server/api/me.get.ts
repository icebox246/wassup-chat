import { getCurrentUser } from "~/utils"

interface MeResponse {
  me?: {
    id: number,
    username: string,
    registeredDate: Date,
  }
  err?: Error,
}

export default defineEventHandler(async (event): Promise<MeResponse> => {
  try {
    const user = await getCurrentUser(event);
    const { id, username, registeredDate } = user;
    return { me: { id, username, registeredDate } };
  } catch (err) {
    return { err: err as Error };
  }
})
