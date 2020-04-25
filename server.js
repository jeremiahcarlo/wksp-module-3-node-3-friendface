const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const { users } = require('./data/users');

const PORT = process.env.PORT || 7000;

let currentUser;

// Set Morgan
// app.use(morgan('combined'));

// Set static file
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Homepage Route Function
const handleGetHome = (req, res) => {
  // Check if user is logged
  if (currentUser !== undefined) {
    res.render('pages/homepage', {
      title: `FriendFace`,
      currentUser,
      users
    });
  } else {
    res.redirect('login');
  }
};

// // Login Routes Function
const handleGetLogin = (req, res) => {
  if (!currentUser) {
    res.render('pages/loginPage', {
      title: 'FriendFace'
    });
  } else {
    res.redirect('/');
  }
};

const handlePostLogin = (req, res) => {
  currentUser = users.find(user => user.name === req.body.name);
  if (currentUser) res.redirect('/');
  else res.redirect('/login');
};

const handleGet404 = (req, res) => {
  res.status(404);
  res.send('Error! 404');
};

const handleAddUser = (req, res) => {
  if (currentUser) {
    const userToAdd = users.find(user => user.id === req.body.id);
    currentUser.friends.push(userToAdd.id);
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
};

const handleRemoveUser = (req, res) => {
  if (currentUser) {
    const tempFriends = [...currentUser.friends];
    tempFriends.forEach((friend, index) => {
      if (parseInt(friend) === parseInt(req.body.id)) {
        tempFriends.splice(index, 1);
      }
    });
    currentUser.friends = tempFriends;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
};
// User Routes Function
const handleGetUser = (req, res) => {
  currentUser = users.find(user => user.id === req.params.id);
  if (currentUser) res.redirect('/');
};
// ---------------- All Routes ---------------- //
app.get('/', (req, res) => {
  handleGetHome(req, res);
});
app.get('/login', (req, res) => handleGetLogin(req, res));
app.post('/login', (req, res) => {
  handlePostLogin(req, res);
});
app.get('/user/:id', (req, res) => {
  handleGetUser(req, res);
});
app.post('/user/add', (req, res) => handleAddUser(req, res));
app.post('/user/remove', handleRemoveUser);

app.get('*', (req, res) => {
  handleGet404(req, res);
});

// Start the server on the port defined previously
app.listen(7000, () => console.log(`Server listening on PORT ${PORT}`));