// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

async function fetchWeatherAlerts(state) {
    alertsDisplay.replaceChildren();

    try {
        const stateAbbr = state.trim().toUpperCase();

        if (!stateAbbr) {
            throw new Error("Please enter a state abbreviation, such as CA or NY.");
        }

        if (!/^[A-Z]{2}$/.test(stateAbbr)) {
            throw new Error("Please enter a valid 2-letter state abbreviation.");
        }

        const response = await fetch(`weatherApi{stateAbbr}`);

        if (!response.ok) {
            throw new Error(`Unable to fetch alerts right now (Error ${response.status}). Please try again later.`);
        }

        const data = await response.json();

        console.log(data);

        displayAlerts(data);

        stateInput.value = "";

        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");

    } catch (errorObject) {
        console.log(errorObject.message);

        errorMessage.textContent = errorObject.message;
        errorMessage.classList.remove("hidden");

        stateInput.value = "";
    }
}

function displayAlerts(data) {
    alertsDisplay.replaceChildren();

    const features = data.features || [];

    const summary = document.createElement("h2");
    summary.textContent = `Weather Alerts: ${features.length}`;
    alertsDisplay.appendChild(summary);

    if (features.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No active weather alerts found for this area.";
        alertsDisplay.appendChild(message);
        return;
    }

    const alertList = document.createElement("ul");

    features.forEach((alert) => {
        const listItem = document.createElement("li");

        listItem.textContent =
            alert.properties?.headline || "No headline provided for this alert";

        alertList.appendChild(listItem);
    });

    alertsDisplay.appendChild(alertList);
}

fetchButton.addEventListener("click", () => {
    fetchWeatherAlerts(stateInput.value);
});

stateInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        fetchWeatherAlerts(stateInput.value);
    }
});