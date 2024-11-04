# MongoDB Methods Reference

## Query Methods

| Method | Description | Example |
|--------|-------------|---------|
| `find({})` | Returns all documents | `db.users.find({})` |
| `find({ field: value })` | Returns documents matching criteria | `db.users.find({ age: 25 })` |
| `findOne()` | Returns first matching document | `db.users.findOne({ email: "user@example.com" })` |
| `find().limit(n)` | Limits results to n documents | `db.users.find().limit(10)` |
| `find().skip(n)` | Skips first n results | `db.users.find().skip(10)` |
| `find().sort({ field: 1 })` | Sorts results (1 ascending, -1 descending) | `db.users.find().sort({ age: -1 })` |
| `countDocuments()` | Counts matching documents | `db.users.countDocuments({ active: true })` |

## Insert Methods

| Method | Description | Example |
|--------|-------------|---------|
| `insertOne()` | Inserts single document | `db.users.insertOne({ name: "John" })` |
| `insertMany()` | Inserts multiple documents | `db.users.insertMany([{ name: "John" }, { name: "Jane" }])` |

## Update Methods

| Method | Description | Example |
|--------|-------------|---------|
| `updateOne()` | Updates first matching document | `db.users.updateOne({ _id: id }, { $set: { name: "John" } })` |
| `updateMany()` | Updates all matching documents | `db.users.updateMany({ age: 25 }, { $set: { adult: true } })` |
| `replaceOne()` | Replaces entire document | `db.users.replaceOne({ _id: id }, newDocument)` |

## Delete Methods

| Method | Description | Example |
|--------|-------------|---------|
| `deleteOne()` | Deletes first matching document | `db.users.deleteOne({ _id: id })` |
| `deleteMany()` | Deletes all matching documents | `db.users.deleteMany({ status: "inactive" })` |

## Common Update Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$set` | Sets field value | `{ $set: { field: value } }` |
| `$inc` | Increments field value | `{ $inc: { count: 1 } }` |
| `$push` | Adds element to array | `{ $push: { tags: "new-tag" } }` |
| `$pull` | Removes element from array | `{ $pull: { tags: "old-tag" } }` |
| `$unset` | Removes field | `{ $unset: { field: "" } }` |

## Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equals | `{ field: { $eq: value } }` |
| `$ne` | Not equals | `{ field: { $ne: value } }` |
| `$gt` | Greater than | `{ field: { $gt: value } }` |
| `$lt` | Less than | `{ field: { $lt: value } }` |
| `$gte` | Greater than or equal | `{ field: { $gte: value } }` |
| `$lte` | Less than or equal | `{ field: { $lte: value } }` |
| `$in` | In array | `{ field: { $in: [value1, value2] } }` |
| `$nin` | Not in array | `{ field: { $nin: [value1, value2] } }` |

## Aggregation Methods

| Method | Description | Example |
|--------|-------------|---------|
| `aggregate()` | Performs aggregation operations | `db.users.aggregate([{ $group: { _id: "$status" } }])` |
| `distinct()` | Returns unique values | `db.users.distinct("status")` |

## Index Methods

| Method | Description | Example |
|--------|-------------|---------|
| `createIndex()` | Creates new index | `db.users.createIndex({ email: 1 })` |
| `dropIndex()` | Removes index | `db.users.dropIndex("email_1")` |
| `getIndexes()` | Lists all indexes | `db.users.getIndexes()` |