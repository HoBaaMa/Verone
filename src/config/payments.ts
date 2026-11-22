const asset = (file: string) => `${import.meta.env.BASE_URL}assets/payments/${file}`;

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  /** Tile fill; brand colour for logos that are knocked out in white. */
  tile?: string;
}

/** Accepted payment and instalment providers, in display order. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "valu", name: "valU", logo: asset("valu.png") },
  { id: "contact", name: "Contact", logo: asset("contact.png") },
  { id: "visa", name: "Visa", logo: asset("visa.svg") },
  { id: "mastercard", name: "Mastercard", logo: asset("mastercard.svg") },
  { id: "paypal", name: "PayPal", logo: asset("paypal.svg") },
  { id: "skrill", name: "Skrill", logo: asset("skrill.svg"), tile: "#6a3494" },
];
