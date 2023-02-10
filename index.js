const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home', { layout: false })

})

app.use(
    express.urlencoded({
        extended: true
        
}) 
)

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
})

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