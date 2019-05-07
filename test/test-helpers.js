const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const testHelpers = {
  createUsers() {
    return [
      {
        id: 1,
        user_name: "admin",
        title: "mentor",
        full_name: "Dunder Mifflin Admin",
        password: "Password123$"
      },
      {
        id: 2,
        user_name: "Jon",
        title: "student",
        full_name: "Jon Foo",
        password: "Somepassword123$"
      },
      {
        id: 3,
        user_name: "Fred",
        title: "student",
        full_name: "Fred Bar",
        password: "Thispassword123$"
      },
      {
        id: 4,
        user_name: "Bob",
        title: "student",
        full_name: "Bob Burger",
        password: "Mypassword123$"
      }
    ];
  },

  createQueue() {
    return [
      {
        id: 1,
        description: "test desc 1",
        user_name: "Fred",
        mentor_user_name: "admin",
        dequeue: true,
        completed: true,
        slack_user_id: "UJ3CMD8UV",
        slack_handle: null,
        next: null
      },
      {
        id: 2,
        description: "test desc 2",
        user_name: "Jon",
        mentor_user_name: "admin",
        dequeue: true,
        completed: false,
        slack_user_id: null,
        slack_handle: null,
        next: null
      },
      {
        id: 3,
        description: "test desc 3",
        user_name: "Fred",
        mentor_user_name: null,
        dequeue: true,
        completed: false,
        slack_user_id: "UJ3CMD8UV",
        slack_handle: null,
        next: 4
      },
      {
        id: 4,
        description: "test desc 3",
        user_name: "Bob",
        mentor_user_name: "admin",
        dequeue: true,
        completed: true,
        slack_user_id: "UJ3CMD8UV",
        slack_handle: null,
        next: null
      }
    ];
  },

  createPointers() {
    return {
      id: 1,
      head: 3,
      tail: 4
    };
  },

  createFixtures() {
    const testUsers = this.createUsers();
    const testPosts = this.createQueue();
    const testPointers = this.createPointers();
    return { testUsers, testPosts, testPointers };
  },

  cleanTables(db) {
    return db.transaction(trx =>
      Promise.all([
        trx.raw(`DROP TABLE IF EXISTS "pointers";`),
        trx.raw(`DROP TABLE IF EXISTS "queue";`),
        trx.raw(`DROP TABLE IF EXISTS "user";`)
      ])
      
    );
  },

  createTables(db) {
    return db.transaction(
      async trx => (
      await trx.raw(`
      CREATE TABLE "user" (
        "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
        "user_name" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "full_name" TEXT NOT NULL,
        "password" TEXT NOT NULL
      );`),
      await trx.raw(`
      CREATE TABLE "queue" (
        "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
        "description" TEXT NOT NULL,
        "user_name" TEXT REFERENCES "user"(user_name)
          ON DELETE CASCADE,
        "mentor_user_name" TEXT REFERENCES "user"(user_name)
          ON DELETE CASCADE DEFAULT NULL, 
        "dequeue" BOOLEAN NOT NULL DEFAULT FALSE,
        "completed" BOOLEAN NOT NULL DEFAULT FALSE,
        "slack_user_id" TEXT,
        "slack_handle"  TEXT,
        "next" INTEGER REFERENCES "queue"(id)
          ON DELETE SET NULL
      );`),
      await trx.raw(`
        CREATE TABLE "pointers" (
          "id" SERIAL PRIMARY KEY,
          "head" INTEGER REFERENCES "queue"(id)
            ON DELETE SET NULL,
          "tail" INTEGER REFERENCES "queue"(id)
            ON DELETE SET NULL
        );`)
      )
    );
  },

  seedUser(db, user) {
    const userArr = user.map(u => ({
      ...u,
      password: bcrypt.hashSync(u.password, 1)
    }));
    return db
      .into('user')
      .insert(userArr)
  },

  seedPointers(db, queue, pointers) {
    return db.transaction(async trx => {
      await this.seedQueue(trx, queue);
      await trx.into('pointers').insert(pointers)
      
    })
  },

  seedQueue(db, queue, user) {
    return db.transaction(async trx => {
      await this.seedUser(trx, user);
      await trx.into("queue").insert(queue);
     
    })
  },

  makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const authToken = jwt.sign({ id: user.id, title: user.title }, secret, {
      subject: user.user_name,
      algorithm: "HS256"
    });
    return `Bearer ${authToken}`;
  }
};

module.exports = testHelpers;