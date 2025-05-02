import { supabase, isSupabaseConfigured } from "../../lib/supabase.js";

export async function GET({ request, url }) {
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

    // Get the search query parameter
    const query = url.searchParams.get("query");

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ skills: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // First check from a predefined list of common skills
    // In a real implementation, these would be stored in the database
    const commonSkills = [
      "JavaScript",
      "TypeScript",
      "React",
      "Vue.js",
      "Angular",
      "Node.js",
      "Python",
      "Django",
      "Flask",
      "Java",
      "Spring Boot",
      "C#",
      ".NET Core",
      "PHP",
      "Laravel",
      "WordPress",
      "Ruby",
      "Ruby on Rails",
      "Swift",
      "Kotlin",
      "Flutter",
      "React Native",
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "GraphQL",
      "REST API",
      "SQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Firebase",
      "Redis",
      "HTML",
      "CSS",
      "Sass",
      "TailwindCSS",
      "Bootstrap",
      "Material UI",
      "UI/UX Design",
      "Figma",
      "Adobe XD",
      "Sketch",
      "Photoshop",
      "Illustrator",
      "SEO",
      "DevOps",
      "CI/CD",
      "Git",
      "GitHub",
      "Agile",
      "Scrum",
      "Project Management",
      "Content Writing",
      "Technical Writing",
      "Data Science",
      "Machine Learning",
      "Artificial Intelligence",
      "Natural Language Processing",
      "Computer Vision",
      "Data Analysis",
      "Data Visualization",
      "Power BI",
      "Tableau",
      "Blockchain",
      "Smart Contracts",
      "Solidity",
      "Ethereum",
      "iOS Development",
      "Android Development",
      "Game Development",
      "Unity",
      "Unreal Engine",
      "VR/AR Development",
      "3D Modeling",
      "Animation",
      "Video Editing",
      "Digital Marketing",
      "Social Media Marketing",
      "Email Marketing",
      "Content Marketing",
      "Marketing Strategy",
      "E-commerce",
      "Shopify",
      "WooCommerce",
      "Magento",
      "Cybersecurity",
      "Penetration Testing",
      "Network Security",
      "Quality Assurance",
      "Automated Testing",
      "Manual Testing",
      "Responsive Design",
      "Cross-browser Compatibility",
    ];

    const filteredSkills = commonSkills
      .filter((skill) => skill.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);

    // If we have at least 5 matches from common skills, just return those
    if (filteredSkills.length >= 5) {
      return new Response(JSON.stringify({ skills: filteredSkills }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise, also search for skills in the database
    // This assumes you have a 'skills' table or a way to query unique skills from projects
    const { data, error } = await supabase
      .from("projects")
      .select("skills")
      .limit(100);

    if (error) {
      console.error("Error fetching skills from database:", error);
      // If DB query fails, just return what we have from common skills
      return new Response(JSON.stringify({ skills: filteredSkills }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract unique skills from projects
    const uniqueSkills = new Set();

    // Add skills from projects
    data.forEach((project) => {
      if (project.skills && Array.isArray(project.skills)) {
        project.skills.forEach((skill) => {
          if (skill.toLowerCase().includes(query.toLowerCase())) {
            uniqueSkills.add(skill);
          }
        });
      }
    });

    // Combine with our filtered common skills
    filteredSkills.forEach((skill) => uniqueSkills.add(skill));

    // Convert set to array and limit to 10 results
    const results = Array.from(uniqueSkills).slice(0, 10);

    return new Response(JSON.stringify({ skills: results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching skill suggestions:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
