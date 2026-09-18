import { useLanguage } from "../lib/LanguageContext";
import { useCurrency } from "../lib/CurrencyContext";

interface PriceBlockProps {
  priceJPY: number;
  variant?: "compact" | "detail";
  className?: string;
}

export function PriceBlock({ priceJPY, variant = "compact", className = "" }: PriceBlockProps) {
  const { t } = useLanguage();
  const { currency, convertFromJPY, formatAmount, rateStatus, rateUpdatedAt } = useCurrency();

  // Convert when possible; otherwise fall back to the JPY base price rather than
  // showing a broken/blank conversion (never NaN/undefined/0).
  const converted = currency === "JPY" ? priceJPY : convertFromJPY(priceJPY);
  const displayCurrency = converted != null ? currency : "JPY";
  const displayValue = converted != null ? converted : priceJPY;

  const primaryText = formatAmount(displayValue, displayCurrency);
  const secondaryText =
    converted != null && displayCurrency !== "JPY" ? formatAmount(priceJPY, "JPY") : null;

  if (variant === "compact") {
    return (
      <div className={`flex flex-col gap-0.5 ${className}`}>
        <span className="font-headline-md text-lg text-primary font-medium">{primaryText}</span>
        {secondaryText && (
          <span className="font-body-md text-xs text-on-surface-variant">
            {t("currency.approx")} {secondaryText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-outline-variant bg-surface-container-lowest p-6 md:p-8 flex flex-col gap-4 ${className}`}>
      <span className="font-label-caps text-xs text-brand-500 uppercase tracking-widest">
        {t("price.label")}
      </span>

      <div className="flex flex-col gap-1">
        <span className="font-headline-lg text-2xl md:text-3xl text-primary font-medium">{primaryText}</span>
        {secondaryText && (
          <span className="font-body-md text-sm text-on-surface-variant">
            {t("currency.approx")} {secondaryText}
          </span>
        )}
      </div>

      {currency !== "JPY" && (
        <>
          {converted == null ? (
            <span className="font-label-caps text-[11px] text-on-surface-variant/70">
              {t("currency.unavailable")}
            </span>
          ) : (
            <>
              <p className="font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
                {t("currency.disclaimer")}
              </p>
              {rateUpdatedAt && (
                <span className="font-label-caps text-[11px] text-on-surface-variant/70">
                  {rateStatus === "cached" ? t("currency.updated_cached") : t("currency.updated")}: {rateUpdatedAt}
                </span>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
