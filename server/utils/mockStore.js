import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'mockData.json');

let db = {
  users: [],
  subjects: [],
  tasks: [],
  sessions: [],
  projects: []
};

const load = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      db = { ...db, ...data };
    } catch (e) {
      console.error('Failed to load mock data', e);
    }
  }
};

const save = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Failed to save mock data', e);
  }
};

load();

export const mockDb = {
  users: {
    find: (query) => {
      if (query && query.email) return db.users.find(u => u.email === query.email);
      return db.users;
    },
    findOne: (query) => db.users.find(u => u.email === query.email),
    create: (data) => {
      const newUser = { ...data, _id: Date.now().toString() };
      db.users.push(newUser);
      save();
      return newUser;
    },
    update: (id, data) => {
      const idx = db.users.findIndex(u => u._id === id);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...data };
        save();
      }
      return db.users[idx];
    }
  },
  subjects: {
    find: () => db.subjects,
    findById: (id) => db.subjects.find(s => s._id === id),
    create: (data) => {
      const newSubject = { ...data, _id: Date.now().toString() };
      db.subjects.push(newSubject);
      save();
      return newSubject;
    },
    findByIdAndUpdate: (id, data) => {
      const index = db.subjects.findIndex(s => s._id === id);
      if (index !== -1) {
        db.subjects[index] = { ...db.subjects[index], ...data };
        save();
      }
      return db.subjects[index];
    },
    findByIdAndDelete: (id) => {
      const index = db.subjects.findIndex(s => s._id === id);
      if (index !== -1) {
        const deleted = db.subjects.splice(index, 1)[0];
        save();
        return deleted;
      }
    }
  },
  tasks: {
    find: () => db.tasks,
    create: (data) => {
      const newTask = { ...data, _id: Date.now().toString() };
      db.tasks.push(newTask);
      save();
      return newTask;
    },
    findByIdAndUpdate: (id, data) => {
      const index = db.tasks.findIndex(t => t._id === id);
      if (index !== -1) {
        db.tasks[index] = { ...db.tasks[index], ...data };
        save();
      }
      return db.tasks[index];
    },
    findByIdAndDelete: (id) => {
      const index = db.tasks.findIndex(t => t._id === id);
      if (index !== -1) {
        const deleted = db.tasks.splice(index, 1)[0];
        save();
        return deleted;
      }
    }
  },
  sessions: {
    find: () => db.sessions,
    create: (data) => {
      const newSession = { ...data, _id: Date.now().toString() };
      db.sessions.push(newSession);
      save();
      return newSession;
    },
    findByIdAndUpdate: (id, data) => {
      const index = db.sessions.findIndex(s => s._id === id);
      if (index !== -1) {
        db.sessions[index] = { ...db.sessions[index], ...data };
        save();
      }
      return db.sessions[index];
    },
    findByIdAndDelete: (id) => {
      const index = db.sessions.findIndex(s => s._id === id);
      if (index !== -1) {
        const deleted = db.sessions.splice(index, 1)[0];
        save();
        return deleted;
      }
    }
  },
  projects: {
    find: () => db.projects,
    create: (data) => {
      const newProject = { ...data, _id: Date.now().toString() };
      db.projects.push(newProject);
      save();
      return newProject;
    },
    findByIdAndUpdate: (id, data) => {
      const index = db.projects.findIndex(p => p._id === id);
      if (index !== -1) {
        db.projects[index] = { ...db.projects[index], ...data };
        save();
      }
      return db.projects[index];
    },
    findByIdAndDelete: (id) => {
      const index = db.projects.findIndex(p => p._id === id);
      if (index !== -1) {
        const deleted = db.projects.splice(index, 1)[0];
        save();
        return deleted;
      }
    }
  }
};



