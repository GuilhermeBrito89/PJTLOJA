const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()


app.engine('handlebars', exphbs.engine())/*A primeira linha app.engine
('handlebars', exphbs.engine())configura o motor de visualização
 do Express para o motor de modelo de visualização Handlebars. O Handlebars 
 é uma biblioteca de modelo de visualização popular para aplicativos web, 
 que permite criar facilmente modelos HTML dinâmicos. A função exphbs.engine() 
 é uma função fornecida pelo pacote "express-handlebars" que retorna uma 
instância do motor de modelo Handlebars configurada para ser usada com o Express.*/
app.set('view engine', 'handlebars')
/*app.set('view engine', 'handlebars') define a string "handlebars" como o 
motor de modelo padrão para a aplicação. Isso significa que o Express usará
 o Handlebars como o motor de modelo padrão para renderizar as visualizações
de sua aplicação*/

app.use(express.static('public'))

app.use(
    express.urlencoded({
        extended: true
        
}) 
)/*A quinta linha app.use(express.urlencoded({ extended: true })) é uma 
chamada para o middleware do Express que analisa o corpo das solicitações 
POST e adiciona os dados ao objeto de solicitação como propriedades.
 O objeto { extended: true } é uma opção que permite que dados complexos 
 sejam transmitidos através do corpo da solicitação.*/

 app.get('/', (req, res) => {
    res.render('home', { layout: false })/*O res.render, irá renderizar os 
    arquivos de acordo com o engine de views utilizado no sistema, que no caso
    aqui é a pagina home do handlebars*/

})

app.post('/prod/insertprod', (req, res) => {
    const nome = req.body.nome
    const quant = req.body.quant

    const sql = `INSERT INTO produto (nome, qtd) VALUES ('${nome}', '${quant}')`

    conn.query(sql, function(err){
        if (err){
            console.log(err)
        }

        res.redirect('/')
    })
})//codigo cominterligação com a home handlebars

//app.use(express.json) 
app.get('/prod', (req, res) => {
    const sql  = 'SELECT * FROM produto'

    conn.query(sql, function(err, data){
        
        if(err){
            console.log(err)
            return
        }

        const listar = data

        console.log(listar)

        res.render('prod', { layout: false, listar })
    })
})

app.get('/prod/:id', (req, res) => {
    const id = req.params.id

    const sql  = `SELECT * FROM produto where ${id}`

    conn.query(sql, function(err, data){
        if (err){
            console.log(err)
            return
        }

        const listarProd = data[id-1]
        res.render('produto', { layout: false, listarProd })
    }) 

})

app.get('/prod/edit/:id' , (req, res) => {

const id = req.params.id

const sql = `SELECT * FROM produto where id =${id}`;

conn.query(sql, function(err, data){
    if(err){
        console.log(err)
        return
    }

    const prod = data[0]
    res.render('edit', {layout: false, prod})
})


})

const conn = mysql.createConnection({
    host: '127.0.0.1',
    user:'root',
    port:'3306',
    password: '',
    database: 'teste'

})


//pegando para editar registro
app.get('/prod/edit/:id', (req, res) => {

    const id = req.params.id

    const sql = `SELECT *  FROM produto where id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const prod = data[0]
        res.render('edit', {layout: false, prod })
        
    })
})

//editando o registro com post
app.post('/prod/updateprod', (req, res) => {

    const id = req.body.id
    const nome = req.body.nome
    const quant = req.body.quant

    const sql = `UPDATE produto SET nome = '${nome}', qtd = '${quant}' WHERE id = '${id}'`

    conn.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/prod')
    })

})

conn.connect(function(err) {
    if(err){
        console.log(err)
    }

    console.log('Conectado com sucesso!')

    app.listen(3000)
})