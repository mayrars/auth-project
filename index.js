const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongose = require('mongoose');

const authRouter = require('./routers/authRouter')

const app = express();
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongose.connect(process.env.MONGO_URI).then(() => {
    console.log('connected to db')
}).catch((err) => {
    console.log(err)
})

app.use('/api/auth', authRouter)
app.get('/', (req, res) => {
    res.json({ message: "Hello from the server"})
})

app.listen(process.env.PORT || 3000), () => {
    console.log('listen...')
}