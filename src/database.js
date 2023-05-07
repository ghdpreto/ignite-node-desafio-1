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
}