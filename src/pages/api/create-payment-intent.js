import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST({ request }) {
  try {
    // Initialize Stripe with secret key
    const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

    // Get Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body = await request.json();
    const { amount, projectId } = body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        projectId,
      },
    });

    // Store payment intent in Supabase
    const { error } = await supabase.from("payment_intents").insert([
      {
        stripe_payment_intent_id: paymentIntent.id,
        project_id: projectId,
        amount: amount / 100, // Convert back to dollars for storage
        status: paymentIntent.status,
      },
    ]);

    if (error) {
      console.error("Error storing payment intent:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return client secret to the frontend
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
