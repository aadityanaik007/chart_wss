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
      // for(let i in data){
      //   if(data[i]['userid'] === "TG10"){
      //     // console.log(data[i]);
      //     if(data[i]['exchange'] ==="NSEFO"){
      //     console.log(data[i]);

      //     }
      //   }

      // }

      if (data) {

        for (let i = 0; i < data.length; i++) {
          // console.log(data[i]);
          if (user_list.length === 0) {
            userData['userid'] = data[i]['userid']
            userData['SGXFOMTM'] = 0
            userData['nseMtm'] = 0
            userData['nseMtmCE'] = 0
            userData['nseMtmPE'] = 0
            userData['NSEFOMTM'] = 0
            userData['NETMTM'] = 0
            // console.log(data[i]['exchange']);
            if (data[i]['exchange'] === "NSEFO" && !isNaN(data[i]['netlivemtmt'])) {
              userData['userid'] = data[i]['userid']
              if (data[i]['opttype'] === 'CE') {
                userData['nseMtmCE'] = data[i]['netlivemtmt']
              }
              if (data[i]['opttype'] === 'PE') {
                userData['nseMtmPE'] = data[i]['netlivemtmt']
              }
              if (data[i]['securitytype'] === 'FUTIDX') {
                userData['nseMtm'] = data[i]['netlivemtmt']
              }
              // console.log('nseMtm', userData)
            }

            if (data[i]['exchange'] === "SGXFO" && !isNaN(data[i]['netlivemtmt'])) {
              userData['userid'] = data[i]['userid']
              userData['SGXFOMTM'] = data[i]['netlivemtmt']

              // console.log('SGXFOMTM===', userData)

            }
            userData['NSEFOMTM'] = userData['nseMtmCE'] + userData['nseMtmPE'] + userData['nseMtm']
            userData['NETMTM'] = userData['NSEFOMTM'] + userData['SGXFOMTM']
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
                  if (data[i]['exchange'] === "NSEFO" && !isNaN(data[i]['netlivemtmt'])) {
                    if (data[i]['opttype'] === 'CE') {
                      userData_list[j]['nseMtmCE'] = data[i]['netlivemtmt']
                    }
                    if (data[i]['opttype'] === 'PE') {
                      userData_list[j]['nseMtmPE'] = data[i]['netlivemtmt']
                    }
                    if (data[i]['securitytype'] === 'FUTIDX') {
                      userData_list[j]['nseMtm'] = data[i]['netlivemtmt']
                    }
                  }

                  if (data[i]['exchange'] === "SGXFO" && !isNaN(data[i]['netlivemtmt'])) {
                    userData_list[j]['SGXFOMTM'] = data[i]['netlivemtmt']
                  }
                  // console.log(userData_list[j]);        
                }
                userData_list[j]['NSEFOMTM'] = userData_list[j]['nseMtmCE'] + userData_list[j]['nseMtmPE'] + userData_list[j]['nseMtm']
                userData_list[j]['NETMTM'] = userData_list[j]['NSEFOMTM'] + userData_list[j]['SGXFOMTM']
              }
            }
            else {
              // console.log('not include');
              userData = {}
              user_list.push(data[i]['userid']);
              userData['userid'] = data[i]['userid']
              userData['SGXFOMTM'] = 0
              userData['nseMtm'] = 0
              userData['nseMtmCE'] = 0
              userData['nseMtmPE'] = 0
              userData['NSEFOMTM'] = 0

              if (data[i]['exchange'] === "NSEFO" && !isNaN(data[i]['netlivemtmt'])) {
                userData['userid'] = data[i]['userid']
                if (data[i]['opttype'] === 'CE') {
                  userData['nseMtmCE'] = data[i]['netlivemtmt']
                }
                if (data[i]['opttype'] === 'PE') {
                  userData['nseMtmPE'] = data[i]['netlivemtmt']
                }
                if (data[i]['securitytype'] === 'FUTIDX') {
                  userData['nseMtm'] = data[i]['netlivemtmt']
                }
              }
              if (data[i]['exchange'] === "TG10" && !isNaN(data[i]['netlivemtmt'])) {
                userData['userid'] = data[i]['userid']
                userData['SGXFOMTM'] = data[i]['netlivemtmt']
              }
              userData['NSEFOMTM'] = userData['nseMtmCE'] + userData['nseMtmPE'] + userData['nseMtm']
              userData['NETMTM'] = userData['NSEFOMTM'] + userData['SGXFOMTM']
              userData_list.push(userData);
            }
          }

        }
      }
      setData(userData_list)
      // for (let m in userData_list) {
      //   if (userData_list[m]['userid'] === "TG10") {
      //     console.log(userData_list[m]);
      //   }
      //   // var {userid,NSEFOMTM,SGXFOMTM,NETMTM} = userData_list[m]
      //   // if(userid==="CNSI02"){
      //   //   console.log(userid,NSEFOMTM,SGXFOMTM,NETMTM);
      //   // }
      // }
      // console.log(userData_list);

    }
    // setData(dt);
    // setData(data);
  }, []);

  // console.log(Data);
  // console.log(Data);


  return (
    <div>
      {/* Data Received:==== {data} */}
      <Example data={Data.length!==0?Data:''} />
    </div>
  )
}

export default App; 