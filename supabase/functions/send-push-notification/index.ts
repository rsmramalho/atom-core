import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Web Push using raw crypto (no npm:web-push needed in Deno).
 * Implements the VAPID + Web Push encryption protocol.
 */

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function concatBuffers(...buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const b of buffers) {
    result.set(b, offset);
    offset += b.length;
  }
  return result;
}

function createInfo(type: string, clientPublicKey: Uint8Array, serverPublicKey: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const typeBytes = encoder.encode(type);
  const header = encoder.encode("Content-Encoding: ");
  const nul = new Uint8Array([0]);
  const preamble = encoder.encode("P-256");

  return concatBuffers(
    header,
    typeBytes,
    nul,
    preamble,
    nul,
    new Uint8Array([0, 65]),
    clientPublicKey,
    new Uint8Array([0, 65]),
    serverPublicKey
  );
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", ikm, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const prk = new Uint8Array(await crypto.subtle.sign("HMAC", key, salt));
  
  const prkKey = await crypto.subtle.importKey("raw", prk, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const infoWithCounter = concatBuffers(info, new Uint8Array([1]));
  const result = new Uint8Array(await crypto.subtle.sign("HMAC", prkKey, infoWithCounter));
  
  return result.slice(0, length);
}

async function encryptPayload(
  clientPublicKeyBytes: Uint8Array,
  clientAuthBytes: Uint8Array,
  payload: string
): Promise<{ ciphertext: Uint8Array; salt: Uint8Array; serverPublicKeyBytes: Uint8Array }> {
  // Generate a local ECDH key pair for encryption
  const serverKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const serverPublicKeyRaw = await crypto.subtle.exportKey("raw", serverKeys.publicKey);
  const serverPublicKeyBytes = new Uint8Array(serverPublicKeyRaw);

  // Import client public key
  const clientPublicKey = await crypto.subtle.importKey(
    "raw",
    clientPublicKeyBytes,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // ECDH shared secret
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: clientPublicKey }, serverKeys.privateKey, 256)
  );

  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF extract auth info
  const authInfo = new TextEncoder().encode("Content-Encoding: auth\0");
  const prk = await hkdf(clientAuthBytes, sharedSecret, authInfo, 32);

  // Derive content encryption key
  const cekInfo = createInfo("aesgcm", clientPublicKeyBytes, serverPublicKeyBytes);
  const contentEncryptionKey = await hkdf(salt, prk, cekInfo, 16);

  // Derive nonce
  const nonceInfo = createInfo("nonce", clientPublicKeyBytes, serverPublicKeyBytes);
  const nonce = await hkdf(salt, prk, nonceInfo, 12);

  // Encrypt
  const paddedPayload = concatBuffers(new Uint8Array([0, 0]), new TextEncoder().encode(payload));
  const aesKey = await crypto.subtle.importKey("raw", contentEncryptionKey, { name: "AES-GCM" }, false, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, paddedPayload);

  return { ciphertext: new Uint8Array(encrypted), salt, serverPublicKeyBytes };
}

async function createVapidAuthHeader(
  endpoint: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  subject: string
): Promise<{ authorization: string; cryptoKey: string }> {
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const header = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify({ aud: audience, exp: now + 86400, sub: subject }))
  );

  const unsignedToken = `${header}.${payload}`;

  // Import VAPID private key
  const privateKeyBytes = base64UrlDecode(vapidPrivateKey);
  const jwk = {
    kty: "EC",
    crv: "P-256",
    d: base64UrlEncode(privateKeyBytes),
    x: base64UrlEncode(base64UrlDecode(vapidPublicKey).slice(1, 33)),
    y: base64UrlEncode(base64UrlDecode(vapidPublicKey).slice(33, 65)),
  };

  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(unsignedToken)
  );

  // Convert DER signature to raw r||s
  const sigBytes = new Uint8Array(signature);
  const jwt = `${unsignedToken}.${base64UrlEncode(sigBytes)}`;

  return {
    authorization: `vapid t=${jwt}, k=${vapidPublicKey}`,
    cryptoKey: `p256ecdsa=${vapidPublicKey}`,
  };
}

async function sendPushToEndpoint(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payloadObj: { title: string; body: string; icon?: string; badge?: string; url?: string },
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<boolean> {
  const clientPublicKey = base64UrlDecode(subscription.p256dh);
  const clientAuth = base64UrlDecode(subscription.auth);
  const payloadStr = JSON.stringify(payloadObj);

  const { ciphertext, salt, serverPublicKeyBytes } = await encryptPayload(clientPublicKey, clientAuth, payloadStr);
  const { authorization, cryptoKey } = await createVapidAuthHeader(
    subscription.endpoint,
    vapidPublicKey,
    vapidPrivateKey,
    vapidSubject
  );

  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aesgcm",
      "Content-Length": String(ciphertext.length),
      Encryption: `salt=${base64UrlEncode(salt)}`,
      "Crypto-Key": `dh=${base64UrlEncode(serverPublicKeyBytes)};${cryptoKey}`,
      Authorization: authorization,
      TTL: "86400",
      Urgency: "normal",
    },
    body: ciphertext,
  });

  if (response.status === 410 || response.status === 404) {
    // Subscription expired or invalid
    return false;
  }

  return response.ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, title, body, url } = await req.json();

    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: "user_id, title, and body are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return new Response(JSON.stringify({ error: "VAPID keys not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No subscriptions found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const vapidSubject = "mailto:rr@atlasframes.com.au";
    const payloadObj = {
      title,
      body,
      icon: "/pwa-icons/icon-192x192.png",
      badge: "/pwa-icons/icon-96x96.png",
      url: url || "/",
    };

    let sent = 0;
    const expiredEndpoints: string[] = [];

    for (const sub of subscriptions) {
      const success = await sendPushToEndpoint(sub, payloadObj, vapidPublicKey, vapidPrivateKey, vapidSubject);
      if (success) {
        sent++;
      } else {
        expiredEndpoints.push(sub.endpoint);
      }
    }

    // Clean up expired subscriptions
    if (expiredEndpoints.length > 0) {
      await supabase.from("push_subscriptions").delete().in("endpoint", expiredEndpoints);
    }

    return new Response(
      JSON.stringify({ sent, expired: expiredEndpoints.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
