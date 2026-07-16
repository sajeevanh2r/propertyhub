const pg = require('pg')
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5442/propertyhub?schema=public"
const client = new pg.Client({ connectionString })

async function main() {
  console.log("Connecting to database at localhost:5442...")
  await client.connect()
  console.log("Connected. Enabling pgvector extension...")
  await client.query("CREATE EXTENSION IF NOT EXISTS vector;")
  console.log("pgvector extension enabled successfully!")
  await client.end()
}

main().catch(err => {
  console.error("Failed to enable pgvector extension:", err)
  process.exit(1)
})
