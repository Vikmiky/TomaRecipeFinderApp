// ── Check login and show username ──
window.onload = function() {

  // get logged in user from localStorage
  const loggedIn = JSON.parse(localStorage.getItem("tomaLoggedIn"));

  // if not logged in send back to login page
  if (!loggedIn) {
    window.location.href = "login.html";
    return;
  }

  // get just the first name
  const firstName = loggedIn.name.split(" ")[0];

  // display the name
  document.getElementById("userName").textContent = firstName;
};

// ── Logout ──
function logout() {
  localStorage.removeItem("tomaLoggedIn");
  window.location.href = "login.html";
}

// ── Store current search results ──
let currentResults = [];

// ── SEARCH RECIPES ──
async function searchRecipes() {
  const input = document.getElementById("searchInput").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // validate input
  if (input === "") {
    errorMsg.textContent = "Please enter a recipe name to search!";
    return;
  }

  errorMsg.textContent = "";

  // show loading
  showLoading();

  try {
    // fetch from TheMealDB API
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(input)}`
    );

    const data = await response.json();

    // hide loading
    hideLoading();

    // if no results found
    if (!data.meals) {
      showEmpty(input);
      return;
    }

    // save results and display them
    currentResults = data.meals;
    showRecipeCards(data.meals);

  } catch (error) {
    hideLoading();
    errorMsg.textContent = "Something went wrong. Please try again.";
    console.log(error);
  }
}

// ── SHOW RECIPE CARDS ──
function showRecipeCards(meals) {
  const grid = document.getElementById("recipesGrid");
  const detail = document.getElementById("recipeDetail");

  // hide detail view show grid
  detail.style.display = "none";
  grid.style.display = "grid";

  // clear previous results
  grid.innerHTML = "";

  // loop through each meal and create a card
  meals.forEach(function(meal) {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="card-info">
        <h3>${meal.strMeal}</h3>
        <div class="card-tags">
          <span class="tag tag-category">${meal.strCategory}</span>
          <span class="tag tag-area">${meal.strArea}</span>
        </div>
      </div>
    `;

    // when card is clicked show full details
    card.onclick = () => showRecipeDetail(meal);

    grid.appendChild(card);
  });
}

// ── SHOW RECIPE DETAIL ──
function showRecipeDetail(meal) {
  const grid = document.getElementById("recipesGrid");
  const detail = document.getElementById("recipeDetail");
  const detailContent = document.getElementById("detailContent");

  // hide grid show detail
  grid.style.display = "none";
  detail.style.display = "block";

  // scroll to top
  window.scrollTo(0, 0);

  // get all ingredients — TheMealDB stores them as
  // strIngredient1, strIngredient2... up to 20
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    // only add if ingredient exists and is not empty
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure} ${ingredient}`.trim());
    }
  }

  // build the detail view
  detailContent.innerHTML = `
    <img
      class="detail-image"
      src="${meal.strMealThumb}"
      alt="${meal.strMeal}"
    />

    <h2 class="detail-title">${meal.strMeal}</h2>

    <div class="detail-tags">
      <span class="tag tag-category">${meal.strCategory}</span>
      <span class="tag tag-area">${meal.strArea} Cuisine</span>
    </div>

    <div class="detail-section">
      <h3>🥘 Ingredients</h3>
      <ul class="ingredients-list">
        ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
      </ul>
    </div>

    <div class="detail-section">
      <h3>📋 Instructions</h3>
      <p class="instructions">${meal.strInstructions}</p>
    </div>
  `;
}

// ── GO BACK TO RESULTS ──
function goBack() {
  const grid = document.getElementById("recipesGrid");
  const detail = document.getElementById("recipeDetail");

  detail.style.display = "none";
  grid.style.display = "grid";

  window.scrollTo(0, 0);
}

// ── SHOW LOADING ──
function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("recipesGrid").innerHTML = "";
  document.getElementById("recipeDetail").style.display = "none";
}

// ── HIDE LOADING ──
function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

// ── SHOW EMPTY STATE ──
function showEmpty(query) {
  const grid = document.getElementById("recipesGrid");
  grid.innerHTML = `
    <div class="empty-state">
      <p>😕 No recipes found for "<strong>${query}</strong>"</p>
      <p>Try searching for "Chicken", "Pasta" or "Rice"</p>
    </div>
  `;
}

// ── SEARCH ON ENTER KEY ──
document.getElementById("searchInput")
  .addEventListener("keypress", function(e) {
    if (e.key === "Enter") searchRecipes();
  });