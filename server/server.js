const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'catsFORlife',
  database: 'subscription_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'atharvapkhond@gmail.com',
    pass: 'xecx iudw tppi dcoz' // Replace with your actual email password or app-specific password
  }
});

// Subscribe Route
app.post('/subscribe', (req, res) => {
  const email = req.body.email;
  const checkQuery = 'SELECT * FROM subscribers WHERE email = ?';
  db.query(checkQuery, [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json({ message: 'You are already subscribed!' });
    } else {
      const insertQuery = 'INSERT INTO subscribers (email) VALUES (?)';
      db.query(insertQuery, [email], (err, result) => {
        if (err) throw err;

        // Send confirmation email
        const mailOptions = {
          from: 'atharvapkhond@gmail.com',
          to: email,
          subject: 'Subscription Confirmation',
          text: 'Thank you for subscribing to our service!'
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Subscription successful, but failed to send confirmation email' });
          }
          res.json({ message: 'Congrats on your subscription! Confirmation email sent.' });
        });
      });
    }
  });
});

// Unsubscribe Route
app.post('/unsubscribe', (req, res) => {
  const email = req.body.email;
  const checkQuery = 'SELECT * FROM subscribers WHERE email = ?';
  db.query(checkQuery, [email], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.json({ message: 'You are not subscribed!' });
    } else {
      const deleteQuery = 'DELETE FROM subscribers WHERE email = ?';
      db.query(deleteQuery, [email], (err, result) => {
        if (err) throw err;
        res.json({ message: 'You have unsubscribed!' });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});