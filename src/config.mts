import path from "node:path"

export const storagePath = `${process.env.STORAGE_PATH || './sandbox'}`

export const postDirFilePath = path.join(storagePath, "posts")

export const shotFormatVersion = 1
export const sequenceFormatVersion = 1
