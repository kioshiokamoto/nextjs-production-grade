import { Db, MongoClient } from 'mongodb'

/**
 * We have to cache the DB connection
 * when used in a serverless environment otherwise
 * we may encounter performance loss due to
 * time to connect. Also, depending on your DB,
 * you might night be able to have many concurrent
 * DB connections. Most traditional DBs were not made for a stateless
 * environment like serverless. A serverless DB (HTTP based DB) whould work
 * better.
 */
global.mongo = global.mongo || {}

export const connectToDB = async () => {
  if (!global.mongo) {
    const client = new MongoClient(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
    })

    console.log('connecting to DB')
    await global.mongo.client.connect()
    console.log('connected to DB')

    global.mongo.client = client
  }

  const db = global.mongo.client.db('known')

  return { db, dbClient: global.mongo.client }
}
