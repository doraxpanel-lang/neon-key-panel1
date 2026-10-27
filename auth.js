
import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

// Replace both values with your Supabase project details.
const SUPABASE_URL = "https://afnhnbqywqllsestluke.supabase.co";
const SUPABASE_KEY = "sb_publishable_PLpY-xFVnPg-nmonpiqdXw_CPf84kr8";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const $ = id => document.getElementById(id);

let mode = "login";

function showMessage(text) {
  $("authMessage").textContent = text;
}

function setMode(next) {
  mode = next;
  const signup = mode === "signup";

  $("authUsername").hidden = !signup;
  $("authUsername").required = signup;
  $("authPassword").autocomplete =
    signup ? "new-password" : "current-password";

  $("authSubtitle").textContent =
    signup ? "CREATE YOUR ACCOUNT" : "AUTHORIZE ACCESS";

  $("authSubmit").textContent =
    signup ? "CREATE ACCOUNT" : "LOGIN NOW";

  $("authSwitch").textContent =
    signup ? "Already registered? Login" :
             "New User? Create Account";

  showMessage("");
}

$("authSwitch").addEventListener("click", () => {
  setMode(mode === "login" ? "signup" : "login");
});

$("authForm").addEventListener("submit", async event => {
  event.preventDefault();

  const button = $("authSubmit");
  button.disabled = true;
  showMessage("Please wait...");

  try {
    const email = $("authEmail").value.trim();
    const password = $("authPassword").value;

    if (mode === "signup") {
      const username = $("authUsername").value.trim();

      if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
        throw new Error(
          "Use 3–24 letters, numbers or underscores for your username."
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      if (data.session) {
        showMessage("Account created!");
      } else {
        showMessage("Check your email to confirm your account.");
      }
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      showMessage("Login successful!");
    }
  } catch (error) {
    showMessage(error.message || "Authentication failed.");
  } finally {
    button.disabled = false;
  }
});

$("authForgot").addEventListener("click", async () => {
  const email = $("authEmail").value.trim();

  if (!email) {
    showMessage("Enter your email address first.");
    return;
  }

  const { error } =
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });

  showMessage(
    error ? error.message : "Check your email for a reset link."
  );
});

async function refreshSession() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    showMessage(error.message);
    return;
  }

  const user = data.user;
  const screen = $("authScreen");

  if (user) {
    document.body.classList.add("authenticated");
    screen.hidden = true;

    let logout = document.getElementById("lokiLogout");

    if (!logout) {
      logout = document.createElement("button");
      logout.id = "lokiLogout";
      logout.textContent = "Logout";
      logout.className = "ghost";
      document.querySelector("header").appendChild(logout);

      logout.addEventListener("click", async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          alert(error.message);
        } else {
          location.reload();
        }
      });
    }
  } else {
    document.body.classList.remove("authenticated");
    screen.hidden = false;
  }
}

supabase.auth.onAuthStateChange((event) => {
  if (event === "INITIAL_SESSION" ||
      event === "SIGNED_IN" ||
      event === "SIGNED_OUT") {
    refreshSession();
  }
});

refreshSession();
