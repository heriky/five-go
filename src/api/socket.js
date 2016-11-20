import io from 'socket.io-client' ;

const socket = io.connect('localhost:3000');

  socket.on('connection', (server)=>{
    console.log('与服务器连接成功');
    connCb();
    server.on('disconnected', ()=>{
      console.log('与服务器断开连接');
      disconnCb();
    });
  })

exports.onConnect = function(connCb, disconnCb){
  socket.on('connection', (server)=>{
    console.log('与服务器连接成功');
    connCb();
    server.on('disconnected', ()=>{
      console.log('与服务器断开连接');
      disconnCb();
    });
  })
}


exports.onReceived = (cb)=>{
  socket.on('message', msg=>{
    cb(msg);
  })
}

exports.sendMsg = (msg)=>{ // msg为json对象
  socket.emit('change_state', msg)
}

