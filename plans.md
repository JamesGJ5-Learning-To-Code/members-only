# Suggestions from TOP

1. DONE First think of database models necessary

2. CONSIDERED Users will have a:
    1. Full-name (forename and last name)
        - Maybe employ a getter here, maybe look back to a previous lesson where this is mentioned in relation to MongoDB/Mongoose. For example, might want to store forename and last name in two separate fields but be able to access them via the full-name as a whole.
    2. Username (doesn't have to just be email)
    3. Password
    4. User status, which can either be:
        - "basic", cannot see authorship details
        - "member", can see authorship details
        - "admin", can see authorship details and delete messages

3. CONSIDERED All users should be able to create messages.

4. CONSIDERED Messages have a:
    1. Title
    2. Timestamp
        - See https://mongoosejs.com/docs/timestamps.html, particularly for 'createdAt' rather than 'updatedAt' (since probably won't be giving users the option to update messages in the first iteration of this project)
    3. Some text
    4. Record of who created each message (probably via reference by ID to the MongoDB document of the user in question, giving access to their full-name, for example)

5. DONE Set up database on Mongo

6. DONE Generate project skeleton
    - DONE Initialise express app
    - DONE Connect to database in app.js, importing connection string from a secure configuration

7. DONE Write models designed earlier

8. Write controllers:
    1. DONE Index controller
    2. DONE User controllers
    3. DONE Message controllers

9. DONE Write skeleton for authentication and routes

10. Start with a user sign-up form:
    1. Sanitize and validate form fields
    2. Secure passwords with bcrypt (bcrypt.hash in the context of sign-up)
        - Just install bcryptjs
    3. Add a confirmPassword field to sign-up form and validate it with a custom validator (https://express-validator.github.io/docs/validation-chain-api/)
    4. An "is admin" checkbox (acceptable for now)
    5. Don't create a new user if one with the given username already exists (i.e. search for an existing user in the database first)

11. Create a login-form using passport.js (might want to do this before the passcode-entering-page step so that said step may be tested, not entirely sure though)

12. Add a page for users to join the club by (while logged in, of course) entering a secret passcode.
    - Submission might make a POST request to either make the user's userStatus "member" in the database (make sure to retain the user's ObjectID) if the passcode is correct and the user is not an admin or not logged in, or re-render the view the same way but with the addition of a message stating passcode incorrectness/the user already being an admin/the user not being logged in

13. A logged-in user should have a link to "Create a new message", taking them to a new-message form view

14. Display all messages on the home page for all to see, but showing the author and date of the authorship to other members/admins only (e.g. populate these fields for user docs referred to by message docs for members/admins but not for non-members/non-admins)

15. Those who are admin can (in addition to member perks):
    1. See the delete-button (alongside each message, maybe--would make a POST request, I guess)
    2. Delete messages (via the delete-button)
