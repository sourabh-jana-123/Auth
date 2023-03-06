require('dotenv').config()
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json())

let refreshTokens = []

const users = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) res.sendStatus(401)

    if (!refreshTokens.includes(refreshToken)) res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.statusCode(403)
        const accessToken = generateAccessToken({ name: user.name, password: user.password })
        res.json({ accessToken: accessToken })

    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)

    res.sendStatus(204)
})

app.post('/register', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashPassword }
        users.push(user);
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/user/login', async (req, res) => {
    console.log(req.body, users)
    const user = users.find(user => user.name === req.body.name)

    if (user == null) return res.status(400).send('Cannot find user')

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken);
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        } else {
            res.send('Not Allowed')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }

})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })

}

app.listen(4000, () => {
    console.log(`Server is listing at http://localhost:4000`)
})