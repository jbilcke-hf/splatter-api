import path from "node:path"

export const storagePath = `${process.env.STORAGE_PATH || './sandbox'}`

export const inputsDirFilePath = path.join(storagePath, "training_inputs")
export const outputsDirFilePath = path.join(storagePath, "training_outputs")

export const shotFormatVersion = 1
export const sequenceFormatVersion = 1
