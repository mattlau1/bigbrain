/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  // /play/{playerid}/question
  const filtered_question = question;
  delete filtered_question.correctAnswers;
  delete filtered_question.thumbnail;
  delete filtered_question.video;
  delete filtered_question.id;
  delete filtered_question.point;
  // delete filtered_question.text;
  // delete filtered_question.time_limit;
  // delete filtered_question.type;
  return filtered_question;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const filtered = question.answers.filter(answer => answer.check === true)
  const filteredArr = []
  filtered.map((questionObjects) => {
    filteredArr.push(questionObjects.id)
  })
  return filteredArr;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  console.log(question, 'AAAAAAAAAAAAAAAA')
  return [
    123,
    456,
    678,
  ]; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.time_limit;
};