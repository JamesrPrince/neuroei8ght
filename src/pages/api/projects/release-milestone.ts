import { supabase, isSupabaseConfigured } from "../../lib/supabase.js";
import Stripe from "stripe";

export async function POST({ request }) {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      return new Response(
        JSON.stringify({
          error: "API service unavailable - database configuration issue",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Stripe with secret key
    const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

    // Parse request body
    const body = await request.json();
    const { milestoneId, projectId } = body;

    // Get auth session (to verify client has permission)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get project and milestone info
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*, client_id, milestones(*)")
      .eq("id", projectId)
      .single();

    if (projectError || !projectData) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Security check - only client can release payments
    if (projectData.client_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Only the client can release payments" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const milestone = projectData.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return new Response(JSON.stringify({ error: "Milestone not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the payment intent for this project
    const { data: paymentIntentData, error: piError } = await supabase
      .from("payment_intents")
      .select("stripe_payment_intent_id")
      .eq("project_id", projectId)
      .single();

    if (piError || !paymentIntentData) {
      return new Response(JSON.stringify({ error: "Payment not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Transfer the milestone amount to the freelancer
    // In production, you might use Stripe Connect for this
    const transfer = await stripe.transfers.create({
      amount: Math.round(milestone.amount * 100), // convert to cents
      currency: "usd",
      destination: projectData.freelancer_stripe_account_id, // This would need to be stored
      source_transaction: paymentIntentData.stripe_payment_intent_id,
      description: `Milestone payment for ${milestone.title}`,
    });

    // Update milestone status in database
    const { error: updateError } = await supabase
      .from("milestones")
      .update({
        status: "Completed",
        paid_at: new Date().toISOString(),
        payment_reference: transfer.id,
      })
      .eq("id", milestoneId);

    if (updateError) {
      console.error("Error updating milestone:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, milestoneId, status: "Completed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error releasing milestone payment:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
