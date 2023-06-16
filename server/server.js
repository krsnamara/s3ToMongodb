import express from "express";
import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";

import { PrismaClient } from "@prisma/client";
import {
  S3Client,
  PutObjectCommand,
  // GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

import dotenv from "dotenv";

dotenv.config();

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const app = express();
const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Get all posts

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.posts.findMany({ orderBy: { id: "desc" } });

  for (const post of posts) {
    post.imageUrl = getSignedUrl({
      url: "https://d43rby6106out.cloudfront.net/" + post.imageName,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });
    console.log(process.env.CLOUDFRONT_KEY_PAIR_ID);
  }

  res.send(posts);
});

// Post a new post

app.post("/api/posts", upload.single("image"), async (req, res) => {
  // console.log("req.body", req.body);
  // console.log("req.file", req.file);

  const buffer = await sharp(req.file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer();

  const imageName = randomImageName();
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const post = await prisma.posts.create({
    data: {
      caption: req.body.caption,
      imageName: imageName,
    },
  });

  res.send(post);
});

// delete a post

app.delete("/api/posts/:id", async (req, res) => {
  const id = req.params.id.toString();

  const post = await prisma.posts.findUnique({ where: { id } });
  if (!post) {
    res.status(404).send({ message: "Post not found" });
    return;
  }

  const params = {
    Bucket: bucketName,
    Key: post.imageName,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);

  await prisma.posts.delete({ where: { id } });

  res.send(post);
});

app.listen(8080, () => console.log("listening on port 8080"));
