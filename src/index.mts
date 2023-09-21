import { initFolders } from "./initFolders.mts"
import express from "express"
import fileUpload from "express-fileupload"
import path from "path"
import os from "os"
import fs from "fs"
import extract from "extract-zip"
import archiver from "archiver"

import { runGaussianSplattingCUDA, Options } from "./gaussian-splatting.mts"

initFolders()

declare module 'express-serve-static-core' {
  interface Request {
    files: any;
  }
}

const app = express()
const port = 7860

const maxActiveRequests = 4
let activeRequests = 0

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(fileUpload())

app.post("/", async (req, res) => {
  if(activeRequests >= maxActiveRequests) {
    res.status(503).json({message: "Service Unavailable: Max concurrent requests reached. Please try again later"}).end();
    return
  }
  activeRequests++
  
  if (!req.files || !req.files.data) {
    res.status(400).json({error: "Missing data file in request"}).end()
    return
  }

  let options: Options = req.body // Other parameters come in the body
  let dataFile: fileUpload.UploadedFile = req.files.data

  let inputTempDir = path.join(os.tmpdir(), Math.random().toString().slice(2))
  let outputTempDir = path.join(os.tmpdir(), Math.random().toString().slice(2))

  try {
    fs.mkdirSync(inputTempDir) // Create input temp directory
    fs.mkdirSync(outputTempDir) // Create output temp directory

    await dataFile.mv(path.join(inputTempDir, dataFile.name)) // Move zip file to input temp directory
    await extract(path.join(inputTempDir, dataFile.name), {dir: inputTempDir}) // Unzip file

    fs.unlinkSync(path.join(inputTempDir, dataFile.name)) // Delete zip file after extracting

    options.dataPath = inputTempDir // Set dataPath to temporary directory
    options.outputPath = outputTempDir // Set outputPath to temporary directory

    const result = await runGaussianSplattingCUDA(options)

    // Create a zip file of the output directory
    let outputFilePath = path.join(outputTempDir, 'output.zip')
    let output = fs.createWriteStream(outputFilePath)
    let archive = archiver('zip')

    archive.directory(outputTempDir, false)
    archive.pipe(output)
    await archive.finalize()

    // Send zip file in response
    res.status(200)
    res.download(outputFilePath, 'output.zip', (error) => {
      if (!error) fs.rmSync(inputTempDir, {recursive: true, force: true}) // Delete input temp directory after sending response
      fs.rmSync(outputTempDir, {recursive: true, force: true}) // Delete output temp directory after sending response
    })
  } catch (error) {
    res.status(500).json({
      error: "Couldn't generate gaussian splatting scene",
      message: error
    }).end()
  } finally {
    activeRequests--
  }
});

app.get("/", async (req, res) => {
  res.status(200)
  res.write(`<html><head></head><body>
Splatter API is a micro-service used to generate gaussian splatting scenes.
    </body></html>`)
  res.end()
})

app.listen(port, () => { console.log(`Open http://localhost:${port}`) })