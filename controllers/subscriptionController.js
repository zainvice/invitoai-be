const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    try {
        const { productName, productDescription, amount, currency, interval, successUrl, cancelUrl } = req.body;
        console.log(req.body)
        // Validate required fields
        if (!productName || !amount || !successUrl || !cancelUrl) {
            return res.status(400).json({ error: 'Missing required fields in the request body.' });
        }

        // Create the product
        const product = await stripe.products.create({
            name: productName, // Ensure this is not undefined
            description: productDescription || 'No description provided.',
        });

        // Create the price
        const price = await stripe.prices.create({
            unit_amount: amount, // Ensure this is in the smallest currency unit
            currency: currency || 'usd',
            recurring: { interval: interval || 'month' },
            product: product.id,
        });

        // Create the checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.handleWebhook = async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Subscription was successful:', session);
      // Update user subscription in the database
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
