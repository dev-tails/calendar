const express = require('express');
const mongodb = require('mongodb');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const webpush = require('web-push');

dotenv.config();
const maxAgeInMilliseconds = 365 * 60 * 60 * 24 * 1000;

async function run() {
  const userDatabaseClient = await mongodb.MongoClient.connect(
    process.env.USER_DB_URL
  );
  //user db
  const userDb = userDatabaseClient.db();
  const User = userDb.collection('users');

  //calendar db
  const client = await mongodb.MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const Event = db.collection('events');

  const PushNotification = db.collection('pushnotifications');

  const server = express();
  const port = process.env.PORT || 8080;

  server.use(cookieParser());
  server.use(express.json());

  server.use(express.static('../fe/public'));

  webpush.setVapidDetails(
    `mailto: ${process.env.WEB_PUSH_VAPID_MAIL_TO}`,
    process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
    process.env.WEB_PUSH_VAPID_PRIVATE_KEY
  );

  const sendNotification = (subscription, dataToSend = '') => {
    webpush.sendNotification(subscription, dataToSend);
  };

  server.use((req, res, next) => {
    req.user = req.cookies['user'];
    next();
  });

  server.get('/api/users/self', async (req, res, next) => {
    try {
      const userId = req.user;
      const user = await User.findOne(
        { _id: mongodb.ObjectId(userId) },
        { projection: { password: 0 } }
      );
      return res.json({ data: user });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.post('/api/users/login', async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
      res.cookie('user', user._id, { maxAge: maxAgeInMilliseconds });
      return res.sendStatus(200);
    }

    return res.sendStatus(400);
  });

  server.get('/api/users/logout', async (req, res, next) => {
    if (req.user) {
      res.clearCookie('user');
      return res.json({ message: 'User logged out.' });
    } else {
      return res.json({ message: 'No user to log out.' });
    }
  });

  server.get('/api/users', async (req, res, next) => {
    if (req.user) {
      const users = await User.find(
        {},
        { projection: { password: 0 } }
      ).toArray();
      res.json({ data: users });
    } else {
      res.redirect('/');
    }
  });

  server.get('/api/events', async (req, res) => {
    try {
      const start = new Date(req.query.start);
      const end = new Date(start);
      end.setTime(end.getTime() + 24 * 60 * 60 * 1000);

      const startAllDayUTC = new Date(start);
      startAllDayUTC.setUTCHours(0, 0, 0, 0);
      const events = await Event.find({
        $or: [
          {
            start: {
              $gte: start,
              $lte: end,
            },
            allDay: false,
          },
          {
            start: startAllDayUTC,
            allDay: true,
          },
        ],
      }).toArray();

      const userEvents = events.filter((event) => {
        return (
          event.users?.includes(req.user) ||
          !event.users?.length ||
          event.visibility === 'public'
        );
      });

      return res.json({ data: userEvents });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.get('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const event = await Event.findOne({ _id: mongodb.ObjectId(id) });
      return res.json({ data: event });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.put('/api/events/:id', async (req, res) => {
    const eventId = mongodb.ObjectId(req.body.id);
    const { title, description, start, end, allDay, users, visibility } =
      req.body.body;

    if (!title || !start || !eventId) {
      throw new Error('Event must include title and start date');
    }

    try {
      await Event.updateOne(
        { _id: eventId },
        {
          $set: {
            title,
            description,
            start: new Date(start),
            end: end ? new Date(end) : null,
            allDay,
            updatedAt: new Date(),
            users,
            visibility,
          },
        }
      );

      const editedEvent = await Event.findOne({
        _id: eventId,
      });
      return res.json({ data: editedEvent });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.delete('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const event = await Event.deleteOne({ _id: mongodb.ObjectId(id) });
      return res.json({ data: event });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.post('/api/events', async (req, res) => {
    try {
      const event = await Event.insertOne({
        title: req.body.title,
        description: req.body.description,
        start: new Date(req.body.start),
        end: req.body.end ? new Date(req.body.end) : undefined,
        allDay: req.body.allDay,
        users: req.body.users,
        visibility: req.body.visibility,
        owner: mongodb.ObjectId(req.body.owner),
      });

      const { insertedId } = event;
      return res.json({ data: insertedId });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.post('/api/subscriptions', async (req, res) => {
    const currentUser = req.user;
    const subscriptionInfo = req.body;

    const payload = JSON.stringify({ title: 'Event coming up 🗓' });

    try {
      await PushNotification.insertOne({
        user: mongodb.ObjectId(currentUser),
        subscription: subscriptionInfo,
      });

      // webpush.sendNotification(subscriptionInfo, payload);
      res.status(201).json({});
    } catch (err) {
      console.error(err);
    }
  });

  server.get('/api/subscriptions/publickey', (req, res) => {
    res.json({
      publickey: process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
    });
  });

  server.delete('/api/subscriptions', async (req, res) => {
    const currentUser = req.user;
    try {
      await PushNotification.deleteOne({
        user: mongodb.ObjectId(currentUser),
      });
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
    }
  });

  server.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

run();
