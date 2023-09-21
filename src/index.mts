
import express from "express"
import { initFolders } from "./initFolders.mts"

initFolders()

const app = express()
const port = 7860

const queue = []
const queueLimit = 4

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))

app.post("/", async (req, res) => {
  // TODO
})

app.get("/", async (req, res) => {
  // this is what users will see in the space - but no need to show something scary
  res.status(200)
  res.write(`<html><head></head><body>
Splatter API is a micro-service used to generate gaussian splatting scenes.
    </body></html>`)
  res.end()
})

app.listen(port, () => { console.log(`Open http://localhost:${port}`) })