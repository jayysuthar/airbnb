# Airbnb Clone

A full-stack web application that replicates core Airbnb functionalities, allowing users to browse property listings, manage favorites, and hosts to manage their properties.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Routes](#api-routes)

## 🎯 About the Project

This is an Airbnb clone built with Node.js and Express.js that demonstrates a complete MVC (Model-View-Controller) architecture. The application supports two types of users:

- **Guests**: Can browse properties, view details, add homes to favorites, and manage bookings
- **Hosts**: Can list new properties, upload photos and house rules, edit existing listings, and manage their property portfolio

## ✨ Features

### User Authentication
- User registration and login system
- Password encryption using bcryptjs
- Session-based authentication with MongoDB session store
- Role-based access control (Guest/Host)

### Guest Features
- Browse all available properties
- View detailed information about each property
- Add/remove properties from favorites
- View favorite properties list
- Access house rules for properties
- Manage bookings

### Host Features
- Add new property listings with photos
- Upload house rules as PDF documents
- Edit existing property details
- Delete property listings
- View all hosted properties

### Additional Features
- Image upload support (JPEG, PNG, JPG)
- PDF document upload for house rules
- Responsive UI with Tailwind CSS
- Session management across pages

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Embedded JavaScript templating
- **Tailwind CSS** - Utility-first CSS framework

### Libraries & Middleware
- **bcryptjs** - Password hashing and security
- **express-session** - Session management
- **connect-mongodb-session** - MongoDB session store
- **multer** - File upload handling
- **express-validator** - Server-side validation
- **nodemon** - Development auto-restart

## 📁 Project Structure

```
airbnb/
├── app.js                  # Main application entry point
├── package.json            # Project dependencies and scripts
├── nodemon.json           # Nodemon configuration
├── controllers/           # Controller logic
│   ├── authController.js  # Authentication handlers
│   ├── storeController.js # Store/Guest handlers
│   ├── hostController.js  # Host dashboard handlers
│   └── errors.js          # Error handling
├── models/                # Database models
│   ├── home.js           # Property/Home schema
│   └── user.js           # User schema
├── routes/                # Route definitions
│   ├── authRouter.js     # Authentication routes
│   ├── storeRouter.js    # Guest/Store routes
│   └── hostRouter.js     # Host routes
├── views/                 # EJS templates
│   └── input.css         # Tailwind input styles
├── public/                # Static assets
│   └── output.css        # Compiled Tailwind CSS
├── uploads/               # Uploaded property images
├── rules/                 # Uploaded house rules PDFs
└── utils/                 # Utility functions
```

## 📦 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (or local MongoDB installation)
- **Git** (optional, for cloning)

## 🚀 Installation & Setup

Follow these steps to set up the project on your local machine:

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd airbnb
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all the required packages listed in `package.json`:
- Express.js, Mongoose, EJS
- Tailwind CSS, bcryptjs, multer
- Session management packages
- Development tools (nodemon)

### Step 3: Create Required Directories

The application needs these directories for file uploads:

```bash
mkdir -p uploads rules
```

- `uploads/` - Stores property images
- `rules/` - Stores house rules PDF files

### Step 4: Configure Database Connection

The application is currently configured to use MongoDB Atlas. You have two options:

#### Option A: Use Existing Configuration (Testing)
The current configuration connects to a demo database. You can use it for testing purposes.

#### Option B: Use Your Own MongoDB Database (Recommended)
1. Create a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with password
4. Get your connection string
5. Update the MongoDB URL in `app.js` (lines 11-12 and 105):

```javascript
const MONGO_DB_URL = "your-mongodb-connection-string-here";
```

Replace `your-mongodb-connection-string-here` with your actual MongoDB connection string.

### Step 5: Verify Setup

Make sure all folders exist:
```bash
ls -la
```

You should see: `uploads/`, `rules/`, `node_modules/`, and all project files.

## 🏃 Running the Application

### Development Mode

Start the application in development mode with auto-restart and Tailwind CSS watch mode:

```bash
npm start
```

This command does two things:
1. Starts the Express server with nodemon (auto-restarts on code changes)
2. Watches and compiles Tailwind CSS changes

### Manual Start (Alternative)

If you want to run just the server without Tailwind watch:

```bash
node app.js
```

### Access the Application

Once the server starts, you'll see:
```
Connected to MongoDB via Mongoose
Server running on address http://localhost:3000
```

Open your browser and navigate to:
```
http://localhost:3000
```

## 💾 Database

### Database Type
- **MongoDB** (NoSQL Document Database)

### Database Host
- **MongoDB Atlas** (Cloud-hosted MongoDB service)

### Collections

The application uses two main collections:

#### 1. Users Collection
Stores user authentication and profile information:
- firstName (String, required)
- lastName (String)
- email (String, required, unique)
- password (String, required, hashed)
- userType (String: "guest" or "host")
- favourites (Array of Home references)

#### 2. Homes Collection
Stores property listing information:
- houseName (String, required)
- price (Number, required)
- location (String, required)
- rating (Number, required)
- photo (String - file path)
- description (String)

#### 3. Sessions Collection
Automatically managed by `connect-mongodb-session` for user session storage.

## 🔐 Environment Variables

Currently, the MongoDB connection URL is hardcoded in `app.js`. For production use, consider:

1. Creating a `.env` file:
```env
MONGODB_URI=your-mongodb-connection-string
PORT=3000
SESSION_SECRET=your-secret-key
```

2. Installing dotenv:
```bash
npm install dotenv
```

3. Update `app.js` to use environment variables:
```javascript
require('dotenv').config();
const MONGO_DB_URL = process.env.MONGODB_URI;
```

## 📖 Usage

### For Guests

1. **Sign Up**: Create an account by clicking "Sign Up"
   - Provide first name, last name, email, and password
   - Select "Guest" as user type

2. **Browse Properties**: Navigate to the homes page to view all listings

3. **View Details**: Click on any property to see detailed information

4. **Add to Favorites**: Click the favorite button to save properties

5. **View House Rules**: Check the house rules PDF for any property

### For Hosts

1. **Sign Up as Host**: Create an account with user type "Host"

2. **Add Property**:
   - Navigate to "Add Home"
   - Fill in property details (name, price, location, rating, description)
   - Upload property photo (JPEG/PNG/JPG)
   - Upload house rules PDF (optional)

3. **Manage Listings**:
   - View all your properties in "Host Home List"
   - Edit property details
   - Delete properties

## 🛣 API Routes

### Authentication Routes
```
GET  /login          - Display login page
POST /login          - Process login
GET  /signup         - Display signup page
POST /signup         - Process registration
POST /logout         - Logout user
```

### Guest/Store Routes
```
GET  /                           - Home page
GET  /homes                      - View all properties
GET  /homes/:homeId              - View property details
GET  /favourites                 - View favorite properties
POST /favourites                 - Add to favorites
POST /favourites/delete/:homeId  - Remove from favorites
GET  /bookings                   - View bookings
GET  /rules/:homeId              - View house rules PDF
```

### Host Routes (Protected - Login Required)
```
GET  /host/add-home              - Display add property form
POST /host/add-home              - Create new property
GET  /host/host-home-list        - View all hosted properties
GET  /host/edit-home/:homeId     - Display edit form
POST /host/edit-home             - Update property
POST /host/delete-home/:homeId   - Delete property
```

## 📝 Notes

- The application runs on **port 3000** by default
- File uploads are limited to:
  - Images: JPEG, PNG, JPG formats
  - House rules: PDF format only
- Sessions are stored in MongoDB for persistence
- All host routes require authentication
- Passwords are encrypted using bcryptjs before storage

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

ISC

---

**Happy Hosting! 🏠**
