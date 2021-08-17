require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const exphbs = require('express-handlebars');
const { get } = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

/* ========== Middlewares ========== */

app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
  }),
);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/* ========== Routes ========== */

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Keys to Drawing - Bert Dodson',
          },
          unit_amount: 5900,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:${port}/success`,
    cancel_url: `http://localhost:${port}`,
  });

  res.redirect(303, session.url);
});

app.get('/success', (req, res) => {
  res.render('success');
});

app.listen(port, () => {
  console.log(
    `Server is listening on port ${port}. Visit at http://localhost:${port}.`,
  );
});
