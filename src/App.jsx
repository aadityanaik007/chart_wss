import React, { useEffect, useState } from 'react'
import Example from './components/Barchart';

const socket = new WebSocket("ws://14.141.127.254:6060/RMS");

socket.onopen = () => {
  console.log("socketopen");
  const msg = {
    "method": "auth",
    "params": {
      UserId: 3,
      Token: 'I0kaBd4JNGZIcbp8Zgiq',
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
    socket.send(JSON.stringify({ "method": "getActiveSymbols" }))
    socket.send(JSON.stringify({ "method": "getAllData" }))
  }
};

const App = () => {
  const [Data, setData] = useState([]);
  var user_list = []
  var userData_list = []
  var userData = {}

  useEffect(() => {
    socket.onmessage = (data) => {
      data = JSON.parse(data.data).NetPosition

      if (data) {
        // console.log(user_list);

        for (let i = 0; i < data.length; i++) {
          // console.log(data[i]);
          if (user_list.length === 0) {
            console.log(data[i]['exchange']);
            if (data[i]['exchange'] === "NSEFO" && data[i]['netlivemtmt'] !== NaN) {
              userData['userid'] = data[i]['userid']
              userData['nseMtm'] += data[i]['netlivemtmt']
              userData['sgxMtm'] = 0
              // console.log('nseMtm', userData)
            }
            else {
              userData['userid'] = data[i]['userid']
              userData['sgxMtm'] += data[i]['netlivemtmt']
              userData['nseMtm'] = 0
              // console.log('sgxMtm===', userData)

            }
            userData_list.push(userData);
            user_list.push(userData['userid']);
            userData = {}
            // console.log(userData_list)
          }


          else {
              // console.log("user_list.includes(data[i]['userid'])",data[i]['userid'],user_list);
            if (user_list.includes(data[i]['userid'])) {
              // console.log('include');
              for (let j = 0; j < userData_list.length; j++) {
                if (userData_list[j]['userid'] === data[i]['userid']) {
                  if (data[i]['exchange'] === "NSEFO" && data[i]['netlivemtmt'].isNa) {
                    console.log("====",userData_list[j]);
                    userData_list[j]['nseMtm'] += data[i]['netlivemtmt']
                    console.log("bbbb",userData_list[j]);        
                  }
                  else {
                    userData_list[j]['sgxMtm'] += data[i]['netlivemtmt']
                  }
                  // console.log(userData_list[j]);        
                }
              }
            }
            else {
              // console.log('not include');
              userData = {}
              user_list.push(data[i]['userid']);
              if (data[i]['exchange'] === "NSEFO" && data[i]['netlivemtmt'] !== NaN) {
                userData['userid'] = data[i]['userid']
                userData['nseMtm'] = data[i]['netlivemtmt']
                userData['sgxMtm'] = 0
              }
              else {
                userData['userid'] = data[i]['userid']
                userData['sgxMtm'] = data[i]['netlivemtmt']
                userData['nseMtm'] = 0
              }
              userData_list.push(userData);
            }
          }
        }
      }
      console.log(userData_list);

    }
    // setData(dt);
    // setData(data);
  }, []);

  // console.log(Data);
  // console.log(Data);


  return (
    <div>
      hi
      {/* Data Received:==== {data} */}
      {/* <Example data={data} /> */}
    </div>
  )
}

export default App; 