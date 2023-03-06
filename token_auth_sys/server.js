require('dotenv').config()
const express = require("express")
const jwt = require("jsonwebtoken")
const app = express();
app.use(express.json())
const bcrypt = require("bcrypt")

app.get('/user', authenticateToken, (req, res) => {
    res.json(req.user)
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000, () => {
    console.log(`Server is listing at http://localhost:3000`)
})