# 📚 Book Review Service - NodeJS + Express

Unit 4 Task: NodeJS - Essence 3 (Review) with publication time

## Project launch

### Preparation

```bash
# 1. Installing dependencies
npm install

# 2. Starting MongoDB in docker-compose
docker-compose up -d mongodb
```

### Development

```bash
# Running the service in dev mode
npm run start:dev

# The service will be launched at http://localhost:3001
```

### Testing

```bash
# Running all tests
npm test

# Running in watch mode
npm run test:watch

# Covered tests
npm run test:cov
```

### Production

```bash
# Build
npm run build

# Launching
npm start
```

---

## 📊 API Endpoints

### 1. POST /api/review - Create a review

**Request:**
```json
{
  "bookId": "1",
  "rating": 5,
  "title": "Excellent Book",
  "content": "This is an excellent book",
  "author": "Jane Smith",
  "publishedAt": "2024-12-31T03:00:00Z"  
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "bookId": "1",
    "rating": 5,
    "title": "Excellent Book",
    "content": "This is an excellent book",
    "author": "Jane Smith",
    "publishedAt": "2024-12-31T03:00:00Z",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Review created successfully"
}
```

### 2. GET /api/review - Get reviews

**Query Parameters:**
- `bookId` (required) - ID of a book
- `from` (optional, default=0) - Offset
- `size` (optional, default=10, max=100) - Limit

**Example:**
```bash
curl "http://localhost:3001/api/review?bookId=1&from=0&size=10"
```

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "total": 5,
  "message": "Retrieved 2 reviews out of 5 total"
}
```

### 3. POST /api/review/_counts - Get number of reviews

**Request:**
```json
{
  "bookIds": ["1", "2", "3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "1": 5,
    "2": 3,
    "3": 0
  },
  "message": "Review counts retrieved successfully"
}
```

---

## 📁 Project structure

```
review-service/
├── src/
│   ├── main.ts                          # Entry point
│   ├── app.ts                           # Express app
│   ├── config/
│   │   ├── database.connection.ts
│   │   ├── mongo.setup.ts
│   │   └── useEnv.ts  
│   ├── models/
│   │   └── review.model.ts              # Mongoose schema
│   ├── dto/
│   │   ├── create-review.dto.ts
│   │   └── query-review.dto.ts
│   ├── repositories/
│   │   └── review.repository.ts
│   ├── services/
│   │   └── review.service.ts
│   ├── controllers/
│   │   └── review.controller.ts
│   ├── routes/
│   │   └── review.router.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   └── exceptions/
│       ├── ValidationException.ts
│       └── NotFoundException.ts
├── test/
│   ├── integration/
│   │   └── review.controller.test.ts
│   
│   ├── useTestEnv.ts
│   └── setup.ts
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env
```

---

## 🧪 Integration tests

The project uses **Testcontainers** to run real MongoDB during testing.

```bash
npm test
```

**Tests cover:**
- ✅ Creating a review with validation
- ✅ Automatic set publishedAt
- ✅ Custom value publishedAt
- ✅ Getting reviews with pagination
- ✅ Sort by time (newest first)
- ✅ Counting reviews through aggregation
- ✅ Error handling

---

## 🔧 Technology stack

- **Runtime:** NodeJS
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Testing:** Jest + Supertest + Testcontainers
- **Validation:** Custom DTO validators
- **HTTP Client:** Axios (for check Book Service)

---

## 📋 Key features

✅ **Many-to-One relationship** - Review (Entity 3) → Book (Entity 1)
✅ **Publication time** - publishedAt (auto-set to current time if not provided)
✅ **Validation** - All input data
✅ **Checking the existence** - Of a book through Book Service
✅ **Оптимізація** - Aggregation pipeline для counts
✅ **Sorting** - By publication time DESC (newest first)
✅ **Pagination** - from/size (max 100 items)
✅ **Production-ready** - Error handling, logging, tests

---

## 🐳 Docker

### Starting MongoDB

```bash
docker-compose up -d mongodb
```

### Stop

```bash
docker-compose down
```

---

## 📝 Query examples

### Curl

```bash
# Create a review
curl -X POST http://localhost:3001/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "1",
    "rating": 5,
    "title": "Great Book",
    "content": "Excellent content",
    "author": "John Doe"
  }'

# Get reviews
curl "http://localhost:3001/api/review?bookId=1&from=0&size=10"

# Get quantity
curl -X POST http://localhost:3001/api/review/_counts \
  -H "Content-Type: application/json" \
  -d '{"bookIds": ["1", "2", "3"]}'
```

---

## 🤝 Frontend integration

### Example React component

```typescript
// Get reviews for the book
const getReviews = async (bookId: string) => {
  const res = await fetch(
    `http://localhost:3001/api/review?bookId=${bookId}&from=0&size=5`
  );
  return res.json();
};

// Add a review
const addReview = async (review: CreateReviewDto) => {
  const res = await fetch('http://localhost:3001/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  return res.json();
};

// Get number of reviews
const getReviewCounts = async (bookIds: string[]) => {
  const res = await fetch('http://localhost:3001/api/review/_counts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookIds: bookIds }),
  });
  return res.json();
};
```

---

## 🐛 Debugging

```bash
# Debug mode
node --inspect-brk dist/src/main.js

# Log to file
npm run start:dev > app.log 2>&1

# Watch mode for tests
npm run test:watch
```
---

**Created with ❤️ for Block 4 Task - NodeJS**
