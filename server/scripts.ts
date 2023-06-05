import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.posts.create({
    data: {
      imageName: "test",
      caption: "test",
    },
  });
  console.log(post);
}
main();
