# Express.js Interview Test Backend

This is an Express.js backend for handling user authentication and notes management. It includes features such as sign-up, sign-in, user profile, and CRUD operations for notes.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) for the database

## Installation

1. Clone the repository:

    ```bash
    git clone git@github.com:azhan3211/interview-test-fe.git
    cd interview-test-fe
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory to store environment variables:

    ```bash
    touch .env
    ```

    Add the following content to your `.env` file:

    ```bash
    VITE_SERVER_URL=http://localhost:3000

    ```

4. Run the migrations (if necessary) to set up your database.

## Running the Application

To start the development server, run:

```bash
npm run dev
