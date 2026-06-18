const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let endpoint;

try {
  endpoint = new URL("/rest/v1/", supabaseUrl);
} catch {
  console.error("NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase project URL.");
  process.exit(1);
}

try {
  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!response.ok) {
    console.error(`Supabase connection failed with status ${response.status}.`);
    process.exit(1);
  }

  console.log("Supabase connection verified.");
} catch (error) {
  console.error("Supabase connection failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
