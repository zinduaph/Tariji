import Navbar from "../components/navbar"

const Kra = () => {
    return (
        <>
        <div>
            <Navbar/>

            <div className="max-w-4xl mt-15 mx-auto px-6 py-16">
              <h1 className="text-2xl text-orange-500 mb-4 md:text-4xl">Do You Need to Pay Tax on Digital Products You Sell in Kenya? (2026 Rules Explained)</h1>

              <p className="text-lg text-relaxed text-gray-600 mb-4">
                If you sell ebooks, courses, templates, or any other digital product online in Kenya, 2026 changed the rules on you — whether you noticed or not.
              </p>

              <p className="text-gray-800 text-lg leading-relaxed mb-4 italic">
                 Last updated: 2026 | Reading time: 31 minutes
                </p>

                <hr className="my-8" />
               
               <p className="text-lg text-gray-800 text-relaxed mb-6">
                Since January 1, 2026, the Kenya Revenue Authority (KRA) has been enforcing a much stricter version of its Electronic Tax Invoice Management System (eTIMS),
                 and the scope of what counts as a taxable "digital service" has widened to explicitly include things like online courses and subscription-based content. At the same time, <br />
                  platforms like Meta have started withholding tax directly from creator payouts. If you've been selling quietly on WhatsApp, Instagram, or a digital marketplace without thinking about KRA at all,
                   this is the moment to get it sorted — not because enforcement is scary, but because getting it right now is far easier than untangling it later.
               </p>

               <p className="text-lg text-relaxed font-semibold mb-4">Here's what actually applies to you, in plain language.</p>

               <h2 className="text-orange-500 text-2xl mb-4 font-semibold">First: are you even in scope?</h2>
               <p className="text-lg text-relaxed mb-4">Two different tax questions get mixed up here, so let's separate them.</p>
               <p className="text-lg text-gray-800 text-relaxed mb-6">
                1. Are you a Kenyan resident selling to Kenyan (or global) customers? If yes, your digital product income is ordinary business income. <br />
                 It's taxed like any other income you earn — through normal income tax rules — and, depending on your turnover, it may also attract VAT.
               </p>
               <p className="text-lg text-gray-800 text-relaxed mb-6">
                2. Is your sale a "digital service" under KRA's expanded definition? As of the Finance Act 2025 changes, <br />
                 the digital tax net now explicitly covers digital content, online courses, software, and subscription-based platforms — not just the big foreign platforms KRA originally built these rules for. <br />
                  The old test used to lean on a KES 5 million turnover threshold; that threshold has effectively been scrapped in favor of a broader definition based on where the customer is (Kenyan IP address, Kenyan payment method, or Kenyan billing address).
               </p>

               <p className="text-lg text-relaxed mb-4">
                In short: if you're a Kenyan creator selling an ebook or course to a Kenyan buyer who pays via M-Pesa, you're squarely inside the system KRA is now actively watching.
               </p>
                  
                  <h1 className="text-orange-500 text-2xl mb-2">What eTIMS actually requires from a digital seller</h1>
                  <p className="text-gray-800 text-relaxed mb-2">The part that catches most small sellers off guard is invoicing, not the tax rate itself.</p>

                  <p className="text-gray-800 text-relaxed mb-2">
                    From January 2026, KRA's enhanced eTIMS rollout requires e-commerce transactions to be traceable and properly invoiced.
                     In practice, that means:
                  </p>

                  <ul>
                    <li className="text-gray-800 text-relaxed mb-2">Every sale should have a verified eTIMS invoice generated for it.</li>
                    <li className="text-gray-800 text-relaxed mb-2">Un-invoiced sales aren't just a compliance gap — they become non-deductible for tax purposes, and KRA can flag them as undeclared income.</li>
                    <li className="text-gray-800 text-relaxed mb-2">KRA is cross-matching bank deposits, mobile money transactions, and eTIMS records to spot mismatches. If your M-Pesa till shows KES 40,000 coming in a month and your filings show nothing, that gap is now visible to them in a way it wasn't a few years ago.</li>
                  </ul>

                  <p className="text-lg text-relaxed mb-4">
                    This is the practical reason "I'll just sell informally and deal with tax later" is a riskier strategy in 2026 than it was in 2023.
                  </p>

                  <h2 className="text-orange-500 text-2xl mb-2">If you're earning from platform payouts (Meta, YouTube, etc.) too</h2>
                  <p className="text-lg text-gray-800 text-relaxed mb-6">
                    Worth flagging separately: starting January 2026, Meta began deducting a 5% withholding tax directly from Kenyan creators' payouts on Facebook and Instagram monetisation, remitting it to KRA on your behalf.
                     If you're a creator who earns both from platform monetisation and from selling your own digital products, these are two separate income streams that both now sit inside KRA's line of sight — and the withholding tax you see on one doesn't cover the other.
                  </p>

                  <h2 className="text-2xl font-semibold mb-2">What to actually do this week</h2>
                  <ol>
                    <li className="text-gray-800 text-relaxed mb-2">Start invoicing every sale, even small ones, rather than treating digital products as informal side income.</li>
                    <li className="text-gray-800 text-relaxed mb-2">Reconcile your M-Pesa/payment records against what you're declaring — don't let a gap build up that you'll have to explain later.</li>
                    <li className="text-gray-800 text-relaxed mb-2">Get a KRA PIN and understand your VAT registration status if you don't already have clarity on this.</li>
                    <li className="text-gray-800 text-relaxed mb-2">Talk to an accountant familiar with Kenya's digital tax rules if your monthly digital product income is meaningful — the SEPT/DST and VAT interaction is not something to guess at.</li>
                  </ol>

                  <p className="text-lg text-gray-800 text-relaxed mb-6">
                    None of this is legal or tax advice — it's a plain-language summary to help you know what questions to ask.
                     KRA's own guidance and a licensed tax advisor are the right places to get a definitive answer for your specific situation.
                  </p>
                  <hr className="my-8"/>

                  <p className="text-lg text-gray-800 text-relaxed mb-6">
                    This is exactly the kind of thing we're building <a rel="nofollow" href="https://tariji.co.ke">[<strong>tariji.co.ke</strong>]</a> to make less painful — helping Kenyan creators sell digital products with invoicing and compliance handled properly from day one, not bolted on after KRA comes knocking.
                  </p>

            </div>
        </div>
        </>
    )
}
export default Kra