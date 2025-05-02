import { createClient } from "@supabase/supabase-js";

export async function POST({ request }) {
  try {
    // Get Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body = await request.json();
    const { skills = [], preferences = {} } = body;

    // Get authentication if available (for personalized recommendations)
    let userId = null;
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const { data } = await supabase.auth.getUser(token);
      userId = data?.user?.id;
    }

    // Fetch projects for recommendations
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "open")
      .limit(100);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Local recommendation scoring algorithm
    // In production, you might call an external AI service or use a more sophisticated algorithm
    let recommendations = [];

    if (skills && skills.length > 0) {
      // Basic matching algorithm based on skills
      const scoredProjects = projects.map((project) => {
        // Calculate score based on skill match
        const projectSkills = project.skills || [];
        let skillMatchScore = 0;

        skills.forEach((skill) => {
          // Full match for exact skills
          if (
            projectSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
          ) {
            skillMatchScore += 10;
          }

          // Partial match for similar skills
          else if (
            projectSkills.some(
              (s) =>
                s.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(s.toLowerCase())
            )
          ) {
            skillMatchScore += 5;
          }
        });

        // Additional scoring factors
        let totalScore = skillMatchScore;

        // Budget preference matching
        if (preferences.budgetRange && project.budget) {
          const [minBudget, maxBudget] = preferences.budgetRange
            .split("-")
            .map(Number);
          if (
            (!minBudget || project.budget >= minBudget) &&
            (!maxBudget || project.budget <= maxBudget)
          ) {
            totalScore += 5;
          }
        }

        // Category preference matching
        if (preferences.category && project.category === preferences.category) {
          totalScore += 8;
        }

        return {
          ...project,
          score: totalScore,
        };
      });

      // Sort by score (highest first)
      scoredProjects.sort((a, b) => b.score - a.score);

      // Generate recommendations
      if (scoredProjects.length > 0) {
        // Get top projects as direct recommendations
        const topProjects = scoredProjects.slice(0, 5);
        recommendations = topProjects.map((project) => ({
          label: project.title,
          filters: {
            query: project.title,
          },
        }));

        // Add skill-based recommendations
        const topSkills = getTopMatchingSkills(projects, skills);
        topSkills.forEach((skill) => {
          if (
            !recommendations.some((r) =>
              r.label.toLowerCase().includes(skill.toLowerCase())
            )
          ) {
            recommendations.push({
              label: `${skill} Projects`,
              filters: {
                skills: [skill],
              },
            });
          }
        });

        // Add category recommendations if we have relevant ones
        const categories = [
          ...new Set(scoredProjects.slice(0, 10).map((p) => p.category)),
        ];
        categories.forEach((category) => {
          if (
            category &&
            !recommendations.some((r) => r.label.includes(category))
          ) {
            recommendations.push({
              label: category,
              filters: {
                category,
              },
            });
          }
        });
      }
    } else {
      // Default recommendations based on popularity
      recommendations = [
        {
          label: "Web Development Projects",
          filters: {
            category: "Web Development",
          },
        },
        {
          label: "Mobile Apps",
          filters: {
            category: "Mobile Apps",
          },
        },
        {
          label: "High Paying Projects",
          filters: {
            budgetRange: "5000-10000",
          },
        },
      ];
    }

    // Limit recommendations to a reasonable number
    recommendations = recommendations.slice(0, 8);

    return new Response(JSON.stringify(recommendations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error generating recommendations:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to find top matching skills from projects
function getTopMatchingSkills(projects, userSkills) {
  const skillCounts = {};

  // Count skills across all projects
  projects.forEach((project) => {
    const projectSkills = project.skills || [];
    projectSkills.forEach((skill) => {
      if (!skillCounts[skill]) {
        skillCounts[skill] = 0;
      }
      skillCounts[skill]++;
    });
  });

  // Filter out user's skills
  const uniqueSkills = Object.keys(skillCounts).filter(
    (skill) => !userSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
  );

  // Sort by frequency
  uniqueSkills.sort((a, b) => skillCounts[b] - skillCounts[a]);

  // Return top skills
  return uniqueSkills.slice(0, 5);
}
