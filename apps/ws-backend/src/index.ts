import {WebSocketServer} from 'ws';


const wss=new WebSocketServer({
    port:8081,
    host:'localhost',
    clientTracking:true,
},function(){
    console.log('server is created at: ws://localhost:8081/')
})

wss.on('connection',(ws,request)=>{
    console.log('client connected');
    if(!request.url){
        ws.send('url is missing.');
        return;
    }

    const url=new URL(request.url,`http://${request.headers.host}`);
    const queryParams = url.searchParams;
    const roomId=queryParams.get('roomId');
    if(!roomId){
        ws.send('roomId is missing in query parameters.')
        return;
    }

    ws.on('message',(message)=>{
        console.log(`message recieved: ${message.toString()}`);
        ws.send(`you said: ${message}`);
    })

    ws.on('close',()=>{
        console.log('client disconnected');
    })
})
