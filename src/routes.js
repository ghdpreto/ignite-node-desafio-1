import {Database} from './database.js'
import { randomUUID } from "node:crypto"
import { schemaCriarTaskBody } from "./utils/schema-criar-task-body.js"
import { schemaAtualizaTaskBody } from "./utils/schema-atualizar-task-body.js"
import { buildRoutePath } from "./utils/build-route-path.js"

/**
 * Aqui encontra-se todas as rotas da aplicacao
 */


const database = new Database()
export const routes = [
    {
        method: 'GET',
        url: buildRoutePath('/'),
        handler: (req, res) => {
            return res.end(JSON.stringify({mensagem: "Olá Mundo!"}))
        }
    },
    
    {
        method: 'POST',
        url: buildRoutePath('/tasks'),
        handler: (req, res) => {
            try {
                schemaCriarTaskBody(req.body)

                const { title, description } = req.body

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
        url: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.query


            
            const tasks = database.select('tasks', {
                title: title ?  title : null,
                description: description ?  description  : null
            })

            return res.end(JSON.stringify({ tasks }))
        }
    },

    {
        method: 'DELETE',
        url: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            const existTask = database.selectById('tasks', id)

            if (!existTask) return res.writeHead(404).end()

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },

    {
        method: 'PATCH',
        url: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {

            const { id } = req.params

            const existTask = database.selectById('tasks', id)

            if (!existTask) return res.writeHead(404).end()

            if (!existTask.completed_at) {
                existTask.completed_at = new Date()
            } else {
                existTask.completed_at = null
            }

            database.update('tasks', id, { ...existTask })

            return res.writeHead(204).end()
        }
    },

    {
        method: 'PUT',
        url: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            try {
                schemaAtualizaTaskBody(req.body)
                const { id } = req.params
                const { title, description } = req.body

                const existTask = database.selectById('tasks', id)

                if (!existTask) return res.writeHead(404).end()


                if (title) {
                    existTask.title = title
                }

                if (description) {
                    existTask.description = description
                }

                database.update('tasks', id, { ...existTask })

                return res.writeHead(204).end()

            } catch (error) {
                return res.writeHead(400).end(JSON.stringify({ mensagem: error.message }))
            }
        }
    },
]