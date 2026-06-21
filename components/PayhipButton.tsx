"use client";

type PayhipButtonProps = {
  payhipKey: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Renders a "Buy Now" button that takes the customer straight to Payhip's
 * checkout/payment form for a single product, in a new browser tab.
 *
 * This uses Payhip's direct checkout link format:
 *   https://payhip.com/buy?link=PRODUCT_KEY
 *
 * That's different from the plain product page link (payhip.com/b/KEY),
 * which shows Payhip's own full hosted storefront page first (with its own
 * header, search, account icons etc.) — confusing since it looks like a
 * totally different, unbranded site. The /buy?link= form skips straight to
 * the password/email + payment screen, so customers see a minimal payment
 * form instead of Payhip's storefront.
 *
 * target="_blank" opens it in a new tab, so customers never lose their
 * place on the site mid-checkout.
 */
export default function PayhipButton({
  payhipKey,
  className,
  children,
}: PayhipButtonProps) {
  const isDemo = payhipKey === "DEMO_PLACEHOLDER";

  function handleDemoClick(e: React.MouseEvent) {
    if (isDemo) {
      e.preventDefault();
      alert(
        "This is a demo product without a real Payhip key yet. Add a real product in your Payhip dashboard and update payhipKey in data/products.json (or bundles.json) to make this button work."
      );
    }
  }

  return (
    <a
      href={`https://payhip.com/buy?link=${payhipKey}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleDemoClick}
    >
      {children}
    </a>
  );
}
