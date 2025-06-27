const express = require("express");
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const saltRounds = 10;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const serviceAccount = require('./key.json');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/payment", (req, res) => {
    if (req.session.user) {
      res.render("payment"); // Render the payment.ejs file
    } else {
      res.redirect("/login"); // Redirect to login if user is not logged in
    }
  });

app.post("/signupSubmit", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Error: Unable to sign up. Please try again later.");
    }
    try {
      await db.collection("users").doc(email).set({ name, email, password: hash });
      res.send("Sign up is successful. Go to <a href='/login'>login</a>.");
    } catch (error) {
      console.error("Error adding document:", error);
      res.status(500).send("Error: Unable to sign up. Please try again later.");
    }
  });
});

app.post("/loginSubmit", (req, res) => {
  const { email, password } = req.body;
  db.collection("users").doc(email).get()
    .then((doc) => {
      if (!doc.exists) {
        return res.send("User not found.");
      }
      const user = doc.data();
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Error: Unable to login. Please try again later.");
        }
        if (result) {
          req.session.user = user;
          res.redirect("/dashboard");
        } else {
          res.send("Incorrect password.");
        }
      });
    })
    .catch((error) => {
      console.error("Error getting document:", error);
      res.status(500).send("Error: Unable to login. Please try again later.");
    });
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard");
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error: Unable to log out. Please try again later.");
    }
    res.redirect("/login");
  });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
