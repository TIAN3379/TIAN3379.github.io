function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {})
    }
  });
}

function html(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });
}

function randomState() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

function parseCookies(request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").reduce((acc, item) => {
    const [rawKey, ...rawValue] = item.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
}

function popupPage(script) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Decap OAuth</title>
    <style>
      body {
        align-items: center;
        background: linear-gradient(180deg, #0c1417, #132127);
        color: #e9eadf;
        display: grid;
        font-family: system-ui, sans-serif;
        margin: 0;
        min-height: 100vh;
        place-items: center;
      }
      .panel {
        background: rgba(10, 17, 20, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        max-width: 520px;
        padding: 24px 28px;
        text-align: center;
      }
      p {
        color: rgba(233, 234, 223, 0.75);
        line-height: 1.7;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="panel">
      <p id="message">Authenticating with GitHub...</p>
    </div>
    <script>${script}</script>
  </body>
</html>`;
}

async function exchangeCodeForToken({ code, redirectUri, env }) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "tian3379-decap-oauth"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data.access_token;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return html("<!doctype html><html><body style='font-family:system-ui;background:#0c1417;color:#e9eadf'><p>Decap OAuth worker is running.</p></body></html>");
    }

    if (url.pathname === "/auth") {
      const state = randomState();
      const redirectUri = `${url.origin}/callback`;
      const authUrl = new URL("https://github.com/login/oauth/authorize");
      authUrl.searchParams.set("client_id", env.GITHUB_OAUTH_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", env.GITHUB_SCOPE || "public_repo,user");
      authUrl.searchParams.set("state", state);

      return new Response(null, {
        status: 302,
        headers: {
          location: authUrl.toString(),
          "set-cookie": `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
        }
      });
    }

    if (url.pathname === "/callback") {
      const cookies = parseCookies(request);
      const expectedState = cookies.decap_oauth_state;
      const receivedState = url.searchParams.get("state");
      const code = url.searchParams.get("code");

      if (!code || !receivedState || !expectedState || expectedState !== receivedState) {
        return html(
          popupPage(`
            document.getElementById("message").textContent = "OAuth state validation failed.";
            if (window.opener) {
              window.opener.postMessage("authorizing:github", "*");
              window.addEventListener("message", event => {
                window.opener.postMessage("authorization:github:error:State validation failed", event.origin);
                window.close();
              }, { once: true });
            }
          `),
          { status: 400 }
        );
      }

      try {
        const token = await exchangeCodeForToken({
          code,
          redirectUri: `${url.origin}/callback`,
          env
        });

        const payload = JSON.stringify({ token, provider: "github" });
        return html(
          popupPage(`
            const payload = ${JSON.stringify(`authorization:github:success:${payload}`)};
            document.getElementById("message").textContent = "Authenticated. Returning to CMS...";
            if (window.opener) {
              window.opener.postMessage("authorizing:github", "*");
              window.addEventListener("message", event => {
                window.opener.postMessage(payload, event.origin);
                window.close();
              }, { once: true });
            }
          `),
          {
            headers: {
              "set-cookie": "decap_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
            }
          }
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown OAuth error";
        return html(
          popupPage(`
            document.getElementById("message").textContent = ${JSON.stringify(message)};
            if (window.opener) {
              window.opener.postMessage("authorizing:github", "*");
              window.addEventListener("message", event => {
                window.opener.postMessage(${JSON.stringify(`authorization:github:error:${message}`)}, event.origin);
                window.close();
              }, { once: true });
            }
          `),
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/health") {
      return json({ ok: true, service: "decap-oauth-worker" });
    }

    return new Response("Not found", { status: 404 });
  }
};
