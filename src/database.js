import { randomUUID } from "node:crypto"
import fs from "node:fs/promises"

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}
    
    constructor() {
        // carregando dados do banco existente
        fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            // cria um novo banco em branco
            this.#persist()
        })
        
    }

    // metodo utilizado para persistir para o arquivo db.json as atualizacoes que ocorreram
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {

        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data] 
        }

        this.#persist()
    }

    select(table, filter) {
        let data = this.#database[table] ?? []

        if (filter) {
            const filtroComValor = Object.entries(filter).filter(([key, value]) => {
                if (value) {
                    return { [key]:value }
                }
            })

            if (filtroComValor.length >=1) {
                data = data.filter(row => {
                    return filtroComValor.some(([key, value]) => {
                        if (value) {
                            return row[key].toLowerCase().includes(value.toLowerCase())
                        } else {
                            return row
                        }
                    })
                })
            }
        }

        return data
    }

    selectById(table, id) {
        let data = this.#database[table] ?? []

        const task = data.find(el => el.id === id)

        if (!task) return null

        return task
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(el => el.id === id)
        
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...data, updated_at: new Date() }
            this.#persist()
        }
    }
}