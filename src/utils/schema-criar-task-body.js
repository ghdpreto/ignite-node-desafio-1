
const schemaTask = [
    {
        nome: 'title',
        tipo: 'string'
    },
    {
        nome: 'description',
        tipo: 'string'
    }
]

export function schemaCriarTaskBody(body) {
    schemaTask.forEach(el => {
        if (body.hasOwnProperty(el.nome) && typeof body[el.nome] === el.tipo && body[el.nome].trim() !== '') {
            return
        } else {
            throw new Error(`Campo "${el.nome}" deve ser do tipo "${el.tipo}" e é obrigatório.`)
        }
    })
}