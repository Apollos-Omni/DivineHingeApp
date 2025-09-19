import { z } from "zod";

export const Config = z.object({
  openaiApiKey: z.string().min(1),
  githubToken: z.string().min(1),
  repoOwner: z.string().min(1),
  repoName: z.string().min(1),
  repoLocalPath: z.string().min(1),
  defaultBranch: z.string().default("main"),
  supabaseUrl: z.string().min(1),
  supabaseAnonKey: z.string().min(1),
  supabaseServiceRole: z.string().optional(),

  // Optional MCP endpoints
  mcpGithubBaseUrl: z.string().optional(),
  mcpGithubAccessToken: z.string().optional(),
  mcpSupabaseServerUrl: z.string().optional(),
  mcpSupabaseApiKey: z.string().optional(),
});

export type AppConfig = z.infer<typeof Config>;

export function readConfig(): AppConfig {
  const get = (k: string) => process.env[k] || "";
  const cfg = {
    openaiApiKey: get("OPENAI_API_KEY"),
    githubToken: get("GITHUB_TOKEN"),
    repoOwner: get("GITHUB_REPO_OWNER"),
    repoName: get("GITHUB_REPO_NAME"),
    repoLocalPath: get("REPO_LOCAL_PATH"),
    defaultBranch: get("DEFAULT_BRANCH") || "main",
    supabaseUrl: get("SUPABASE_URL"),
    supabaseAnonKey: get("SUPABASE_ANON_KEY"),
    supabaseServiceRole: get("SUPABASE_SERVICE_ROLE") || undefined,
    mcpGithubBaseUrl: get("MCP_GITHUB_BASE_URL") || undefined,
    mcpGithubAccessToken: get("MCP_GITHUB_ACCESS_TOKEN") || undefined,
    mcpSupabaseServerUrl: get("MCP_SUPABASE_SERVER_URL") || undefined,
    mcpSupabaseApiKey: get("MCP_SUPABASE_API_KEY") || undefined,
  };
  return Config.parse(cfg);
}
