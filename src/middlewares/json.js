/**
 * Essa funcao transformar o corpo da requisição em um json
 */

export async function json(req, res) {
    const buffers = []

    for await (const pedaco of req) {
        buffers.push(pedaco)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch (error) {
        req.body = null        
    }

    res.setHeader('Content-Type', "application/json")
}