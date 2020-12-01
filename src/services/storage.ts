import { openDB, IDBPDatabase } from 'idb'

const DATABASE_NAME = 'mazi-recorder'
const STORE_NAME_QUESTIONS = 'questions'
const STORE_NAME_INTERVEIWS = 'interviews'
const DB_VERSION = 1

type QuestionSchema = {
  text: string
}

type InterviewSchema = {
  name: string
  text: string
  role: string
  image: Blob
  attachments: AttachmentSchema[]
  createdAt: number
}

type AttachmentSchema = {
  name: string
  text: string
  tags: string
  file: Blob
}

class Database {
  
  db : IDBPDatabase;

  constructor(db : IDBPDatabase) {
    this.db = db
  }

  async getQuestions() : Promise<QuestionSchema[]> {
    return this.db.getAll(STORE_NAME_QUESTIONS)
  }

  async getInterviews() : Promise<InterviewSchema[]> {
    return this.db.getAll(STORE_NAME_INTERVEIWS)
  }
}

function initDatabase(db : IDBPDatabase) {
  if (db.objectStoreNames.contains(STORE_NAME_QUESTIONS))
    db.deleteObjectStore(STORE_NAME_QUESTIONS)
  db.createObjectStore(STORE_NAME_QUESTIONS, {
    keyPath: 'id',
    autoIncrement: true,
  })

  if (db.objectStoreNames.contains(STORE_NAME_INTERVEIWS))
    db.deleteObjectStore(STORE_NAME_INTERVEIWS)
  db.createObjectStore(STORE_NAME_INTERVEIWS, {
    keyPath: 'id',
    autoIncrement: true,
  })
}

const getDatabase = async() : Promise<Database> => {
  return new Promise(async (resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject('This browser doesn\'t support IndexedDB')
      return
    }
    const db = await openDB(DATABASE_NAME, DB_VERSION, {
      upgrade: (db) => {
        initDatabase(db)
      }
    })

    resolve(new Database(db))
  })
}

export { getDatabase }