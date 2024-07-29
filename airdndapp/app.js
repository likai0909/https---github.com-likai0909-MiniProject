// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

const connection = mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_admin2',
    password: 'Db9kJ#ZV4ArAN5?',
    database: 'freedb_hotellist'

    });
    connection.connect((err) => {
    if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
    }
    console.log('Connected to MySQL database');
    });

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    const sql = 'SELECT * FROM hotellist';

    connection.query( sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving hotellist');
        }
        res.render('index', {hotellist: results});
        
    });
});
// get hotel details by id


app.get('/hotel/:hotelId', (req, res) => {
    const hotelId = req.params.hotelId; // Corrected parameter name
    console.log(hotelId);
    const sql = 'SELECT * FROM hotellist WHERE hotelId = ?';

    connection.query(sql, [hotelId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving hotel by ID');
        }

        if (results.length > 0) {
            res.render('hotel', { hotel: results[0] });
        } else {
            res.status(200).send('Hotel not found');
        }
    });
});

app.get('/addHotel', (req, res) => {
    res.render('addHotel');
});


app.post ('/hotel', (req, res) =>{
    const {image, name, price, description, address} = req.body;
    const sql = 'INSERT INTO hotellist (image, name, price, description, address) VALUES (?, ?, ?, ?, ?)';

    connection.query(sql, [image, name, price, description, address], (error, results) =>{
        if (error){
            console.error("Error adding hotel:", error);
            res.status(500).send('Error adding hotel');
        } else {
            res.redirect('/')
        }
        
    })
})


app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/submit', (req, res) => {
    // Activity 3: Edit the lines below include the additional form fields sent by the form
    const { name, email, contact, comments } = req.body;
    
    res.render('submitted', {name, email, contact, comments})
});

app.post('/subscribe', (req, res) => {
    const { email } = req.body;
    // Add the email to your database or mailing list here

    res.render('confirm',{ email });
});

// Route to render login page
app.get('/login', (req, res) => {
    res.render('login', { message: null });
});


// Route to handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Implement your login logic here
    if (username === 'test' && password === 'password') {
        res.send('Login successful');
    } else {
        res.render('login', { message: 'Invalid username or password' });
    }
});

// Route to render sign up page
app.get('/signup', (req, res) => {
    res.render('signup', { message: null });
});

// Route to handle sign up form submission
app.post('/signup', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    // Implement your sign up logic here
    if (password !== confirmPassword) {
        res.render('signup', { message: 'Passwords do not match' });
    } else {
        res.send('Sign up successful');
    }
});

app.get('/editHotel/:id', (req, res) => {
    const hotelId = req.params.id;
    const sql = 'SELECT * FROM hotellist WHERE hotelId = ?';

    connection.query(sql, [hotelId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            res.status(500).send('Error retrieving hotel by ID');
        }
        if (results.length > 0) {
            res.render('editHotel', { hotel: results[0] });
        }
        else {
            res.status(404).send('Hotel not found');
        }
    });
});

app.post('/editHotel/:id', (req, res) => {
    const hotelId = req.params.id;
    const { image, name, price, description, address } = req.body;
    const sql = 'UPDATE hotellist SET image = ?, name = ?, price = ?, description = ? ,  address = ?WHERE hotelId = ?';

    connection.query(sql, [image, name, price, description, address, hotelId], (error, results) => {
        if (error) {
            console.error('Error updating hotel:', error);
            res.status(500).send('Error updating hotel');

        } else {
            res.redirect('/');
        }
    });
});

app.get('/deleteHotel/:id', (req, res) => {
    const hotelId = req.params.id;
    const sql = 'DELETE FROM hotellist WHERE hotelId = ?';

    connection.query(sql, [hotelId], (error, results) => {
        if (error) {
            console.error('Error deleting hotel:', error);
            res.status(500).send('Error deleting hotel');
        } else {
            // Redirect to the root route after successful deletion
            res.redirect('/');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});