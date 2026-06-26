# Client brief — Driftwood Capital

## The client

**Driftwood Capital** is an independent investment research firm with ~40 analysts. They sell deep equity research to institutional clients (hedge funds, mutual funds, pension funds) under annual subscriptions ($50K–$500K+ per client), plus custom commissioned research and analyst calls.

They don't manage money themselves. Their product is research and access to their analysts.

## How Driftwood makes money

- Analysts each cover ~15 US public companies in a specific industry (semiconductors, retail, energy, etc.)
- They produce written research reports, financial models, and stock-level recommendations
- Asset-management clients pay for the reports and for the right to call the analyst with questions
- Reputation is everything — a single bad call dents the franchise

## How they add value

- Their clients (portfolio managers at funds) don't have the bandwidth to read every 10-K, 10-Q, earnings transcript, and industry filing for the companies they invest in
- Driftwood's analysts have already done that reading and turned it into actionable summaries
- The value is *condensation*: turning thousands of pages into a one-page thesis the PM can act on

## The problem

Every Driftwood analyst spends roughly **half of every week** doing source-document intake — opening SEC filings, scanning for the sections they care about (risk factors, MD&A, business segments), copy-pasting passages, comparing year-over-year. Only after that intake work can they produce any original analysis.

The intake work is:

- Boring
- Necessary (you can't analyze what you haven't read)
- Repetitive across analysts (multiple analysts read the same Apple 10-K every January)
- The biggest single drag on analyst output

## What they want

An internal chatbot where any analyst can:

- Ask questions in plain English about any filing in Driftwood's curated corpus
- Get a sourced answer that cites the specific filing and the specific page
- Trust the answer enough to base downstream analysis on it
- Use it from a browser, logged in with their Driftwood email address
- See their own past conversations

## What "trust" means here

This is a research firm. Their entire business is being right. The bot must:

- **Never invent facts.** If the answer isn't in the corpus, it says so.
- **Always cite.** Every claim links to the source filing + page.
- **Show the underlying passage** so the analyst can verify in one click.

A wrong but confident answer is worse than no answer. Hallucinations kill the product.

## Constraints

- Corpus: SEC filings (10-Ks and 10-Qs) for S&P 500 companies, 2020–2025
- Source: SEC EDGAR (public domain)
- Users: ~40 Driftwood analysts, plus a few partners
- Login: Driftwood email addresses (no SSO required)
- Hosting: must run on a small/medium cloud footprint; Driftwood has no infra team

## Out of scope

- Trading recommendations or stock picks
- External data sources (no news, no social, no alternative data)
- Multi-tenant / multi-client — this is Driftwood-internal only
- Billing, plans, paywalls
- Mobile app

## Definition of done

The analyst pilot group (5 senior analysts) tries it for a week and reports it saves them at least 3 hours per analyst per week. If yes, Driftwood rolls it out firm-wide.
