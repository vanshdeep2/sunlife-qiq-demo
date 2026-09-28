# Sun Life QiQ demo

A React + Vite demo app for QiQ (Quantanite iQ) client intelligence, built around a synthetic Sun Life contact-centre dataset.

- `app/`: the demo app (React + Vite). Run `npm install`, then `npm run dev`. `app/dist/` is a production build ready for any static host, with `vercel.json` included.

Scope: Sun Life Canada's member contact centre (group health, dental and drug claims, group disability, group retirement, and the CDCP). Contact-centre numbers are modelled/synthetic.

## Real vs synthetic

- The research doc opens with **How This Demo Was Built**, a table of what's real (public reviews, ratings, news) and what's modelled (the contact centre), with the scale of each.
- The app has a **Voice of the Customer** page (`/voc`) that shows only real, public data, every quote dated and linked. Every page carries a Public / Modelled / Public + modelled badge, and a **How this demo was built** button in the nav opens the same table as the doc.
