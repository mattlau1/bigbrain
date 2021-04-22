# Testing Path 2
## Intention
- The intention behind this testing path is to simulate a user who is extremely confused or a software tester who is looking for edge cases.

## Goal
- The goal of this test is to show most/all of the possible error messages that should be displayed when a user incorrectly inputs data.
- As we are testing, we are also looking to expose any flaws in our UI when these events occur
- All test cases should incur error message alerts/notifications

## What we are testing for
- Empty and invalid fields on login form
- Empty and invalid fields on registration form
- Empty game name when creating a new game
- Single answer on a multiple choice question
- Multiple answers on a single choice question

## Steps
1. Visit login page
2. Try to log in without filling out input fields
3. Move to register form
4. Try to register with missing input fields and/or non-matching passwords
5. Visit dashboard after registering successfully
6. Attempt to create new game with an empty game name
7. Create a new game successfully
8. Click on edit button for newly created game
9. Add a new question
10. Edit newly added question
11. Try to add more than 6 questions total

- note: steps 2,4,6,11 should check for the existence of an error alert after execution of step