import React from "react";

import { generateDisplayTimestamp } from "../lib/posts";

import PostTitle from "../components/post-title/post-title.component";

const TITLE = "Seeding Prisma Databases in Next.js";
const TIMESTAMP = "20240212";
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: "https://dylants-blog.s3.amazonaws.com/public/images/20240212/seed.jpg",
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>While developing applications, it's useful to be able to seed the database for a few reasons: The most obvious being that you have actual data to interact with in the UI, APIs, etc. But even if you were to manually create that data, sometimes the data is tampered with or even ruined while developing features. So having a way to reliably and repeatably seed (and re-seed!) the database becomes as valuable as having good test coverage.</p>

      <h2>Prisma Seed Scripts</h2>

      <p>Prisma has recommendations on how to author seed scripts <a href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding">within their docs</a>. The seed script can then be integrated within Prisma's workflow, which will inform Prisma to run the seed script after migrations. This creates a simple workflow, but one you need to be aware of while developing that seed script.</p>

      <p>To begin, create a seed script at <code>prisma/seed.ts</code>. The contents should be:</p>

      <pre className="prettyprint">
{`// prisma/seed.ts

async function main() {

  // code to generate items...

}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

`}
      </pre>

      <p>Then, in the <code>package.json</code> file, add the following to the <code>prisma</code> section (which you may need to create):</p>

      <pre className="prettyprint">
{`// package.json

{
  ...

  "prisma": {
    "seed": "ts-node --compiler-options {\\"module\\":\\"CommonJS\\"} prisma/seed.ts"
  },

  ...
}
`}
      </pre>

      <p>With this in place, you can run the seed script by executing the following command:</p>

      <pre className="prettyprint">
{`$ prisma db seed`}
      </pre>

      <p>One thing to note: Prisma will automatically run the seed script after running initial migrations. Which can be helpful for those just getting started!</p>
      
      <h2>Resetting the Database</h2>

      <p>If you'd like to start over, Prisma also provides the ability to reset the database. This will delete all data and remove the tables, re-run the migrations, and then re-seed the database. To do so, run the following command:</p>

      <pre className="prettyprint">
{`$ prisma migrate reset`}
      </pre>


      <p>If you need to include some environment variables from <code>.env.local</code> (or somewhere else), you can add scripts to the <code>package.json</code> file to easily run these commands:</p>

      <pre className="prettyprint">
{`// package.json

{
  ...

  "scripts": {
    ...

    "db:seed": "dotenv -e .env.local -- prisma db seed",
    "db:reset": "dotenv -e .env.local -- prisma migrate reset",

    ...
  },

  ...
}
`}
      </pre>

      <h2>Generating Fake Data</h2>

      <p>You can choose to generate seed data in any way you see fit. But often times coming up with random names and values can be difficult. <a href="https://github.com/faker-js/faker">Faker</a> to the rescue! The API provides many commands to easily generate most anything: <a href="https://next.fakerjs.dev/api/">https://next.fakerjs.dev/api/</a>.</p>

      <p>Images can also be cumbersome to generate. Fortunately, placeholder sites exist to provide fake images. Picsum photos is still around (RIP fillmurray) to supply images at various sizes: <a href="https://picsum.photos/">https://picsum.photos/</a>.</p>

      <p>Combining these tools gives you the ability to write:</p>

      <pre className="prettyprint">
{`// prisma/seed.ts

...

await prisma.foo.create({
  data: {
    name: faker.company.name(),
    date: faker.date.past(),
    imageUrl: 'https://picsum.photos/200/300',
  },
});

...
`}
      </pre>

    </section>
  );
}

