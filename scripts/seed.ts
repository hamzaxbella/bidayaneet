import { database } from "../lib/server/database";
import { seedDemo } from "../lib/server/seed";
if (!process.env.DEMO_PASSWORD)
  throw new Error("Set DEMO_PASSWORD before running seed.");
seedDemo(process.env.DEMO_PASSWORD)
  .then(async () => {
    await (await database()).close();
    console.log(
      "Created 4 demo accounts, 30 fictional young people, 12 activities and 10 offers. Emails: <role>@bidayaneet.demo.",
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
