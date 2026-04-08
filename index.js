const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

const s3 = new AWS.S3({ region: 'ap-northeast-1' })
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'ap-northeast-1' })

const UPLOAD_BUCKET = process.env.UPLOAD_BUCKET
const DYNAMO_TABLE = process.env.DYNAMO_TABLE

// 既存のエンドポイント
app.get('/', (req, res) => {
  res.send('Hello from Docker! v2')
})

// 画像をS3にアップロード → Lambdaがトリガーされて処理
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'ファイルがありません' })

  const key = `${Date.now()}-${req.file.originalname}`

  await s3.putObject({
    Bucket: UPLOAD_BUCKET,
    Key: key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }).promise()

  res.json({ message: 'アップロード完了', key })
})

// DynamoDBからメタデータ一覧を取得
app.get('/images', async (req, res) => {
  const result = await dynamo.scan({
    TableName: DYNAMO_TABLE,
  }).promise()

  res.json({ images: result.Items })
})

app.listen(3000, () => {
  console.log('サーバー起動!')
})
