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
- Image upload support (JPEG, PNG, JPG, WebP)
- Cloud-based storage with Cloudinary CDN
- PDF document upload for house rules
- Responsive UI with Tailwind CSS
- Session management across pages
- Automatic image optimization

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Embedded JavaScript templating
- **Tailwind CSS** - Utility-first CSS framework

### Cloud Services
- **Cloudinary** - Cloud-based image and file storage with CDN delivery
- **MongoDB Atlas** - Cloud-hosted MongoDB database

### Libraries & Middleware
- **bcryptjs** - Password hashing and security
- **express-session** - Session management
- **connect-mongodb-session** - MongoDB session store
- **multer** - File upload handling
- **multer-storage-cloudinary** - Cloudinary storage adapter for Multer
- **express-validator** - Server-side validation
- **dotenv** - Environment variable management
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

### Step 3: Set Up Cloudinary (Cloud Storage for Images)

**IMPORTANT**: This step is **required** for deployment on Vercel or any serverless platform.

1. **Create a Free Cloudinary Account**:
   - Go to [cloudinary.com](https://cloudinary.com/) and sign up for a free account
   - After signing up, you'll be taken to your dashboard

2. **Get Your Cloudinary Credentials**:
   - On the dashboard, you'll see:
     - Cloud Name
     - API Key
     - API Secret
   - Keep these handy for the next step

### Step 4: Configure Environment Variables

1. **Create a `.env` file** in the project root:

```bash
cp .env.example .env
```

2. **Edit the `.env` file** and add your credentials:

```env
# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string-here

# Server Configuration
PORT=3000

# Session Secret (use a strong random string)
SESSION_SECRET=your-secret-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. **Get MongoDB Connection String**:
   - Create a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user with password
   - Get your connection string and replace `your-mongodb-connection-string-here`

4. **Important**: Never commit the `.env` file to Git (it's already in `.gitignore`)

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
- photo (String - Cloudinary URL)
- photoPublicId (String - Cloudinary public ID for deletion)
- description (String)
- rulesUrl (String - Cloudinary URL for house rules PDF)
- rulesPublicId (String - Cloudinary public ID for PDF deletion)

#### 3. Sessions Collection
Automatically managed by `connect-mongodb-session` for user session storage.

## 🔐 Environment Variables

The application uses environment variables for configuration. A `.env.example` file is provided as a template.

**Required Environment Variables**:

```env
# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string

# Server Configuration
PORT=3000

# Session Secret
SESSION_SECRET=your-secret-key

# Cloudinary Configuration (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**For Vercel Deployment**: Add these environment variables in your Vercel project settings under "Environment Variables".

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

- The application runs on **port 3000** by default (configurable via PORT environment variable)
- File uploads are handled by **Cloudinary** (cloud storage):
  - Images: JPEG, PNG, JPG, WebP formats (auto-optimized to max 1000x1000)
  - House rules: PDF format only
- Sessions are stored in MongoDB for persistence
- All host routes require authentication
- Passwords are encrypted using bcryptjs before storage
- Images and PDFs are automatically deleted from Cloudinary when properties are deleted or updated
- All files are served via Cloudinary CDN for fast global delivery

## 🚀 Deploying to Vercel

This application is ready for deployment on Vercel with Cloudinary for file storage.

### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- MongoDB Atlas database
- Cloudinary account

### Deployment Steps

1. **Push your code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Import Project to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings

3. **Add Environment Variables** in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `MONGODB_URI`
     - `SESSION_SECRET`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

5. **Verify**:
   - Visit your deployed URL
   - Test image uploads to ensure Cloudinary is working

### Why Cloudinary?

Vercel uses **serverless functions** which have:
- **Ephemeral filesystem**: Files are deleted after each request
- **Read-only environment**: Cannot write to local disk in production
- **Stateless architecture**: Each request may be handled by a different server instance

**Cloudinary solves this by**:
- Storing files permanently in the cloud
- Providing CDN delivery for fast global access
- Automatic image optimization
- Easy file management and deletion

### Troubleshooting Deployment

If images are broken after deployment:
1. ✅ Verify Cloudinary credentials in Vercel environment variables
2. ✅ Check that all environment variables are set (all 5 required)
3. ✅ Ensure MongoDB is accessible from Vercel (check IP whitelist in MongoDB Atlas)
4. ✅ Check Vercel deployment logs for errors
5. ✅ Test image upload on deployed site to verify Cloudinary is working
6. ✅ Check Cloudinary dashboard to see if files are being uploaded

### Verifying Successful Deployment

After deployment, verify everything works:
1. **Visit your deployed site** on Vercel
2. **Sign up/Login as a host**
3. **Add a property** with an image (JPEG, PNG, JPG, or WebP)
4. **Check that the image displays** correctly
5. **Visit Cloudinary dashboard** - you should see the uploaded file in the `airbnb/properties` folder
6. **Test editing/deleting** properties to ensure old images are removed from Cloudinary

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

ISC

---

**Happy Hosting! 🏠**
