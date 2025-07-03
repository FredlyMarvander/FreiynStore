const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const router = require('./routes/index')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(session({
    secret: 'Secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))



app.get('/', (req, res) => {
    let { error } = req.query
    res.render('home', { error, userId: req.session.userId })
})

app.use('/', router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})