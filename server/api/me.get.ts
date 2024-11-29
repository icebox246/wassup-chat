import { getUserFromToken } from "~/utils"

interface MeResponse {
  id?: number,
  username?: string,
  registeredDate?: Date,
  err?: Error,
}

export default defineEventHandler(async (event): Promise<MeResponse> => {
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

  const { id, username, registeredDate } = user;
  return { id, username, registeredDate };
})
