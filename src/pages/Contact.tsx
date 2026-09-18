import React, { useEffect, useState } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { PageBanner } from "../components/PageBanner";
import { motion } from "motion/react";
import { SocialLinks } from "../components/SocialLinks";
import { useSocialLinks } from "../lib/useSocialLinks";
import { pickLang } from "../lib/utils";
import { submitContactForm, RateLimitedError, SpamRejectedError } from "../lib/content/forms";

export function Contact() {
  const { t, lang } = useLanguage();
  const socialLinks = useSocialLinks();
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    type: "",
    message: "",
    consent: false,
    website: "", // honeypot — must stay empty; real visitors never see or fill this field
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [propertySlug, setPropertySlug] = useState<string | null>(null);

  useEffect(() => {
    document.title = pickLang(
      lang,
      "Yellow House - 聯絡我們 | 株式会社イエローハウスカンパニー",
      "Yellow House - Contact | Yellow House Company Inc.",
      "Yellow House - お問い合わせ | 株式会社イエローハウスカンパニー"
    );
  }, [lang]);

  // Pre-fill from a property page's "inquire about this property" link (?property=slug)
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("property");
    if (slug) {
      setPropertySlug(slug);
      setFormData((prev) => ({
        ...prev,
        type: "brokerage_res",
        message: prev.message || pickLang(lang, `我對物件「${slug}」有興趣，請提供更多資訊。`, `I'm interested in property "${slug}". Please provide more details.`, `物件「${slug}」に興味があります。詳細を教えてください。`),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await submitContactForm({ ...formData, propertySlug });
      setSubmitted(true);
      setFormData({
        company: "",
        name: "",
        email: "",
        phone: "",
        type: "",
        message: "",
        consent: false,
        website: "",
      });
    } catch (err) {
      if (err instanceof SpamRejectedError) {
        // Bots fill every field, including the honeypot. Show success anyway
        // so we don't reveal that it was detected.
        setSubmitted(true);
      } else if (err instanceof RateLimitedError) {
        setErrorMsg(
          pickLang(lang, "請稍候片刻再送出一次諮詢表單。", "Please wait a moment before submitting again.", "少し時間を置いてから再度お試しください。")
        );
      } else {
        setErrorMsg(
          pickLang(
            lang,
            "送出失敗，請確認網路連線後再試一次，或直接透過 Email 與我們聯繫。",
            "Submission failed. Please check your connection and try again, or email us directly.",
            "送信に失敗しました。ネットワーク接続をご確認のうえ再度お試しいただくか、メールでご連絡ください。"
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background relative overflow-hidden">
      <PageBanner
        image="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85"
        kicker={t("contact.banner.tag")}
        title={t("contact.banner.h1")}
        desc={t("contact.banner.desc")}
      />

      {/* CONTACT FORM & INFO SECTION */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-section bg-surface-warm">
        <div className="content-col grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter">
          {/* FORM */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl lg:col-span-7 bg-surface p-8 md:p-12 border border-outline-variant shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-6 animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="font-headline-lg text-primary">{t("contact.form.success")}</h3>
                <p className="font-body-md text-on-surface-variant max-w-md">
                  {pickLang(
                    lang,
                    "感謝您的填寫。株式会社イエローハウスカンパニー 不動產顧問已收到您的諮詢，將儘速透過 Email 與您聯繫。",
                    "Thank you for reaching out. Yellow House Company advisory team has received your message and will respond via email shortly.",
                    "お問い合わせいただき誠にありがとうございます。株式会社イエローハウスカンパニーの担当者が内容を確認の上、追ってメールにてご連絡いたします。"
                  )}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-lg mt-4 px-8 py-3 border border-primary text-primary font-label-caps hover:bg-primary hover:text-white transition-colors"
                >
                  {pickLang(lang, "填寫另一則詢問", "SUBMIT ANOTHER INQUIRY", "別の問い合わせを送る")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
                      {t("contact.form.company")}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Yellow House Ltd."
                      className="rounded-md w-full p-4 border border-outline-variant bg-surface focus:border-primary focus:outline-none font-body-md text-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
                      {t("contact.form.name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Taro Yamada"
                      className="rounded-md w-full p-4 border border-outline-variant bg-surface focus:border-primary focus:outline-none font-body-md text-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
                      {t("contact.form.email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. taro@example.com"
                      className="rounded-md w-full p-4 border border-outline-variant bg-surface focus:border-primary focus:outline-none font-body-md text-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
                      {t("contact.form.phone")}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +81 90-1234-5678"
                      className="rounded-md w-full p-4 border border-outline-variant bg-surface focus:border-primary focus:outline-none font-body-md text-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
                    {t("contact.form.type")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-4 border border-outline-variant bg-surface focus:border-primary focus:outline-none font-body-md text-primary transition-colors cursor-pointer"
                  >
                    <option value="">{t("contact.form.type_placeholder")}</option>
                    <option value="brokerage_res">{t("contact.form.type_res")}</option>
                    <option value="brokerage_com">{t("contact.form.type_com")}</option>
                    <option value="management">{t("contact.form.type_mgmt")}</option>
                    <option value="resale">{t("contact.form.type_resale")}</option>
                    <option value="development">{t("contact.form.type_dev")}</option>
                    <option value="hospitality">{t("contact.form.type_hospitality")}</option>
                    <option value="other">{t("contact.form.type_other")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
                    {t("contact.form.message")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={pickLang(
                      lang,
                      "請描述您的置產需求、諮詢事項或具體目標...",
                      "Please describe your property objectives, inquiry topics, or specific goals...",
                      "ご希望の物件条件やご相談内容、具体的なご要望をご記入ください..."
                    )}
                    className="w-full p-4 border border-outline-variant bg-surface focus:border-primary focus:outline-none font-body-md text-primary transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Honeypot: hidden from real visitors via CSS + tabIndex, bots fill it anyway */}
                <div className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    required
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-primary shrink-0"
                  />
                  <span className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                    {pickLang(
                      lang,
                      "我同意本公司依隱私權政策蒐集、處理與利用上述個人資料，以便回覆本次諮詢。",
                      "I consent to Yellow House Company collecting and using the information above to respond to this inquiry, per the Privacy Policy.",
                      "上記の個人情報を本お問い合わせへの返信目的で収集・利用することに同意します。"
                    )}
                    <span className="text-red-500"> *</span>
                  </span>
                </label>

                {errorMsg && (
                  <p className="rounded-md px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-body-md">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg w-full py-5 bg-primary text-white font-label-caps tracking-widest hover:bg-primary/90 transition-colors uppercase cursor-pointer disabled:opacity-50"
                >
                  {loading ? t("contact.form.submitting") : t("contact.form.submit")}
                </button>
              </form>
            )}
          </motion.div>

          {/* OFFICIAL COMPANY INFORMATION (COMPANY INFORMATION 唯一依據) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between gap-12"
          >
            <div className="flex flex-col gap-6">
              {/* Company Name */}
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-5">
                <span className="font-label-caps text-brand-500 tracking-widest uppercase text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">business</span>
                  {t("contact.info.company_name_label")}
                </span>
                <p className="font-body-md text-primary font-medium text-lg whitespace-pre-line leading-snug mt-1">
                  {t("contact.info.company_name_val")}
                </p>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-5">
                <span className="font-label-caps text-brand-500 tracking-widest uppercase text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {t("contact.info.hq_label")}
                </span>
                <p className="font-body-md text-primary whitespace-pre-line text-base leading-relaxed mt-1">
                  {t("contact.info.hq_val")}
                </p>
              </div>

              {/* License */}
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-5">
                <span className="font-label-caps text-brand-500 tracking-widest uppercase text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">workspace_premium</span>
                  {t("contact.info.license_label")}
                </span>
                <p className="font-body-md text-primary text-base mt-1">
                  {t("contact.info.license_val")}
                </p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-5">
                <span className="font-label-caps text-brand-500 tracking-widest uppercase text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {t("contact.info.contact_label")}
                </span>
                <p className="font-body-md text-primary text-base mt-1">
                  {t("contact.info.contact_val")}
                </p>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-5">
                <span className="font-label-caps text-brand-500 tracking-widest uppercase text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">call</span>
                  {t("contact.info.phone_label")}
                </span>
                <p className="font-body-md text-primary text-base mt-1">
                  {t("contact.info.phone_val")}
                </p>
              </div>

              {/* Hours */}
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-brand-500 tracking-widest uppercase text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {t("contact.info.hours_label")}
                </span>
                <p className="font-body-md text-primary text-sm whitespace-pre-line leading-relaxed mt-1">
                  {t("contact.info.hours_val")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-l-4 border-brand-500 bg-surface-warm-deep p-8 transition-transform duration-300 hover:-translate-y-1">
              <p className="font-body-md italic leading-relaxed text-primary">{t("contact.quote")}</p>
              {socialLinks.some((s) => s.url) && (
                <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant pt-6">
                  <span className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant">
                    {lang === "zh" ? "社群媒體" : lang === "jp" ? "ソーシャルメディア" : "Social Media"}
                  </span>
                  <SocialLinks />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
