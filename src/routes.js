import {Database} from './database.js'
import { randomUUID } from "node:crypto"
import { schemaCriarTaskBody } from "./utils/schema-criar-task-body.js"

/**
 * Aqui encontra-se todas as rotas da aplicacao
 */


const database = new Database()
export const routes = [
    {
        method: 'GET',
        url: '/',
        handler: (req, res) => {
            return res.end(JSON.stringify({mensagem: "Olá Mundo!"}))
        }
    },
    
    {
        method: 'POST',
        url: '/tasks',
        handler: (req, res) => {
            try {
                schemaCriarTaskBody(req.body)

                const { title, description } = req.body

                if (!title || !description) {
                    return res.writeHead(404).end({ mensagem: 'Campos obrigatórios: title, description, body' })
                }

                const novaTask = {
                    id: randomUUID(),
                    completed_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                    title,
                    description
                }

                database.insert('tasks', novaTask)

                return res.writeHead(201).end()
            } catch (error) {
                return res.writeHead(400).end(JSON.stringify({mensagem: error.message}))
            }
        }
    },

    {
        method: 'GET',
        url: '/tasks',
        handler: (req, res) => {
            const tasks = database.select('tasks')
            return res.end(JSON.stringify([{ tasks }]  ))
        }
    },

]