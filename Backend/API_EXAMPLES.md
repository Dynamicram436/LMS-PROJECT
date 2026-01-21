# Exam Questions API - Updated Schema Examples

## New Database Schema

### ExamQuestion Collection
```javascript
{
  category: "English",
  course: "CE",
  video: "V1",
  questions: [
    {
      qType: "MCQ",           // Question type: MCQ, TrueFalse, ShortAnswer
      qId: "Q1",              // Question ID
      qDesc: "What is the synonym of 'Happy'?",  // Question description
      choices: ["Joyful", "Sad", "Angry", "Tired"],  // Answer choices
      correctAns: "Joyful"    // Correct answer (string value from choices)
    }
  ]
}
```

## API Endpoints

### 1. Create Exam Questions
**Endpoint:** `POST /api/exam/create`

**Request Body:**
```json
{
  "category": "English",
  "course": "CE",
  "video": "V1",
  "questions": [
    {
      "qType": "MCQ",
      "qId": "Q1",
      "qDesc": "What is the synonym of 'Happy'?",
      "choices": ["Joyful", "Sad", "Angry", "Tired"],
      "correctAns": "Joyful"
    },
    {
      "qType": "MCQ",
      "qId": "Q2",
      "qDesc": "What is the opposite of 'Hot'?",
      "choices": ["Cold", "Warm", "Cool", "Freezing"],
      "correctAns": "Cold"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exam questions created successfully",
  "data": {
    "_id": "64a5b2c1d8e9f0g1h2i3j4k5",
    "category": "English",
    "course": "CE",
    "video": "V1",
    "questions": [
      {
        "qType": "MCQ",
        "qId": "Q1",
        "qDesc": "What is the synonym of 'Happy'?",
        "choices": ["Joyful", "Sad", "Angry", "Tired"],
        "correctAns": "Joyful"
      }
    ],
    "createdAt": "2024-01-21T10:30:00.000Z",
    "updatedAt": "2024-01-21T10:30:00.000Z"
  }
}
```

### 2. Get Exam Questions
**Endpoint:** `GET /api/exam/questions`

**Query Parameters:**
- `category` (required): English, Telugu, Hindi, Mathematics, Science, Social Studies
- `course` (required): Course code (e.g., CE, ECE)
- `video` (required): Video ID (e.g., V1, V2)
- `numQuestions` (optional): Number of questions to return
- `attemptId` (optional): Specific attempt ID

**Example Request:**
```
GET /api/exam/questions?category=English&course=CE&video=V1&numQuestions=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "English",
    "course": "CE",
    "video": "V1",
    "questions": [
      {
        "qType": "MCQ",
        "qId": "Q1",
        "qDesc": "What is the synonym of 'Happy'?",
        "choices": ["Joyful", "Sad", "Angry", "Tired"],
        "correctAns": "Joyful"
      }
    ],
    "attemptId": null
  }
}
```

### 3. Update Exam Questions
**Endpoint:** `POST /api/exam/create` (same endpoint handles updates)

If category + course + video combination exists, it will update the questions.

**Request Body:**
```json
{
  "category": "English",
  "course": "CE",
  "video": "V1",
  "questions": [
    {
      "qType": "MCQ",
      "qId": "Q1",
      "qDesc": "Updated question?",
      "choices": ["Option1", "Option2", "Option3", "Option4"],
      "correctAns": "Option1"
    }
  ]
}
```

## Comparison: Old vs New Schema

### Old Schema
```javascript
{
  category: "English",
  chapterId: 1,
  chapterName: "Chapter 1",
  questions: [
    {
      question: "What is the synonym of 'Happy'?",
      options: ["Joyful", "Sad", "Angry", "Tired"],
      correctAnswer: 0  // Index number
    }
  ]
}
```

### New Schema
```javascript
{
  category: "English",
  course: "CE",
  video: "V1",
  questions: [
    {
      qType: "MCQ",
      qId: "Q1",
      qDesc: "What is the synonym of 'Happy'?",
      choices: ["Joyful", "Sad", "Angry", "Tired"],
      correctAns: "Joyful"  // String value
    }
  ]
}
```

## Key Changes
1. Replaced `chapterId` and `chapterName` with `course` and `video`
2. Renamed `question` to `qDesc` and `options` to `choices`
3. Added `qType` (MCQ, TrueFalse, ShortAnswer) and `qId` fields
4. Changed `correctAnswer` from index number to string value (actual choice)
5. Updated database index from `{category, chapterId}` to `{category, course, video}`

## Migration Steps
1. Run migration script: `node Backend/migrations/migrateQuestionSchema.js`
2. Or seed new data: `node Backend/seedDataNew.js`
3. Update frontend API calls to use new parameters (category, course, video)
