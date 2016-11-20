var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new (require('express'))();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler));

app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html')
})


// 开启监听
var currentState;
http.listen(3000, function(){
  console.log('Server is running on port 3000')
})

// 接入socket.io通信功能
io.on('connection', (socket)=>{
  console.log('客户端连接成功:', socket.id);
  if (currentState != null) {
    socket.emit('message', currentState);
  }

  socket.on('disconnected', ()=>{
    console.log('客户端断开连接:', socket.id)
  });

  socket.on('change_state', msg=>{ // 双方客户端中状态改变均可发送此消息，注意要限制并行发送的情况
    console.log('收到来自客户端'+socket.id+'的消息:', msg)
    currentState = msg;
    io.emit('message', msg); // 通过io向全体广播当前状态
  })
})