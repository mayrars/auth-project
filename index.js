const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({ message: "Hello from the server"})
})

app.listen(process.env.PORT || 3000), () => {
    console.log('listen...')
}