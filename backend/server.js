require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
const JWT_SECRET = process.env.JWT_SECRET || 'local-demo-secret-change-me';
const DEFAULT_PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

let users = [];
let enrollments = [];
let nextUser = 1;
let nextEnrollment = 1;

let courses = [
  {
    id: 'C101',
    title: 'Full-Stack Web Development',
    description: 'Build responsive websites and REST APIs using modern web technologies.',
    category: 'Web Development',
    instructorId: 'demo',
    instructorName: 'Aarav Sharma',
    duration: '8 weeks',
    level: 'Beginner',
    price: 0,
    rating: 4.8,
    students: 128,
    lessons: 24,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    published: true,
  },
  {
    id: 'C102',
    title: 'Python for Data Science',
    description: 'Learn Python, data analysis, visualization and practical data workflows.',
    category: 'Data Science',
    instructorId: 'demo',
    instructorName: 'Meera Reddy',
    duration: '6 weeks',
    level: 'Beginner',
    price: 499,
    rating: 4.7,
    students: 96,
    lessons: 18,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    published: true,
  },
  {
    id: 'C103',
    title: 'Introduction to Artificial Intelligence',
    description: 'Explore machine learning, responsible AI and real-world applications.',
    category: 'Artificial Intelligence',
    instructorId: 'demo',
    instructorName: 'Ishaan Rao',
    duration: '5 weeks',
    level: 'Intermediate',
    price: 299,
    rating: 4.9,
    students: 214,
    lessons: 15,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    published: true,
  },
  {
    id: 'C104',
    title: 'SQL and Database Essentials',
    description: 'Practice database design, queries, joins and data integrity.',
    category: 'Database Management',
    instructorId: 'demo',
    instructorName: 'Nisha Patel',
    duration: '4 weeks',
    level: 'Beginner',
    price: 199,
    rating: 4.6,
    students: 73,
    lessons: 12,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80',
    published: true,
  },
];

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';

  try {
    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Missing bearer token');
    }

    req.user = jwt.verify(authHeader.slice(7), JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ message: 'You do not have permission.' });
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'LearnConnect API is running' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    }

    if (users.some((user) => user.email === email.toLowerCase())) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const user = {
      id: String(nextUser++),
      name: name.trim(),
      email: email.toLowerCase(),
      role: req.body.role === 'instructor' ? 'instructor' : 'student',
      phone: '',
      bio: '',
      passwordHash: await bcrypt.hash(password, 10),
    };

    users.push(user);

    return res.status(201).json({ token: createToken(user), user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').toLowerCase();
  const password = String(req.body.password || '');
  const user = users.find((currentUser) => currentUser.email === email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({ token: createToken(user), user: sanitizeUser(user) });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = users.find((currentUser) => currentUser.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({ user: sanitizeUser(user) });
});

app.get('/api/courses', (req, res) => {
  let filteredCourses = courses.filter((course) => course.published);
  const searchTerm = String(req.query.search || '').toLowerCase();
  const category = String(req.query.category || '');
  const level = String(req.query.level || '');

  if (searchTerm) {
    filteredCourses = filteredCourses.filter((course) =>
      `${course.title} ${course.description} ${course.instructorName}`.toLowerCase().includes(searchTerm)
    );
  }

  if (category) {
    filteredCourses = filteredCourses.filter((course) => course.category === category);
  }

  if (level) {
    filteredCourses = filteredCourses.filter((course) => course.level === level);
  }

  return res.json(filteredCourses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  return res.json(course);
});

app.post('/api/courses', auth, requireRole('instructor'), (req, res) => {
  const { title, description, category } = req.body || {};

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Title, description and category are required.' });
  }

  const newCourse = {
    id: 'C' + Date.now(),
    title,
    description,
    category,
    instructorId: req.user.id,
    instructorName: req.user.name,
    duration: req.body.duration || '4 weeks',
    level: req.body.level || 'Beginner',
    price: Math.max(0, Number(req.body.price) || 0),
    rating: 0,
    students: 0,
    lessons: 0,
    thumbnail:
      req.body.thumbnail ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    published: true,
  };

  courses.unshift(newCourse);

  return res.status(201).json(newCourse);
});

app.put('/api/courses/:id', auth, requireRole('instructor'), (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  if (course.instructorId !== req.user.id) {
    return res.status(403).json({ message: 'You can only edit your own courses.' });
  }

  Object.assign(course, req.body);

  return res.json(course);
});

app.delete('/api/courses/:id', auth, requireRole('instructor'), (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  if (course.instructorId !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own courses.' });
  }

  courses = courses.filter((item) => item.id !== course.id);

  return res.json({ success: true });
});

app.get('/api/categories', (_req, res) => {
  const categories = [...new Set(courses.map((course) => course.category))];

  const payload = categories.map((name, index) => ({
    id: index + 1,
    name,
    count: courses.filter((course) => course.category === name).length,
  }));

  return res.json(payload);
});

app.get('/api/instructors', (_req, res) => {
  const instructors = [...new Set(courses.map((course) => course.instructorName))];

  const payload = instructors.map((name, index) => ({
    id: 'i' + index,
    name,
    courses: courses.filter((course) => course.instructorName === name).length,
  }));

  return res.json(payload);
});

app.post('/api/enrollments', auth, requireRole('student'), (req, res) => {
  const course = courses.find((item) => item.id === String(req.body.courseId));

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  if (
    enrollments.some(
      (enrollment) => enrollment.userId === req.user.id && enrollment.courseId === course.id
    )
  ) {
    return res.status(409).json({ message: 'Already enrolled in this course.' });
  }

  const enrollment = {
    id: String(nextEnrollment++),
    userId: req.user.id,
    courseId: course.id,
    enrollmentDate: new Date().toISOString(),
    progress: 0,
    status: 'active',
  };

  enrollments.push(enrollment);
  course.students += 1;

  return res.status(201).json({
    success: true,
    message: 'Successfully enrolled in the course.',
    enrollment,
  });
});

app.get('/api/enrollments/my-courses', auth, requireRole('student'), (req, res) => {
  const userEnrollments = enrollments
    .filter((enrollment) => enrollment.userId === req.user.id)
    .map((enrollment) => ({
      ...enrollment,
      course: courses.find((course) => course.id === enrollment.courseId),
    }))
    .filter((enrollment) => enrollment.course);

  return res.json(userEnrollments);
});

app.get('/api/profile', auth, (req, res) => {
  const user = users.find((currentUser) => currentUser.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json(sanitizeUser(user));
});

app.put('/api/profile', auth, (req, res) => {
  const user = users.find((currentUser) => currentUser.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  for (const field of ['name', 'phone', 'bio']) {
    if (typeof req.body[field] === 'string') {
      user[field] = req.body[field].trim();
    }
  }

  return res.json(sanitizeUser(user));
});

app.get('/api/instructor/dashboard', auth, requireRole('instructor'), (req, res) => {
  const ownedCourses = courses.filter((course) => course.instructorId === req.user.id);

  return res.json({
    totalCourses: ownedCourses.length,
    publishedCourses: ownedCourses.filter((course) => course.published).length,
    totalStudents: ownedCourses.reduce((total, course) => total + course.students, 0),
    courses: ownedCourses,
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please complete all fields.' });
  }

  return res.status(201).json({ success: true, message: 'Thanks for contacting LearnConnect.' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(DEFAULT_PORT, () => {
  console.log('LearnConnect API running on port ' + DEFAULT_PORT);
});
