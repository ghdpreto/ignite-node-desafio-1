import http from "node:http"
import { json } from "./middlewares/json.js"
import { routes } from "./routes.js"

const server = http.createServer(async (req, res) => {
    const {method, url} = req

    await json(req, res)

    const route = routes.find(el => {
        return el.method === method && el.url === url 
    })

    if (route) {
        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})


server.listen(3333, () => { console.log("Server UP! => http://localhost:3333/")})