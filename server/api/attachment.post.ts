import { getCurrentUser } from "~/utils";

interface AttachmentPostResponse {
  url?: string
  err?: Error
}

export default defineEventHandler(async (event): Promise<AttachmentPostResponse> => {
  try {
    const user = await getCurrentUser(event);
    const { files } = await readBody<{ files: File[] }>(event)

    if (files.length != 1) {
      setResponseStatus(event, 400, "Client error");
      return { err: new Error("Expected exactly one file") }
    }

    const [file] = files;

    const filename = await storeFileLocally(
      {
        name: file.name,
        content: file.content,
        type: "application/octet-stream",
        size: file.content.length.toString(),
        lastModified: (new Date()).toString(),
      },
      16,
      '/attachments'
    )

    return { url: `/api/attachment/${filename}` }
  } catch (e) {
    console.error("Failed to post attachment:", e);
    return { err: e as Error }
  }
})

interface File {
  name: string
  content: string
}
