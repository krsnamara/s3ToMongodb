# Image connection to DB

## S3 Bucket image upload with MongoDB object

---

In this repo is the codebase for a basic image upload that will take your image, resize it, give it a unique name and ship the image in bytes to AWS S3 Bucket while simultaneously sending that image name to a MongoDB collection.

The motivation for this tool was to allow a user to create an event on the <a href="https://all-access-client.vercel.app/">AccessiCity</a> site with an image to go along with the other information about said event. To have the cards display dynamically these images had to be stored somewhere that could be accessed by the server and frontend. Below you will find the kind of map I took to make this connection happen.

Some of the main challenges were deprecation of the codebase used in the tutorials I was following, limitations in the code being written in TypeScript, the tutorials using MySQL and Prisma ORM which was not my preferred database that we used in the AccessiCity app build out and a number of other challenges along the way.

---

This was the <a href="https://www.youtube.com/watch?v=NZElg91l_ms&t=919s&ab_channel=SamMeech-Ward">first tutorial</a> I found from <a href="https://www.youtube.com/@SamMeechWard">Sam Meech-Ward</a>. It put me on to the idea of the <a href="https://www.npmjs.com/package/multer">Multer</a> package and uploading to S3 Bucket. It was made in 2021 and at the time of making this readme it was 2 years old. Meech-Ward had made an <a href="https://www.youtube.com/watch?v=eQAIojcArRY&ab_channel=SamMeech-Ward">updated tutorial</a> that used TypeScript, Prisma, and MySQL. The following are the steps I took using this updated tutorial.
<br>

---

## The Packages

---

<a href="https://www.npmjs.com/package/multer">Multer</a> takes the image file and converts it into bytes and saves it in local storage. From there the S3 client takes the bytes and sends it to the bucket for storage.
<br>
<br>
Before it gets sent to storage the file name must be made unique so that it is not written over if two files happen to have the same name. To do this I used another package called <a href="https://www.npmjs.com/package/crypto">Crypto</a> which is actually now a built-in Node module. Super handy! And after the image gets its new unique name I used another package called <a href="https://www.npmjs.com/package/sharp">Sharp</a> which "convert(s) large images in common formats to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions" as said in the npm docs.
<br>

---

## The ORM and DB

---

To initialize the Prisma ORM for this Multer S3 Bucket tutorial from <a href="https://www.youtube.com/watch?v=eQAIojcArRY&ab_channel=SamMeech-Ward">Sam Meech-Ward</a> I had to explore the <a href="">Prisma</a> documentation and watched a few videos explaining what Prisma was and how to use it. This is a list of the resources for Prisma:
<br>
<a href=""></a>

- <a href="https://www.youtube.com/watch?v=rLRIB6AF2Dg&ab_channel=Fireship">100 Second Prisma tutorial from Fireship</a>
- <a href="https://www.youtube.com/watch?v=RebA5J-rlwg&ab_channel=WebDevSimplified">Longer Prisma tutorial from Web Dev Simplified</a>

- <a href="https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb-node-mongodb">Using MongoDB with Prisma</a>

- <a href="https://www.prisma.io/docs/concepts/components/prisma-schema">Prisma-Schema Reference for MongoDB</a>

<br>

---

## <a href="https://www.youtube.com/watch?v=kGVzLDrHevc&ab_channel=krsnamara">Link</a> to a demo

---

## CloudFront CDN and Signed URLS

---

To better serve the image files globally, the next step was to setup a
<a href="https://www.youtube.com/watch?v=kbI7kRWAU-w&ab_channel=SamMeech-Ward">CloudFront CDN</a> with AWS. The AWS process had be updated regarding the security features. I had to work through some of the settings with the new methods.
<br>
<br>
After setting up the CDN, to better secure the image URLs from scrappers and other crawler bots, <a href="https://www.youtube.com/watch?v=EIYrhbBk7do&ab_channel=SamMeech-Ward">this tutorial</a> teaches how to use the AWS CloudFront Signer package to attach the public key to the image file.
""
<a href="https://tanarindev.medium.com/how-to-easily-store-and-display-user-images-in-react-68962e16fe49"> Another Option</a>

---

## Next Steps

---

I will now go back to the main project and implement this tool for the event creation.
