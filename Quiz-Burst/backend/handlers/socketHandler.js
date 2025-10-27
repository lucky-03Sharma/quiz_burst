export default function registerSocketHandlers(io, socket) {
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg)
  })

  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode)
    io.to(roomCode).emit('roomJoined', { user: socket.id, room: roomCode })
  })

  socket.on('startGame', (roomCode) => {
    io.to(roomCode).emit('gameStarted', { status: 'started', room: roomCode })
  })

  socket.on('submitAnswer', (data) => {
    io.to(data.roomCode).emit('answerReceived', data)
  })

  socket.on('updateScore', (data) => {
    io.to(data.roomCode).emit('scoreUpdate', data)
  })

  socket.on('kickPlayer', (data) => {
    io.to(data.roomCode).emit('playerKicked', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    io.emit('userLeft', socket.id)
  })

  socket.on('typing', (data) => {
    io.to(data.room).emit('userTyping', { user: socket.id, typing: true })
  })

  socket.on('stopTyping', (data) => {
    io.to(data.room).emit('userTyping', { user: socket.id, typing: false })
  })
}
