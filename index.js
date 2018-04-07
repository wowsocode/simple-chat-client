require('babel-core/register')

import express from 'express'
import http from 'http'
import socketIo from 'socket.io'
import path from 'path'
import fecha from 'fecha'

let app = express(),
    server = http.createServer(app),
    io = socketIo(server)

io.on('connection', socket => {

    socket.on('SEND_MESSAGE', (d) => {
        let now = Date.now(),
        data = {
            timeStamp: now,
            timeStr: fecha.format(now, 'shortTime'),
            ...d
        }
        io.emit('RECEIVE_MESSAGE', data)
        socket.broadcast.emit('RECEIVE_TYPING', { isTyping: false })
    })

    socket.on('IS_TYPING', (d) => {
        socket.broadcast.emit('RECEIVE_TYPING', d)
    })

})

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/src/server/tpl/index.html')
})

server.listen(1337, () => console.log('listening on port 1337'))