import { supabase, isSupabaseConfigured } from "../../../../lib/supabase.js";

export async function POST({ request, params }) {
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

    // Get notification ID from URL params
    const notificationId = params.id;

    // Get auth session
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

    // First check if notification belongs to user
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", notificationId)
      .single();

    if (fetchError || !notification) {
      return new Response(JSON.stringify({ error: "Notification not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Security check - users can only mark their own notifications as read
    if (notification.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update notification to mark as read
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ read: true, seen: true })
      .eq("id", notificationId);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
