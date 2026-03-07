// 1. expressを読み込む
const express = require('express')

// 2. アプリを作る
const app = express()

// 3. GETリクエストに応答する
app.get('/', (req, res) => {
  res.send('Hello from Docker!')
})

// 4. ポート3000で起動する
app.listen(3000, () => {
  console.log('サーバー起動!')
})