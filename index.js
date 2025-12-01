// url is set to load only LA breweries
const API_URL =
  "https://api.openbrewerydb.org/v1/breweries?by_city=los_angeles&by_state=california&per_page=50";

const messageArea = document.getElementById("messageArea");
const resultsContainer = document.getElementById("resultsContainer");

// grab spring from popmotion
const { spring } = window.popmotion || {};

async function fetchBreweriesInLA() {
  messageArea.textContent = "Loading breweries in Los Angeles...";
  resultsContainer.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const breweries = await response.json();

    if (!breweries || breweries.length === 0) {
      messageArea.textContent = "No breweries found in Los Angeles.";
      return;
    }

    messageArea.textContent = `Found ${breweries.length} breweries in Los Angeles.`;

    breweries.forEach((brewery, index) => {
      const card = document.createElement("div");
      card.className = "brewery-card";

      const name = document.createElement("h2");
      name.textContent = brewery.name || "Unnamed Brewery";

      const type = document.createElement("p");
      type.textContent = brewery.brewery_type
        ? `Type: ${brewery.brewery_type}`
        : "Type: N/A";

      const addressLines = [];
      if (brewery.street) addressLines.push(brewery.street);
      const cityStateZip = [
        brewery.city,
        brewery.state,
        brewery.postal_code,
      ]
        .filter(Boolean)
        .join(", ");
      if (cityStateZip) addressLines.push(cityStateZip);

      const address = document.createElement("p");
      address.textContent =
        addressLines.length > 0
          ? addressLines.join(" • ")
          : "Address: N/A";

      const website = document.createElement("p");
      if (brewery.website_url) {
        const link = document.createElement("a");
        link.href = brewery.website_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Visit website";
        website.appendChild(link);
      } else {
        website.textContent = "Website: N/A";
      }

      card.appendChild(name);
      card.appendChild(type);
      card.appendChild(address);
      card.appendChild(website);

      // initial state before animation
      card.style.transform = "translateY(40px)";
      card.style.opacity = "0";

      resultsContainer.appendChild(card);

      animateCardIn(card, index);
    });
  } catch (error) {
    console.error(error);
    messageArea.textContent =
      "Oops! Something went wrong while loading breweries.";
  }
}


// SPRING ANIMATION
function animateCardIn(card, index) {
  if (!spring) {
    console.warn("Popmotion spring not available");
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
    return;
  }

  const delay = index * 80;

  setTimeout(() => {
    spring({
      from: 80,          // starting
      to: 0,             // end position
      stiffness: 30,    
      damping: 5,       
      mass: 1
    }).start(v => {
      card.style.transform = `translateY(${v}px)`;

      // fade in based on how close it is to 0
      const progress = 1 - Math.min(1, Math.abs(v) / 40);
      card.style.opacity = progress.toString();
    });
  }, delay);
}

document.addEventListener("DOMContentLoaded", fetchBreweriesInLA);

