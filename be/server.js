const express = require('express');
const mongodb = require('mongodb');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const webpush = require('web-push');
const nodemailer = require('nodemailer');

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

  // server.use(express.static('./fe/public'));
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
    const { sendEmail } = req.query;

    // TODO: add owner in put requests
    // TODO: send email in put rqeuets
    // TODO: send email in delete requests

    const eventId = mongodb.ObjectId(req.body.id);
    const { title, description, start, end, allDay, users, visibility } =
      req.body.body;

    if (!title || !start || !eventId) {
      throw new Error('Event must include title and start date');
    }

    try {
      const editEvent = await Event.findOneAndUpdate(
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
        },
        { returnDocument: 'after' }
      );

      const updatedEvent = editEvent.value;

      if (!!sendEmail) {
        sendEventEmail(updatedEvent, 'edit');
      }

      return res.json({ data: updatedEvent });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.delete('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { sendEmail } = req.query;

      if (sendEmail) {
        const event = await Event.findOne({ _id: mongodb.ObjectId(id) });
        sendEventEmail({ ...event, id }, 'delete');
      }

      const event = await Event.deleteOne({ _id: mongodb.ObjectId(id) });
      return res.json({ data: event });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  server.post('/api/events', async (req, res) => {
    const { sendEmail } = req.query;

    const newEvent = {
      title: req.body.title,
      description: req.body.description,
      start: new Date(req.body.start),
      end: req.body.end ? new Date(req.body.end) : undefined,
      allDay: req.body.allDay,
      users: req.body.users,
      visibility: req.body.visibility,
      owner: mongodb.ObjectId(req.body.owner),
    };

    try {
      const event = await Event.insertOne(newEvent);
      const { insertedId } = event;

      if (!!insertedId && !!sendEmail) {
        sendEventEmail({ ...newEvent, id: insertedId }, 'create');
      }
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

  /* EMAILS */
  const transporter = nodemailer.createTransport({
    host: 'mail.xyzdigital.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'noreply@xyzdigital.com',
      pass: 'Sp2xQIAAOzv2YGHD',
    },
  });

  async function sendEventEmail(upcomingEvent, type) {
    let users = [];
    if (upcomingEvent.users.length) {
      const guestsIds = [...upcomingEvent.users].map((user) =>
        mongodb.ObjectId(user)
      );

      users = await User.find(
        { _id: { $in: guestsIds } },
        { projection: { _id: 1, email: 1, name: 1 } }
      ).toArray();
    } else {
      users = await User.find(
        {},
        { projection: { _id: 1, email: 1, name: 1 } }
      ).toArray();
    }

    const sender = users.find(
      (receiver) => String(receiver._id) === String(upcomingEvent.owner)
    );

    const guests = users.filter((receiver) => receiver.email !== sender.email);
    const emailRecipients = guests.map((guest) => guest.email);
    const allGuestsNames = users.map((user) => user.name).join(', ');

    const eventIntro = {
      create: `<p>You have been invited to the following event by ${sender.name}:</p>`,
      edit: `<p>The following event has been edited by ${sender.name}. Find details below:</p>`,
      delete: `<p>The event ${
        upcomingEvent.title
      } on ${date()} has been cancelled:</p>`,
    };

    const eventEnding = {
      create: `<p>You can see event here https://calendar.xyzdigital.com/events/${upcomingEvent.id}</p>`,
      edit: `<p>You can see event here https://calendar.xyzdigital.com/events/${upcomingEvent.id}</p>`,
      delete: `<p>Contact ${sender.name} (${sender.email}) for more information.</p>`,
    };

    function date() {
      let stringDate = '';
      if (upcomingEvent.allDay) {
        const splitDate = upcomingEvent.start.toString().split('T');
        const slicedDate = splitDate[0];
        stringDate = `${slicedDate} - All day`;
      } else {
        stringDate = `${upcomingEvent.start} - ${upcomingEvent.end}`;
      }
      return stringDate;
    }

    const description = upcomingEvent.description
      ? `<p><b>Description:</b> ${upcomingEvent.description}</p>`
      : '';

    const info = await transporter.sendMail({
      from: `"XYZ Digital" <noreply@xyzdigital.com>`,
      to: emailRecipients,
      subject: `🗓  ${upcomingEvent.title}`,
      html: `
      ${eventIntro[type]}
      <div style="text-decoration:${
        type === 'delete' ? 'line-through' : 'none'
      }">
      <p><b>Title: </b>${upcomingEvent.title}</p>
      <p><b>Date: </b>${date()}</p>
      ${description}
      <p><b>Link: </b> <a href="https://preview-iyris.cloud.engramhq.xyz/${
        upcomingEvent.id
      }" target="_blank"> preview-iyris.cloud.engramhq.xyz/${
        upcomingEvent.id
      }</a></p>
      <p><b>Guests: </b>${allGuestsNames}</p>
      </br>
      </div>
      ${eventEnding[type]}
      `,
    });

    console.log('Message sent:', info);
  }
}

run();
