// ── Switch between login and signup tabs ──
function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotForm");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");

  // always hide forgot form when switching tabs
  forgotForm.style.display = "none";

  if (tab === "login") {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    loginTab.classList.remove("active");
    signupTab.classList.add("active");
  }
}

// ── Handle Login ──
function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const errorMsg = document.getElementById("loginError");

  // clear previous error
  errorMsg.textContent = "";

  // validate fields
  if (email === "") {
    errorMsg.textContent = "Please enter your email!";
    return;
  }

  if (!email.includes("@")) {
    errorMsg.textContent = "Please enter a valid email!";
    return;
  }

  if (password === "") {
    errorMsg.textContent = "Please enter your password!";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters!";
    return;
  }

  // check if user exists in localStorage
  const savedUser = JSON.parse(localStorage.getItem("tomaUser"));

  if (!savedUser) {
    errorMsg.textContent = "No account found! Please sign up first.";
    return;
  }

  if (savedUser.email !== email || savedUser.password !== password) {
    errorMsg.textContent = "Wrong email or password!";
    return;
  }

  // save logged in user session
  localStorage.setItem("tomaLoggedIn", JSON.stringify({
    name: savedUser.name,
    email: savedUser.email
  }));

  // go to recipes page
  window.location.href = "recipe.html";
}

// ── Handle Sign Up ──
function handleSignup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirm = document.getElementById("signupConfirm").value.trim();
  const errorMsg = document.getElementById("signupError");
  const successMsg = document.getElementById("signupSuccess");

  // clear messages
  errorMsg.textContent = "";
  successMsg.textContent = "";

  // validate
  if (name === "") {
    errorMsg.textContent = "Please enter your full name!";
    return;
  }

  if (email === "") {
    errorMsg.textContent = "Please enter your email!";
    return;
  }

  if (!email.includes("@")) {
    errorMsg.textContent = "Please enter a valid email!";
    return;
  }

  if (password === "") {
    errorMsg.textContent = "Please enter a password!";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters!";
    return;
  }

  if (password !== confirm) {
    errorMsg.textContent = "Passwords do not match!";
    return;
  }

  // save user to localStorage
  const user = { name, email, password };
  localStorage.setItem("tomaUser", JSON.stringify(user));

  // show success then switch to login
  successMsg.textContent = "Account created! Please login 🎉";

  setTimeout(() => {
    switchTab("login");
    document.getElementById("loginEmail").value = email;
  }, 1500);
}

// ── Check if already logged in ──


// ── Show forgot password form ──
function showForgotPassword() {
  const loginForm = document.getElementById("loginForm");
  const forgotForm = document.getElementById("forgotForm");
  const signupForm = document.getElementById("signupForm");

  // hide all forms
  loginForm.style.display = "none";
  signupForm.style.display = "none";

  // show forgot form
  forgotForm.style.display = "block";

  // reset the form back to step 1
  document.getElementById("forgotStep1").style.display = "block";
  document.getElementById("forgotStep2").style.display = "none";
  document.getElementById("forgotEmail").value = "";
  document.getElementById("forgotError").textContent = "";
}

// ── Step 1 — Check if email exists ──
function checkForgotEmail() {
  const email = document.getElementById("forgotEmail").value.trim();
  const errorMsg = document.getElementById("forgotError");

  errorMsg.textContent = "";

  // validate email
  if (email === "") {
    errorMsg.textContent = "Please enter your email!";
    return;
  }

  if (!email.includes("@")) {
    errorMsg.textContent = "Please enter a valid email!";
    return;
  }

  // check if account exists
  const savedUser = JSON.parse(localStorage.getItem("tomaUser"));

  if (!savedUser || savedUser.email !== email) {
    errorMsg.textContent = "No account found with this email!";
    return;
  }

  // email found — show step 2
  document.getElementById("forgotStep1").style.display = "none";
  document.getElementById("forgotStep2").style.display = "block";
}

// ── Step 2 — Reset the password ──
function resetPassword() {
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmNew = document.getElementById("confirmNewPassword").value.trim();
  const errorMsg = document.getElementById("forgotError2");
  const successMsg = document.getElementById("forgotSuccess");

  errorMsg.textContent = "";
  successMsg.textContent = "";

  // validate
  if (newPassword === "") {
    errorMsg.textContent = "Please enter a new password!";
    return;
  }

  if (newPassword.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters!";
    return;
  }

  if (newPassword !== confirmNew) {
    errorMsg.textContent = "Passwords do not match!";
    return;
  }

  // update password in localStorage
  const savedUser = JSON.parse(localStorage.getItem("tomaUser"));
  savedUser.password = newPassword;
  localStorage.setItem("tomaUser", JSON.stringify(savedUser));

  // show success message
  successMsg.textContent = "Password reset successfully! 🎉";

  // go back to login after 2 seconds
  setTimeout(() => {
    switchTab("login");
    document.getElementById("forgotForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  }, 2000);
}


