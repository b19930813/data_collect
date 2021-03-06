import React from 'react'
import webSocket from 'socket.io-client'

export default function Index() {
    const [ws, setWs] = React.useState(null)

    const connectWebSocket = () => {
        //開啟
        setWs(webSocket('http://localhost:4180'))
    }
    React.useEffect(() => {
        if(ws){
            //連線成功在 console 中打印訊息
            console.log('success connect!')
            //設定監聽
            initWebSocket()
        }
    }, [ws])

    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        ws.on('getMessage', message => {
            console.log(message)
        })
    }

    const sendMessage = () => {
        //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
        console.log('run this');
        ws.emit('只回傳給發送訊息的 client')
    }


    return (
      <div>
            <input type='button' value='連線' onClick={connectWebSocket} />
            <input type='button' value='送出訊息' onClick={sendMessage} />
      </div>
    );
}