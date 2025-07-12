const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.value = currCode;
    newOption.innerText = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.appendChild(newOption);
  }
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const baseCurrency = fromCurr.value;
  const targetCurrency = toCurr.value;

  const URL = `https://open.er-api.com/v6/latest/${baseCurrency}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();
    if (data.result !== "success") {
      throw new Error("Failed to get exchange rate");
    }
    const rate = data.rates[targetCurrency];
    const finalAmount = (rate * amtVal).toFixed(2);
    msg.innerText = `${amtVal} ${baseCurrency} = ${finalAmount} ${targetCurrency}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate.";
  }
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
