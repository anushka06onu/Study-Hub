# Study Hub 📚

A personal study management dashboard built to help students organize tasks, track study sessions, and monitor progress across different subjects.

## What I've Built So Far

### Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB with Mongoose
- **UI Components:** Radix UI, Framer Motion for animations
- **Charts:** Recharts for data visualization

### Features Implemented ✅
- **Authentication:** User login & registration with JWT tokens
- **Dashboard:** Main landing page with hero section and feature cards
- **Subject Management:** Add, view, and manage study subjects
- **Task System:** Create and organize tasks by subject
- **Study Timer:** Built-in timer for tracking study sessions
- **Analytics:** Charts and progress tracking (partially working)
- **Dark/Light Theme:** Toggle between themes
- **Responsive Design:** Works on mobile and desktop using Tailwind CSS
- **Navigation:** Multi-page routing with React Router

### Pages Available
- Landing page with hero section & testimonials
- Login & Register pages
- Dashboard (main study view)
- Subjects page
- Tasks page
- Calendar view
- Settings page
- Analytics/Charts
- Subject details page

## What's Still In Progress 🚧

- **AI Suggestions:** Task recommendation feature (controller created but not fully integrated)
- **Session Recording:** Study session logging and history
- **Advanced Analytics:** More detailed progress reports and insights
- **Export Functionality:** Download study data and reports
- **Notification System:** Reminders for upcoming tasks/sessions
- **Study Group Features:** Collaboration with other users (if planned)

## Project Structure

```
Study-Hub/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── context/          # Auth context
│   │   ├── charts/           # Chart components
│   │   └── utils/            # API calls
│   └── package.json
├── server/                    # Express backend
│   ├── controllers/          # Request handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth middleware
│   └── package.json
└── README.md
```

## How to Run

### Setup

1. Clone the repo
```bash
git clone https://github.com/anushka06onu/Study-Hub.git
cd Study-Hub
```

2. Install dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### Running Locally

**Backend:**
```bash
cd server
npm run dev
```
Runs on `http://localhost:3000`

**Frontend:**
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173`

## Next Steps I'm Planning

- [ ] Complete AI task suggestion feature
- [ ] Implement session recording
- [ ] Add more detailed analytics
- [ ] Improve UI animations
- [ ] Add error handling & validation
- [ ] Deploy to production (Vercel + Heroku/Railway)
- [ ] Add unit tests

## What I Learned

This project helped me understand:
- Full-stack development with MERN
- State management with React Context
- API integration with Axios
- Database modeling with MongoDB
- Authentication with JWT
- Responsive design with Tailwind CSS
- Component-based architecture

---

**Made by:** Anushka (Student)  
**Last Updated:** April 2026
