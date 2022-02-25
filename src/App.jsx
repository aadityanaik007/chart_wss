import React, { useEffect, useState } from 'react'
import Example from './components/Barchart';

const socket = new WebSocket("ws://14.141.127.254:6060/RMS");

socket.onopen = () => {
  console.log("socketopen");
  const msg = {
    "method": "auth",
    "params": {
      UserId: 2,
      Token: 'mpouhfBwhqP3aRhsyZgg',
    }
  }

  const msg2 = {
    "method": "ServerONOFF",
    "params": {
      value: true,
    }
  }

  if (socket.readyState === 1) {
    socket.send(JSON.stringify(msg))
    socket.send(JSON.stringify(msg2))
    socket.send(JSON.stringify({"method":"getActiveSymbols"}))   
    socket.send(JSON.stringify({"method": "getAllData" }))
  }
};

const App = () => {
  const [Data, setData] = useState([]);
  var user_list = []
  var userData = {}

  useEffect(() => {
    socket.onmessage = (data) => {
      data = JSON.parse(data.data).NetPosition
      console.log(data);
      for(let i=0;i<data.length;i++){
        if(data[i]){
          if(user_list.length === 0){
            if(data['exchange'] ==="NSEFO"){
              userData['nseMtm']+=data['netlivemtmt']
            }
            else{
              userData['sgxMtm']+=data['netlivemtmt']
            }
          }
        }
      }
      let dt = data.map((item)=>{
        if(item['ctclid'])
        return {'userid':item['userid'],'ctclid':item['ctclid'],'buybrok':item['buybrok'],'netqty':item['netqty']}
      })
      // console.log();
      setData(dt);
      // setData(data);
    };
  }, []);
  
  // console.log(Data);
  // console.log(Data);
const data= Data
  // const data = [
  //   {
  //     name: "Page A",
  //     uv: '400',
  //     pv: Math.random()*10000,
  //     amt: 8000
  //   },
  //   {
  //     name: "Page B",
  //     uv: 3000,
  //     pv: 1398,
  //     amt: 2210
  //   },
  //   {
  //     name: "Page C",
  //     uv: 2000,
  //     pv: 9800,
  //     amt: 2290
  //   },
  //   {
  //     name: "Page D",
  //     uv: 2780,
  //     pv: 3908,
  //     amt: 2000
  //   },
  //   {
  //     name: "Page E",
  //     uv: 1890,
  //     pv: 4800,
  //     amt: 2181
  //   },
  //   {
  //     name: "Page F",
  //     uv: 2390,
  //     pv: 3800,
  //     amt: 2500
  //   },
  //   {
  //     name: "Page G",
  //     uv: 3490,
  //     pv: 4300,
  //     mv: 4511,
  //     amt: 2100
  //   }
  // ];


  return (
    <div>
      {/* Data Received:==== {data} */}
      <Example data={data} />
    </div>
  )
}

export default App; 