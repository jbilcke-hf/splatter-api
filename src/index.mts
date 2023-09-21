import express from "express"

import { runGaussianSplattingCUDA, Options } from "./gaussian-splatting.mts"

import { initFolders } from "./initFolders.mts"

initFolders()

const app = express()
const port = 7860

const maxActiveRequests = 4
let activeRequests = 0

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))

app.post("/", async (req, res) => {
  if(activeRequests >= maxActiveRequests) {
    res.status(503).json({message: "Service Unavailable: Max concurrent requests reached. Please try again later"}).end();
    return
  }
  activeRequests++
  
  let options: Options = req.body // Assuming the body contains the options
  
  try {
    const result = await runGaussianSplattingCUDA(options);
    res.status(200).json({
      success: true,
      message: result
    }).end();
  } catch (error) {
    res.status(500).json({
      error: "Couldn't generate gaussian splatting scene",
      message: error
    }).end()
  }

  activeRequests--
});

app.get("/", async (req, res) => {
  // this is what users will see in the space - but no need to show something scary
  res.status(200)
  res.write(`<html><head></head><body>
Splatter API is a micro-service used to generate gaussian splatting scenes.
    </body></html>`)
  res.end()
})

app.listen(port, () => { console.log(`Open http://localhost:${port}`) })

