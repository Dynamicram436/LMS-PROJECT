# Exam Randomization Feature

## Overview
The exam system now randomizes questions each time a user takes an exam. This ensures that every user experience is unique and prevents memorization of question order.

## Changes Made

### Backend Changes
- Modified the `getExamQuestions` function in `Backend/controllers/examController.js`
- Added Fisher-Yates shuffle algorithm to randomize the order of questions
- Added optional `numQuestions` parameter to limit the number of questions returned
- Questions are randomized server-side each time they are requested

### Frontend Changes
- Updated the Exam component to pass the `numQuestions` parameter (optional)
- The frontend continues to work as before, but now receives randomized questions

## How It Works
1. When a user starts an exam, the frontend requests questions from the backend
2. The backend fetches all questions for the specified chapter and category
3. The questions are shuffled using the Fisher-Yates algorithm
4. Optionally, a subset of questions can be returned using the `numQuestions` parameter
5. The randomized questions are sent to the frontend
6. Each subsequent request will return a different random order of questions

## Parameters
- `chapterId` (required): The ID of the chapter
- `category` (required): The category/subject of the exam
- `numQuestions` (optional): Limit the number of questions returned

## Benefits
- Each exam attempt has a different question order
- Prevents memorization of question positions
- Provides a fair and varied testing experience
- Maintains the same question pool while changing the order