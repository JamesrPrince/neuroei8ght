#!/usr/bin/env node

/**
 * This script helps set up the environment variables for the NeuroEi8gt application.
 * It guides you through configuring Supabase credentials and saves them to your .env file.
 */

import * as fs from "fs";
import * as readline from "readline";

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("NeuroEi8gt Environment Setup\n");
console.log("This script will help you set up your Supabase credentials.");
console.log(
  "You can find these in your Supabase dashboard under Project Settings > API.\n"
);

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  // Get current env content for reference
  let envContent = "";
  try {
    envContent = fs.readFileSync(".env", "utf8");
  } catch (error) {
    console.log("No .env file found. Creating a new one...");
    envContent = `# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Stripe Configuration
PUBLIC_STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key`;
  }

  console.log("\nEnter your Supabase project details:");

  const supabaseUrl = await askQuestion("Supabase Project URL: ");
  const supabaseKey = await askQuestion("Supabase Anon/Public Key: ");

  // Replace values in the env content
  envContent = envContent
    .replace(/SUPABASE_URL=.*/, `SUPABASE_URL=${supabaseUrl}`)
    .replace(/SUPABASE_KEY=.*/, `SUPABASE_KEY=${supabaseKey}`);

  // Save the updated content to .env
  fs.writeFileSync(".env", envContent);

  console.log("\nEnvironment variables saved to .env file.");
  console.log("You can now restart your development server.");

  rl.close();
}

main().catch((err) => {
  console.error("Error:", err);
  rl.close();
});
