const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
const form = document.getElementById("calc-form");
const priceEl = document.getElementById("price");
const discountEl = document.getElementById("discount");
const modeEl = document.getElementById("mode");
const resultEl = document.getElementById("result");
const discountAmountEl = document.getElementById("discountAmount");
const finalPriceEl = document.getElementById("finalPrice");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const price = Number(priceEl.value);
    const discount = Number(discountEl.value);
    const mode = modeEl.value;

    const res = await fetch("/api/final-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price, discount, mode })
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Invalid JSON response", err);
      alert("Server returned invalid response.");
      return;
    }

    if (!res.ok) {
      console.error("API error:", data);
      alert(data.error || "Request failed");
      return;
    }

    discountAmountEl.textContent = fmt.format(data.output.discountAmount);
    finalPriceEl.textContent = fmt.format(data.output.finalPrice);
    resultEl.classList.remove("hidden");
    resultEl.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    console.error("Request failed:", err);
    alert("Could not reach the server. Is it running?");
  }
});
