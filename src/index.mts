
import express from "express"
import { initFolders } from "./initFolders.mts"

initFolders()

const app = express()
const port = 7860

// fix this error: "PayloadTooLargeError: request entity too large"
// there are multiple version because.. yeah well, it's Express!
// app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.get("/", async (req, res) => {
  // this is what users will see in the space - but no need to show something scary
  res.status(200)
  res.write(`<html><head></head><body>
Splatter API is a micro-service used to generate gaussian splatting scenes.
    </body></html>`)
  res.end()
})

app.listen(port, () => { console.log(`Open http://localhost:${port}`) })