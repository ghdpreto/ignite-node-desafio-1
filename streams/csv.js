import assert from 'assert';
import { Parser, parse } from 'csv-parse'
import fs from 'node:fs';

const csv = new URL('./tasks.csv', import.meta.url)
const stream = fs.createReadStream(csv)


// regras para leitura do arquivo
const configArquivo = parse({
    delimiter: ',',
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
})


const arquivo = stream.pipe(configArquivo)

console.log('start\n');

const linhasDoArquivo = []
// se a linha tiver valor, adicionar no array
arquivo.on('readable', () => {
    let record
    while ((record = arquivo.read()) !== null) {
        linhasDoArquivo.push(record)
    }
})


arquivo.on('error', (err) => {
    console.error(err)
})


// leitura finalizada com sucesso envia para a api criar 
arquivo.on('end', async () => {
    for await (const record of linhasDoArquivo) {
        const [title, description] = record

        const requestConfig = {
            method: 'POST',
            body: JSON.stringify({
                title, description
            })
        }

        const response = await fetch('http://localhost:3333/tasks', requestConfig)
        console.log({ title, description, status: response.status, data: response.data })
    }
    console.log('...done\n');
})




