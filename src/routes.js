/**
 * Aqui encontra-se todas as rotas da aplicacao
 */

export const routes = [
    {
        method: 'GET',
        url: '/',
        handler: (req, res) => {
            return res.end(JSON.stringify({mensagem: "Olá Mundo!"}))
        }
    }
]