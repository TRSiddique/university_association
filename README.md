🌐 CUSAP - Chittagong University Students Association of Pekua

https://public/logo.png

A comprehensive web application for managing the Chittagong University Students Association of Pekua (CUSAP).
This platform supports member management, event organization, news publishing, and community engagement for students from Pekua studying at the University of Chittagong.

🚀 Features
Core Functionality

Member Management – Complete CRUD operations for member profiles

Committee Management – Executive committee information & profiles

News & Announcements – Publish and manage association news

Event Management – Upcoming events and event calendar

Gallery – Photo gallery with admin upload option

Resource Center – Documents, PDFs, and publications

Feedback System – Collect suggestions and comments from members

User Roles

Public Users – Browse members, events, gallery, news

Members – Submit feedback, join association

Admin – Full access to all functionalities

🛠 Tech Stack
Frontend

React 18 (Hooks-based architecture)

React Router DOM

Tailwind CSS

Lucide React Icons

SweetAlert2

Backend

Node.js

Express.js

MongoDB

Mongoose ORM

Deployment

Netlify – Frontend

Vercel / Railway – Backend

📁 Project Structure
cusap-client/
├── public/
│   ├── documents/       # PDF resources
│   ├── images/          # Image assets
│   └── logo.png         # Association logo
├── src/
│   ├── components/
│   │   ├── Members.jsx
│   │   ├── AddMember.jsx
│   │   ├── UpdatedMember.jsx
│   │   ├── MemberDetails.jsx
│   │   ├── AdminLogin.jsx
│   │   └── Form components/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Navbar.jsx
│   ├── News/
│   ├── Gallery/
│   ├── Committee/
│   ├── Footer/
│   └── Layout/
└── Configuration files

🎯 Key Components
Member Management

Members.jsx – Member listing & filtering

AddMember.jsx – Registration form

UpdatedMember.jsx – Edit existing profiles

MemberDetails.jsx – View profile details

Authentication & Admin

AuthContext.jsx – Global auth state

AdminLogin.jsx – Secure login

AdminFormsDashboard.jsx – Manage forms

Dynamic Forms System

FormBuilder.jsx – Create custom forms

PublicForm.jsx – User form submission

ResponseViewer.jsx – View responses

🚀 Getting Started
Prerequisites

Node.js v16+

MongoDB database

Git

🔧 Installation
1. Clone the repository
git clone https://github.com/tr_siddique/cusap-client.git
cd cusap-client

2. Install frontend dependencies
npm install

3. Environment Setup

Create .env file:

VITE_API_BASE_URL=http://localhost:4000
VITE_ADMIN_USERNAME=your-admin-username
VITE_ADMIN_PASSWORD=your-admin-password

4. Start Frontend
npm run dev

5. Start Backend
cd ../cusap-server
npm install
npm start




🔐 Authentication
Admin Access

Username & password based login


Protected admin routes


Role-based access



🚀 Deployment
Frontend (Netlify)

Build: npm run build

Deploy via Git

Add environment variables

Backend (Vercel/Railway)

Deploy Express server

Set MongoDB credentials

Update CORS policy

🤝 Contributing

Fork the repository

Create a branch

git checkout -b feature/amazing-feature


Commit changes

Push

Open Pull Request

📝 Code Standards
JavaScript/React

Functional components

Hooks

Error handling

Clean naming conventions

Styling

Tailwind-first

Responsive design

Consistent spacing

🐛 Troubleshooting
Common Issues

CORS errors → Fix backend CORS config

MongoDB issues → Check connection string

Build failed → Check missing dependencies

Env issues → Ensure variables are set

Debugging Tips

Use React DevTools

Check console logs

Validate API endpoints

📞 Support

Open GitHub issue

Contact development team

View documentation inside /public/documents

📄 License

This project is licensed under MIT License.

🙏 Acknowledgments


CUSAP Executive Committee

All contributing developers

Built with ❤️ for the CUSAP Community