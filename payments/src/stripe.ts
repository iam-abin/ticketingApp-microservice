// this file is responible for importing and initializing a copy of the stripe liberary,
// we need to make this file before moving on to route handler(ie, routes/new.ts)

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY! , {
  apiVersion: '2023-08-16',
});