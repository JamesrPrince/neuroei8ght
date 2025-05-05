import { supabase, isSupabaseConfigured } from "../../../lib/supabase.js";

export async function GET({ request }) {
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

    // Fetch notifications for the user
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ notifications }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in notifications GET:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// For creating new notifications (admin or system use)
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

    // Check if user is admin (only admins can create notifications for other users)
    const { data: userRole } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = userRole?.role === "admin";

    // Parse request body
    const body = await request.json();

    // If not admin, can only create notifications for self
    if (!isAdmin && body.user_id !== user.id) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized to create notifications for other users",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create the notification
    const notificationData = {
      title: body.title,
      content: body.content,
      type: body.type,
      user_id: body.user_id || user.id,
      project_id: body.project_id,
      conversation_id: body.conversation_id,
      created_at: new Date().toISOString(),
      read: false,
      seen: false,
    };

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert([notificationData])
      .select()
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ notification }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in notifications POST:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
