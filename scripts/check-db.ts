import 'dotenv/config'
import mongoose from 'mongoose'

async function checkDb() {
  const uri = process.env.MONGODB_URI
  console.log('Connecting to:', uri)
  if (!uri) {
    console.error('No MONGODB_URI found!')
    return
  }

  await mongoose.connect(uri)
  console.log('Connected successfully to MongoDB!')

  const db = mongoose.connection.db
  if (!db) {
    console.error('No DB connection object!')
    return
  }

  const collections = await db.listCollections().toArray()
  console.log('\n--- COLLECTIONS IN DATABASE ---')
  console.log(collections.map((c) => c.name))

  for (const col of collections) {
    const docs = await db.collection(col.name).find({}).toArray()
    console.log(`\nCollection: "${col.name}" (${docs.length} documents)`)
    console.log(JSON.stringify(docs, null, 2))
  }

  await mongoose.disconnect()
}

checkDb().catch(console.error)
