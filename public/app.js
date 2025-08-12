const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
const pct = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const form = document.getElementById("calc-form");
const priceEl = document.getElementById("price");
const discountEl = document.getElementById("discount");
const modeEl = document.getElementById("mode");
const resultEl = document.getElementById("result");
const discountAmountEl = document.getElementById("discountAmount");
const discountPercentEl = document.getElementById("discountPercent");
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
    try { data = await res.json(); }
    catch { alert("Server returned invalid JSON."); return; }

    if (!res.ok) { alert(data.error || "Request failed"); return; }

    discountAmountEl.textContent = fmt.format(data.output.discountAmount);
    discountPercentEl.textContent = pct.format(data.output.discountPercent) + "%";
    finalPriceEl.textContent = fmt.format(data.output.finalPrice);
    resultEl.classList.remove("hidden");
    resultEl.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    console.error("Request failed:", err);
    alert("Could not reach the server.");
  }
});
