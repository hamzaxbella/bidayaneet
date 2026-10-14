import { database } from "../lib/server/database";
async function migrate() {
  const db = await database();
  try {
    const counts = await db.query(
      "SELECT (SELECT count(*) FROM young_people) AS dossiers,(SELECT count(*) FROM offers) AS offers,(SELECT count(*) FROM activities) AS activities,(SELECT count(*) FROM journey_events) AS milestones",
    );
    console.log(
      "Additive schema available; stored record counts:",
      JSON.stringify(counts[0]),
    );
  } finally {
    await db.close();
  }
}
migrate().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
