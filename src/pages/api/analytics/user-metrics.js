// API endpoint for fetching user analytics metrics
// This endpoint returns analytics data based on user type and user ID

export async function get({ request }) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const userType = url.searchParams.get("userType");

    if (!userId || !userType) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: userId and userType are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // In production, fetch real data from database
    // For now, returning mock data based on userType
    const analyticsData = generateMockAnalyticsData(userType, userId);

    return new Response(JSON.stringify(analyticsData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch analytics data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to generate mock data
function generateMockAnalyticsData(userType, userId) {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  // Generate dates for the last 6 months for chart data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString("default", { month: "short" });
  }).reverse();

  // Base data structure
  const baseData = {
    timeRange: "last6Months",
    userData: {
      name: `User ${userId}`,
      joinDate: "2023-01-15",
      profileCompleteness: 85,
    },
    lastUpdated: new Date().toISOString(),
  };

  // User type specific data
  if (userType === "freelancer") {
    return {
      ...baseData,
      keyMetrics: {
        totalEarnings: {
          value: 12580,
          trend: +15.2,
          currency: "USD",
        },
        projectsCompleted: {
          value: 24,
          trend: +5.0,
        },
        avgRating: {
          value: 4.8,
          trend: +0.2,
        },
        avgResponseTime: {
          value: "2.5 hours",
          trend: -10.0,
        },
      },
      charts: {
        earningsHistory: {
          labels: last6Months,
          data: [1200, 1450, 2100, 1800, 3200, 2830],
        },
        projectsTimeline: {
          labels: last6Months,
          data: [3, 5, 4, 3, 6, 3],
        },
        skillsUtilization: {
          labels: ["Web Dev", "UI/UX", "Backend", "DevOps", "Mobile"],
          data: [45, 25, 15, 10, 5],
        },
        clientSatisfaction: {
          labels: last6Months,
          data: [4.5, 4.7, 4.8, 4.6, 5.0, 4.8],
        },
      },
      recentActivity: [
        {
          date: "2025-04-29",
          event: "Project completed",
          details: "E-commerce redesign",
          amount: "$1,200",
        },
        {
          date: "2025-04-15",
          event: "New milestone achieved",
          details: "API integration",
          amount: "$850",
        },
        {
          date: "2025-04-10",
          event: "New project started",
          details: "Mobile app development",
          amount: "Pending",
        },
        {
          date: "2025-03-28",
          event: "Client review received",
          details: "5 stars",
          amount: "-",
        },
        {
          date: "2025-03-22",
          event: "Milestone payment",
          details: "Database implementation",
          amount: "$750",
        },
      ],
    };
  } else if (userType === "client") {
    return {
      ...baseData,
      keyMetrics: {
        totalSpent: {
          value: 27650,
          trend: +22.8,
          currency: "USD",
        },
        activeProjects: {
          value: 4,
          trend: +1.0,
        },
        completedProjects: {
          value: 12,
          trend: +2.0,
        },
        avgProjectCost: {
          value: 2304,
          trend: -5.2,
          currency: "USD",
        },
      },
      charts: {
        budgetUtilization: {
          labels: last6Months,
          data: [4500, 3800, 6200, 5100, 4300, 3750],
        },
        projectsStatus: {
          labels: ["Completed", "In Progress", "Planning", "On Hold"],
          data: [12, 4, 2, 1],
        },
        talentDistribution: {
          labels: ["Web Dev", "Design", "Marketing", "Writing", "Video"],
          data: [40, 25, 15, 12, 8],
        },
        satisfactionTrend: {
          labels: last6Months,
          data: [4.5, 4.3, 4.8, 4.7, 4.9, 5.0],
        },
      },
      recentActivity: [
        {
          date: "2025-05-01",
          event: "Project milestone approved",
          details: "UI/UX redesign",
          amount: "$1,500",
        },
        {
          date: "2025-04-22",
          event: "New project posted",
          details: "Mobile app development",
          amount: "Budget: $8,000",
        },
        {
          date: "2025-04-15",
          event: "Freelancer hired",
          details: "John Smith",
          amount: "Rate: $45/hr",
        },
        {
          date: "2025-04-05",
          event: "Project completed",
          details: "Website development",
          amount: "$3,200",
        },
        {
          date: "2025-03-28",
          event: "Feedback provided",
          details: "5-star rating",
          amount: "-",
        },
      ],
    };
  } else if (userType === "admin") {
    return {
      ...baseData,
      platformMetrics: {
        activeUsers: {
          value: 12467,
          trend: +8.3,
        },
        totalTransactions: {
          value: 589450,
          trend: +12.7,
          currency: "USD",
        },
        newUsers: {
          value: 342,
          trend: +5.2,
        },
        projectCompletion: {
          value: 91.5,
          trend: +2.4,
          unit: "%",
        },
      },
      charts: {
        revenueBreakdown: {
          labels: ["Commission", "Premium Plans", "Featured Listings", "Other"],
          data: [65, 20, 10, 5],
        },
        userGrowth: {
          labels: last6Months,
          data: [11200, 11450, 11700, 11900, 12250, 12467],
        },
        transactionVolume: {
          labels: last6Months,
          data: [480000, 495000, 510000, 535000, 562000, 589450],
        },
        categoryDistribution: {
          labels: [
            "Development",
            "Design",
            "Marketing",
            "Writing",
            "Video",
            "Other",
          ],
          data: [35, 25, 15, 12, 8, 5],
        },
      },
      insights: [
        {
          title: "Freelancer Growth",
          value: "+18%",
          details: "YoY increase in active freelancers",
        },
        {
          title: "Mobile Usage",
          value: "64%",
          details: "Users accessing via mobile devices",
        },
        {
          title: "Support Tickets",
          value: "15",
          details: "Open tickets requiring attention",
        },
        {
          title: "Platform Uptime",
          value: "99.98%",
          details: "Last 30 days system reliability",
        },
      ],
    };
  } else {
    return {
      error: "Invalid user type specified",
      supportedTypes: ["freelancer", "client", "admin"],
    };
  }
}
