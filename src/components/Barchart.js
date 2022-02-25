import React, { useEffect,useState } from 'react'

// const socket = new WebSocket("ws://192.168.1.51:7897");

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";



export default function Example({data}) {
  return (
    <BarChart
      width={500}
      height={500}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="pv" stackId="a" fill="#8884d8" />
      <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
      <Bar dataKey="amt" stackId="a" fill="#82ca78" />
    </BarChart>
  );
}

