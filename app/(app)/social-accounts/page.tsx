"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Twitter, Instagram, Facebook, Linkedin, Globe } from "lucide-react";
import { adtaskRequest, type BasicAuth } from "@/lib/adtaskClient";

async function getBearerToken(
  username: string,
  password: string,
): Promise<string> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const response = await fetch("/api/adtask/api/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get access token");
  }

  const data = await response.json();
  return data.access_token;
}
import { useToast } from "@/hooks/use-toast";

type Platform =
  | "twitter"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "reddit"
  | "other";

type ConnectedAccount = {
  id: string;
  platform: Platform;
  username: string;
  label?: string;
};

type AuthMode = "basic" | "bearer";
type StoredAuth = (BasicAuth & { mode: AuthMode; token?: string }) | null;

export default function SocialAccountsPage() {
  const [auth, setAuth] = useState<StoredAuth>(null);
  const [connected, setConnected] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [credStatus, setCredStatus] = useState<"unknown" | "ok" | "invalid">(
    "unknown",
  );
  const { toast } = useToast();

  // Helper functions for storing multiple Reddit accounts
  const getStoredRedditAccounts = (): ConnectedAccount[] => {
    try {
      const stored = localStorage.getItem("reddit_accounts");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Failed to load stored Reddit accounts:", e);
      return [];
    }
  };

  const storeRedditAccount = (account: ConnectedAccount) => {
    try {
      const existing = getStoredRedditAccounts();
      // Check if account already exists (by username, not just ID)
      const existingIndex = existing.findIndex(a => a.username === account.username);
      if (existingIndex >= 0) {
        // Update existing account
        existing[existingIndex] = account;
      } else {
        // Add new account
        existing.push(account);
      }
      localStorage.setItem("reddit_accounts", JSON.stringify(existing));
      console.log("Stored Reddit account:", account.username);
    } catch (e) {
      console.warn("Failed to store Reddit account:", e);
    }
  };

  const removeStoredRedditAccount = (accountId: string) => {
    try {
      const existing = getStoredRedditAccounts();
      const updated = existing.filter(a => a.id !== accountId);
      localStorage.setItem("reddit_accounts", JSON.stringify(updated));
      console.log("Removed Reddit account:", accountId);
    } catch (e) {
      console.warn("Failed to remove Reddit account:", e);
    }
  };

  const clearAllStoredRedditAccounts = () => {
    try {
      localStorage.removeItem("reddit_accounts");
      setConnected([]);
      console.log("Cleared all stored Reddit accounts");
      toast({
        title: "Accounts Cleared",
        description: "All stored Reddit accounts have been cleared",
      });
    } catch (e) {
      console.warn("Failed to clear stored Reddit accounts:", e);
    }
  };

  // Persist auth in session (ephemeral for demo)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("adtask_auth");
      if (raw) setAuth(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    if (auth) sessionStorage.setItem("adtask_auth", JSON.stringify(auth));
  }, [auth]);

  const services = useMemo(
    () => [
      { key: "reddit" as Platform, name: "Reddit", icon: Globe },
      { key: "twitter" as Platform, name: "Twitter/X", icon: Twitter },
      { key: "instagram" as Platform, name: "Instagram", icon: Instagram },
      { key: "facebook" as Platform, name: "Facebook", icon: Facebook },
      { key: "linkedin" as Platform, name: "LinkedIn", icon: Linkedin },
    ],
    [],
  );

  async function fetchConnected() {
    if (!auth) return;
    try {
      setLoading(true);
      
      // Check for stored multiple accounts first
      const storedAccounts = getStoredRedditAccounts();
      console.log("Stored Reddit accounts:", storedAccounts);
      
      // Use ADTASK reddit oauth status endpoint
      const data = await adtaskRequest<{ connected?: boolean; accounts?: ConnectedAccount[]; reddit?: { username?: string }; reddit_username?: string | null; reddit_user_id?: string | number | null; reddit_accounts?: { username: string; id?: string | number }[] }>({ path: "api/reddit-oauth/status", authorization: auth?.mode === "bearer" && auth?.token ? `Bearer ${auth.token}` : undefined, bearer: auth?.mode === "bearer" && auth?.token ? { token: auth.token } : undefined })
      
      // Debug: Log the actual response data
      console.log("Reddit OAuth Status Response:", data);
      
      if (Array.isArray(data.accounts)) {
        console.log("Found accounts array:", data.accounts);
        setConnected(data.accounts)
      } else if (Array.isArray(data.reddit_accounts) && data.reddit_accounts.length > 0) {
        console.log("Found reddit_accounts array:", data.reddit_accounts);
        setConnected(
          data.reddit_accounts.map((a) => ({ id: String(a.id ?? a.username), platform: "reddit" as const, username: a.username }))
        )
      } else if (data?.reddit?.username) {
        console.log("Found reddit.username:", data.reddit.username);
        setConnected([{ id: data.reddit.username!, platform: "reddit", username: data.reddit.username! }])
      } else if (data?.connected && data?.reddit_username) {
        console.log("Found connected + reddit_username:", data.connected, data.reddit_username);
        setConnected([{ id: String(data.reddit_user_id ?? data.reddit_username), platform: "reddit", username: data.reddit_username }])
      } else if (data?.reddit_username && (data?.has_refresh_token || data?.token_expires_at)) {
        // Handle case where connected=false but we have username and token info
        console.log("Found reddit_username with token info:", data.reddit_username, "has_refresh_token:", data.has_refresh_token);
        const currentAccount = { id: String(data.reddit_user_id ?? data.reddit_username), platform: "reddit" as const, username: data.reddit_username };
        storeRedditAccount(currentAccount);
        
        // Always show all stored accounts (including the current one)
        const updatedStoredAccounts = getStoredRedditAccounts();
        setConnected(updatedStoredAccounts);
      } else if (data?.username) {
        // Handle case where response has direct username field
        console.log("Found direct username:", data.username);
        setConnected([{ id: data.username, platform: "reddit", username: data.username }])
      } else if (data?.user?.username) {
        // Handle case where response has user.username field
        console.log("Found user.username:", data.user.username);
        setConnected([{ id: data.user.username, platform: "reddit", username: data.user.username }])
      } else if (data?.data?.username) {
        // Handle case where response has data.username field
        console.log("Found data.username:", data.data.username);
        setConnected([{ id: data.data.username, platform: "reddit", username: data.data.username }])
      } else {
        console.log("No matching data structure found");
        console.log("Available data fields:", Object.keys(data || {}));
        // Show stored accounts even if no current account is found
        if (storedAccounts.length > 0) {
          console.log("Showing stored accounts:", storedAccounts);
          setConnected(storedAccounts);
        } else {
          setConnected([]);
        }
      }
      setCredStatus("ok")
    } catch (e) {
      console.error("Error fetching connected accounts:", e)
      setCredStatus("invalid")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (
        typeof e.data === "object" &&
        e.data &&
        e.data.type === "reddit_oauth_done"
      ) {
        console.log("Reddit OAuth completed:", e.data.ok);
        if (e.data.ok) {
          // OAuth was successful, fetch the new account info
          setTimeout(async () => {
            try {
              // Fetch the new account info from ADTASK
              const data = await adtaskRequest<{ connected?: boolean; accounts?: ConnectedAccount[]; reddit?: { username?: string }; reddit_username?: string | null; reddit_user_id?: string | number | null; reddit_accounts?: { username: string; id?: string | number }[] }>({ path: "api/reddit-oauth/status", authorization: auth?.mode === "bearer" && auth?.token ? `Bearer ${auth.token}` : undefined, bearer: auth?.mode === "bearer" && auth?.token ? { token: auth.token } : undefined })
              
              console.log("New OAuth account data:", data);
              
              // Store the new account if we found one
              if (data?.reddit_username && (data?.has_refresh_token || data?.token_expires_at)) {
                const newAccount = { 
                  id: String(data.reddit_user_id ?? data.reddit_username), 
                  platform: "reddit" as const, 
                  username: data.reddit_username 
                };
                storeRedditAccount(newAccount);
                console.log("Stored new Reddit account:", newAccount.username);
                
                // Show success message
                toast({
                  title: "Reddit Account Connected",
                  description: `Successfully connected Reddit account: ${newAccount.username}`,
                });
              }
              
              // Refresh the connected accounts display
              fetchConnected();
            } catch (error) {
              console.error("Error fetching new account after OAuth:", error);
              fetchConnected(); // Still try to refresh
            }
          }, 2000); // Give ADTASK more time to process the OAuth
        }
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [auth]);


  return (
    <div className="space-y-6">
      <CredentialsDialog
        auth={auth}
        onSave={(a) => {
          setAuth(a);
          setCredStatus("unknown");
        }}
      />

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Connected Accounts</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllStoredRedditAccounts}
              disabled={!auth || loading}
            >
              Clear All
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchConnected}
              disabled={!auth || loading}
            >
              Refresh
            </Button>
          </div>
        </div>
        {auth && (
          <p className="text-xs text-muted-foreground">
            Auth mode:{" "}
            <span className="font-medium capitalize">{auth.mode}</span>
            {auth.username ? ` for ${auth.username}` : ""} —{" "}
            {credStatus === "ok"
              ? "OK"
              : credStatus === "invalid"
                ? "Invalid (401)"
                : "Unknown"}
          </p>
        )}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {connected.length === 0 && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">
                  No accounts connected
                </CardTitle>
                <CardDescription>
                  Use Connect below after setting credentials
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          {connected.map((acct) => {
            const Icon =
              services.find((s) => s.key === acct.platform)?.icon ||
              (Globe as unknown as React.ComponentType<{
                className?: string;
                "aria-hidden"?: boolean;
              }>);
            return (
              <Card key={`${acct.platform}:${acct.id}`} className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{acct.username}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-foreground capitalize"
                      >
                        {acct.platform}
                      </Badge>
                      {acct.label && <span>{acct.label}</span>}
                    </CardDescription>
                  </div>
                  <Icon className="size-5 text-muted-foreground" aria-hidden />
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Connect Accounts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ key, name, icon: Icon }) => {
            const alreadyConnectedCount = connected.filter(
              (a) => a.platform === key,
            ).length;
            const isConnected = alreadyConnectedCount > 0;
            return (
              <Card key={key} className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{name}</CardTitle>
                    <CardDescription>
                      {isConnected
                        ? `${alreadyConnectedCount} connected`
                        : "Multiple accounts supported"}
                    </CardDescription>
                  </div>
                  <Icon className="size-5 text-muted-foreground" aria-hidden />
                </CardHeader>
                <CardContent>
                  {key === "reddit" ? (
                    <RedditOAuthButton
                      auth={auth}
                      label={
                        isConnected
                          ? "Connect another"
                          : auth
                            ? "Connect via Reddit OAuth"
                            : "Login"
                      }
                    />
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      Coming soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CredentialsDialog({
  auth,
  onSave,
}: {
  auth: StoredAuth;
  onSave: (a: StoredAuth) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>(auth?.mode ?? "basic");
  const [username, setUsername] = useState(auth?.username ?? "");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(auth?.token ?? "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function save() {
    if (mode === "basic") {
      if (!username || !password) return;
      try {
        setLoading(true);
        const accessToken = await getBearerToken(username, password);
        onSave({ mode: "bearer", username, password, token: accessToken });
        toast({
          title: "Credentials saved",
          description: "Successfully authenticated with ADTASK",
        });
      } catch (error) {
        toast({
          title: "Authentication failed",
          description:
            error instanceof Error ? error.message : "Invalid credentials",
        });
        return;
      } finally {
        setLoading(false);
      }
    } else {
      if (!token) return;
      onSave({ mode, username: "", password: "", token });
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Provide ADTASK credentials
        </p>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            Set Credentials
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ADTASK API Credentials</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="adtask-mode">Auth Mode</Label>
            <select
              id="adtask-mode"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              value={mode}
              onChange={(e) => setMode(e.target.value as AuthMode)}
            >
              <option value="basic">Basic (username + password)</option>
              <option value="bearer">Bearer (token)</option>
            </select>
          </div>
          {mode === "basic" ? (
            <>
              <div className="space-y-1">
                <Label htmlFor="adtask-username">Username</Label>
                <Input
                  id="adtask-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="adtask-password">Password</Label>
                <Input
                  id="adtask-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <Label htmlFor="adtask-token">Bearer Token</Label>
              <Input
                id="adtask-token"
                placeholder="Paste ADTASK token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={save} disabled={loading}>
              {loading ? "Authenticating..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RedditOAuthButton({
  auth,
  label = "Connect via Reddit OAuth",
}: {
  auth: StoredAuth;
  label?: string;
}) {
  const [starting, setStarting] = useState(false);
  const { toast } = useToast();

  async function start() {
    if (!auth) {
      // Redirect to ADTASK signup page, which will redirect to login after signup
      window.open("https://adtask.ai/api/auth/signup", "_blank");
      return;
    }

    try {
      setStarting(true);
      let res = await fetch("/api/reddit/oauth/start", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: adtaskAuthHeader(auth),
        },
      });
      if (!res.ok) {
        // fallback to GET
        res = await fetch("/api/reddit/oauth/start", {
          method: "GET",
          headers: {
            authorization: adtaskAuthHeader(auth),
          },
        });
      }
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        /* non-json */
      }
      if (!res.ok)
        throw new Error(
          data?.error || data?.message || text || "Failed to start OAuth",
        );
      let url = data?.authorizationUrl || data?.url || data?.auth_url;
      if (url) {
        try {
          const u = new URL(url);
          // Debug: log the redirect the backend returned and what the client would use
          const returned = u.searchParams.get("redirect_uri");
          const desired = `${window.location.origin}/social-accounts/reddit-callback`;
          console.log(
            "[reddit oauth] authorizationUrl returned by backend:",
            url,
          );
          console.log("[reddit oauth] backend redirect_uri:", returned);
          console.log("[reddit oauth] client desired redirect_uri:", desired);
          // Do not override the backend's redirect_uri here — let the backend (ADTASK) control it.
          // Overriding can cause an "invalid redirect_uri" if ADTASK's Reddit app was configured
          // with a different redirect. If you want to always force the client origin, enable
          // that behavior explicitly after confirming the Reddit app settings.
          // url = u.toString()
        } catch (e) {
          console.warn("[reddit oauth] failed to parse authorization URL", e);
        }
        const w = window.open(url, "reddit-oauth", "width=720,height=900");
        if (!w)
          throw new Error("Popup blocked. Please allow popups for this site.");
      } else throw new Error("Authorization URL missing in response");
    } catch (e) {
      console.error(e);
      toast({
        title: "Reddit OAuth failed",
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setStarting(false);
    }
  }

  return (
    <Button className="w-full" onClick={start} disabled={starting}>
      {starting ? "Redirecting..." : label}
    </Button>
  );
}

function adtaskAuthHeader(auth: StoredAuth) {
  if (!auth) return "";
  if (auth.mode === "bearer" && auth.token) return `Bearer ${auth.token}`;
  const encoded =
    typeof window !== "undefined" && window.btoa
      ? window.btoa(`${auth.username}:${auth.password}`)
      : "";
  return `Basic ${encoded}`;
}
