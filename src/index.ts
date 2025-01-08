import express from "express"
import apiRouter from "./api"
import { config }  from "./config"
import connectToMongoDB from "./db/db"

const app = express()
app.use(express.json())

app.use(apiRouter)

const PORT = config.server.port

app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`App running at PORT ${PORT}`)
})
