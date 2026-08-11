
const SideHustleForCampusStudents = () => {
    return (
        <article className="mx-auto max-w-4xl rounded-[2rem] mt-15 md:mt-20 border border-gray-200 bg-white/95 p-8 shadow-[0_20px_80px_-40px_rgba(249,115,22,0.45)] shadow-orange-200/40 sm:p-10">
            <header className="mb-10 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">Campus student trends</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 sm:text-4xl">5 Digital Products Campus Students in Kenya Are Actually Buying Right Now</h1>
                <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">Most "sell digital products in Kenya" content lists what sells globally — templates, courses, ebooks — and assumes it translates directly. It doesn't, especially for the campus market. Kenyan university students are one of the most active digital-buying groups in the country right now, but what they actually pay for is narrower and more specific than the generic advice suggests. Here's what's genuinely moving, based on what's live in the market today.</p>
            </header>

            <div className="space-y-10 text-slate-700">
                <section className="space-y-4 rounded-3xl bg-slate-50/70 p-6 shadow-sm shadow-slate-100">
                    <h2 className="text-2xl font-semibold text-orange-500">1. Past papers, at KES 10 a paper</h2>
                    <p className="leading-8">Past-paper repositories built specifically around individual universities — Kenyatta University, Mount Kenya University, and others — are charging as little as KES 10 per paper and still getting consistent volume. The price point matters: it's low enough that a student buys on impulse the night before a CAT without thinking twice, which is exactly why this category works as a volume business rather than a high-margin one.</p>
                    <p className="leading-8 text-slate-600">Why it works: every unit is genuinely useful to a specific, motivated buyer, and the "expiry" is built in — new papers are needed every semester, so the same student comes back repeatedly.</p>
                </section>

                <section className="space-y-4 rounded-3xl bg-slate-50/70 p-6 shadow-sm shadow-slate-100">
                    <h2 className="text-2xl font-semibold text-orange-500">2. Verified class notes and schemes of work</h2>
                    <p className="leading-8">Above past papers in price (typically KES 50–60) sit typed, organized class notes and schemes of work — the kind of material a student would otherwise spend hours photocopying from a classmate or hunting through WhatsApp groups for. Sites selling Grade 10–12 CBC schemes of work and university unit notes are live and pricing in this exact range right now.</p>
                    <p className="leading-8 text-slate-600">Why it works: the value isn't the information itself (much of it exists for free somewhere) — it's the time saved finding, organizing, and trusting that it's complete and current for this term's syllabus.</p>
                </section>

                <section className="space-y-4 rounded-3xl bg-slate-50/70 p-6 shadow-sm shadow-slate-100">
                    <h2 className="text-2xl font-semibold text-orange-500">3. Bundled study access with AI tutoring built in</h2>
                    <p className="leading-8">The newer, more interesting shift: platforms now bundling past papers, notes, and an AI tutor into one subscription, priced daily rather than per item — as low as KES 50/day. This lowers the commitment barrier for a student who might not want to pay per document but will pay a small daily fee during exam season specifically.</p>
                    <p className="leading-8 text-slate-600">Why it works: it matches how students actually study — in short, intense bursts before CATs and finals — rather than assuming they'll plan and buy materials weeks in advance.</p>
                </section>

                <section className="space-y-4 rounded-3xl bg-slate-50/70 p-6 shadow-sm shadow-slate-100">
                    <h2 className="text-2xl font-semibold text-orange-500">4. CV, cover letter, and interview-prep bundles for graduating students</h2>
                    <p className="leading-8">This one targets a narrower but highly motivated window: final-year students within a few months of graduating, suddenly needing a professional CV and interview prep for a job market they haven't had to navigate before. Templates alone are common; what's less saturated is a bundle built specifically around the Kenyan graduate job market — how local employers actually screen CVs, what Kenyan interview panels ask, how to handle the "no experience" problem most graduates face.</p>
                    <p className="leading-8 text-slate-600">Why it works: it's a one-time purchase tied to real anxiety about a real deadline (graduation, job applications), which tends to convert better than "someday" purchases.</p>
                </section>

                <section className="space-y-4 rounded-3xl bg-slate-50/70 p-6 shadow-sm shadow-slate-100">
                    <h2 className="text-2xl font-semibold text-orange-500">5. Simple budgeting and side-hustle guides</h2>
                    <p className="leading-8">Financial pressure is a constant for Kenyan campus students — HELB disbursement timing, upkeep budgeting, the gap between allowance and actual costs. Short, practical digital guides (budgeting templates, "how to start with capital under KES 5,000" side-hustle guides) sell well because they solve an immediate, recurring problem rather than an aspirational one.</p>
                    <p className="leading-8 text-slate-600">Why it works: unlike a course, it doesn't ask for a big time investment — a student can buy it, read it in twenty minutes, and act on it the same day.</p>
                </section>
            </div>

            <footer className="mt-12 rounded-3xl border border-orange-100 bg-orange-50/70 p-6 text-slate-700 sm:p-8">
                <h2 className="text-2xl font-semibold text-orange-500">What ties these together</h2>
                <p className="mt-4 leading-8">Every one of these sells because it solves a problem in the next few days, not the next few months — a CAT this week, a job application this month, upkeep money running out before the next HELB disbursement. Campus buyers are price-sensitive but not value-sensitive: KES 10–60 price points work precisely because they're low-friction impulse decisions, not considered purchases. If you're building for this audience, the lesson isn't "make it cheap" — it's "make it solve something due this week."</p>
                <p className="mt-4 leading-8 text-slate-600">If you're building a digital product for the Kenyan campus market, [Platform Name] is built around exactly this kind of low-friction, M-Pesa-first buying behaviour. <a href="https://tariji.co.ke" className="text-orange-500 underline" rel="nofollow" target="_blank" rel="noopener noreferrer">Start selling digital products today!</a></p>
            </footer>
        </article>
    )
}
export default SideHustleForCampusStudents;