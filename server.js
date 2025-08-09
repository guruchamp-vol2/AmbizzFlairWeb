import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "Ambizz Flair Pricer" });
});

/**
 * POST /api/final-price
 * Body: { price: number, discount: number, mode: "percent" | "flat" }
 */
app.post("/api/final-price", (req, res) => {
  try {
    let { price, discount, mode } = req.body || {};

    // Normalize inputs
    price = Number(price);
    discount = Number(discount);
    mode = (mode || "percent").toLowerCase();

    // Validate
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ error: "Invalid 'price'. Must be a number >= 0." });
    }
    if (!Number.isFinite(discount) || discount < 0) {
      return res.status(400).json({ error: "Invalid 'discount'. Must be a number >= 0." });
    }
    if (!["percent", "flat"].includes(mode)) {
      return res.status(400).json({ error: "Invalid 'mode'. Use 'percent' or 'flat'." });
    }
    if (mode === "percent" && discount > 100) {
      return res.status(400).json({ error: "Percent discount cannot exceed 100." });
    }

    const discountAmount = mode === "percent"
      ? (price * discount) / 100
      : discount;

    const finalPrice = Math.max(0, price - discountAmount);

    const round2 = (n) => Math.round(n * 100) / 100;

    return res.json({
      currency: "USD",
      mode,
      input: { price: round2(price), discount: round2(discount) },
      output: {
        discountAmount: round2(discountAmount),
        finalPrice: round2(finalPrice)
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Ambizz Flair Pricer running on port ${PORT}`);
});
