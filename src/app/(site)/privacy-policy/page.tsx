import Link from "next/link";
import { JsonLd } from "@/components/sections/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { BUSINESS, PRIVACY_EFFECTIVE_DATE } from "@/content/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy | RM Electronics",
  description:
    "How RM Electronics uses the details you send in a repair enquiry, and what the website does and does not collect.",
  path: "/privacy-policy",
});

const h2 = "heading-3 mt-10";
const ul = "mt-3 list-disc space-y-2 pl-6 text-ink-2";

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }])} />
      <PageHero breadcrumbs={[{ name: "Home", href: "/" }, { name: "Privacy Policy" }]} title="Privacy Policy">
        <p>A plain-language explanation of what this website does with your information. Effective {PRIVACY_EFFECTIVE_DATE}.</p>
      </PageHero>

      <section className="section">
        <div className="container-page max-w-3xl text-ink-2">
          <p>
            This website is run for {BUSINESS.name}, {BUSINESS.address.full}. This notice describes how the website itself works. It was written for the features this site actually has; it has not been independently certified for legal compliance, and the business should review it if its tools or processes change.
          </p>

          <h2 className={h2}>What you send us</h2>
          <p className="mt-3">If you submit the repair enquiry form, the website receives:</p>
          <ul className={ul}>
            <li>Your name and mobile number.</li>
            <li>Your TV brand and the problem you selected.</li>
            <li>Optional enquiry details, such as your area, TV model, preferred contact method or any extra details you provide.</li>
            <li>A record that you ticked the consent box, and which version of this notice applied.</li>
            <li>
              Campaign labels (such as the advertising source and the page you arrived on) if you came from an advert. These describe the campaign, not you.
            </li>
          </ul>
          <p className="mt-3">Please do not put sensitive personal information in the details box.</p>

          <h2 className={h2}>Why we use it</h2>
          <p className="mt-3">
            To reply to your enquiry and discuss your TV repair. Your details are not sold, and they are not used for anything unrelated to your enquiry.
          </p>

          <h2 className={h2}>How your enquiry is processed</h2>
          <ul className={ul}>
            <li>The form sends your details to this website&rsquo;s server over an encrypted connection, where they are checked.</li>
            <li>The server then passes the enquiry on to the business through a delivery service: either an email delivery provider to the business inbox, or the business&rsquo;s own enquiry or CRM system.</li>
            <li>If delivery fails, the website tells you the enquiry was not sent. It never shows a confirmation for an enquiry that was not delivered.</li>
            <li>To limit spam, the server briefly keeps your device&rsquo;s IP address in memory to count how many enquiries come from it. The IP address is not added to the enquiry.</li>
            <li>The website host and the delivery provider may keep ordinary technical logs under their own terms.</li>
            <li>If you send a review, it is delivered to the business in the same way and is only published after it has been checked and only with the permission you give in the form. Your review is shown with your name and area, and is never published automatically.</li>
          </ul>

          <h2 className={h2}>How long it is kept</h2>
          <p className="mt-3">
            Enquiries are kept as long as needed to deal with your TV and for ordinary business records. No fixed deletion period has been published. You can ask for your enquiry to be deleted at any time using the contact details below.
          </p>

          <h2 className={h2}>Cookies, storage and analytics</h2>
          <ul className={ul}>
            <li>
              <strong className="font-semibold text-ink">Strictly needed:</strong> after you submit an enquiry, a short-lived cookie (about 15 minutes) lets the confirmation page know your enquiry was accepted. Your browser also remembers your cookie choice and, for the visit, any campaign labels.
            </li>
            <li>
              <strong className="font-semibold text-ink">Optional analytics and advertising:</strong> the business may switch on Google Analytics, Google Ads conversion tracking or the Meta Pixel. If it does, nothing from those tools loads until you accept the cookie banner, and you can decline.
            </li>
            <li>
              When those tools are used, the website sends only event labels such as &ldquo;phone link tapped&rdquo; or &ldquo;enquiry accepted&rdquo;. It never sends your name, phone number, email or what you typed in the form.
            </li>
          </ul>

          <h2 className={h2}>Links to other services</h2>
          <p className="mt-3">
            The map on the contact page loads content from Google Maps only after you press &ldquo;Show map&rdquo;. Phone, email, Google Maps directions, Facebook, Instagram and (if shown) WhatsApp links take you to other services, which have their own privacy practices.
          </p>

          <h2 className={h2}>Security</h2>
          <p className="mt-3">
            The site uses HTTPS and checks all input on the server. No online system can be guaranteed completely secure, so if your TV problem is urgent or sensitive, you can call instead of using the form.
          </p>

          <h2 className={h2}>Your choices and questions</h2>
          <p className="mt-3">
            You can ask what we hold about you, ask for corrections or deletion, or withdraw consent by contacting RM Electronics:
          </p>
          <ul className={ul}>
            <li>
              Phone: <a href={BUSINESS.phone.href} className="text-link">{BUSINESS.phone.display}</a>
            </li>
            <li>
              Email: <a href={`mailto:${BUSINESS.email}`} className="text-link break-all">{BUSINESS.email}</a>
            </li>
          </ul>

          <h2 className={h2}>Changes</h2>
          <p className="mt-3">
            If this notice changes, the effective date above will change. Questions about the website can be sent through the <Link href="/contact" className="text-link">contact page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
