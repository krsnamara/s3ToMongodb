import express from 'express'
import multer from 'multer'
// import sharp from 'sharp'
// import crypto from 'crypto'

import { PrismaClient } from '@prisma/client'

import { S3Client } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';

dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client ({
  credentials: {
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
}); 

const app = express()
const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  res.send(posts)
})


app.post('/api/posts', upload.single('image'), async (req, res) => {
  console.log("req.body", req.body)
  console.log("req.file", req.file)
  req.file.buffer
  res.send({})
})

app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id
  res.send({})
})

app.listen(8080, () => console.log("listening on port 8080"))