# Gossipy - MERN Stack Chat Application

Gossipy is a real-time chat application built using the MERN (MongoDB, Express, React, Node.js) stack. It allows users to chat with each other in real-time.

## Prerequisites

Before running this application, make sure you have the following installed on your machine:

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB (Make sure MongoDB server is up and running)

## Installation

1. Clone the repository to your local machine:

```
git clone https://github.com/sheth-jay/Gossipy-chat-app.git
```

2. Navigate to the project root directory:

```
cd gossipy
```

3. Create a new `.env` file in the root directory:

```
touch .env
```

4. Open the `.env` file and add the following variables:

```plaintext
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_random_string>
```

Replace `<your_mongodb_connection_string>` with the MongoDB connection string, and `<your_random_string>` with any random string of your choice.

## Backend Setup

1. Navigate to the root directory:

```
cd gossipy
```

2. Install backend dependencies:

```
npm install
```

3. Start the backend server:

```
npm start
```

The backend server will start running on `http://localhost:5000`.

## Frontend Setup

1. Navigate to the frontend directory:

```
cd gossipy/frontend
```

2. Install frontend dependencies:

```
npm install
```

3. Start the frontend development server:

```
npm start
```

The frontend development server will start running on `http://localhost:3000`, and your default web browser should open automatically.

## Usage

Once the backend and frontend servers are running, you can access the Gossipy chat application in your web browser at `http://localhost:3000`. Users can register or log in to start chatting with each other in real-time.
