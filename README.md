# ghana-travel-ready.demo.orchestrate.ca

Built live by the Orchestrate Solutions agent team in an Orchestrate demonstration. Static site: HTML, CSS and JavaScript,
no build step, no external libraries or fonts.

## What it is
A simple travel readiness app for people travelling Europe to Ghana and Ghana to Europe. The traveller fills in a short
form and gets a personalised checklist, then flight, stay and sight ideas by budget tier.

## Scope
Two pages: `index.html` and `pages/readiness.html`. The form logic lives in `js/tools.js`.

## Facts and samples
- Checklist content comes only from `content/facts.md` (written by the Ghana Travel & Foreign Affairs Expert). Anything
  unconfirmed is worded "check with the embassy / official source".
- Flight, stay and sight picks are **sample suggestions only**: no live prices, no bookings, labelled as sample data.
- General information, not legal, immigration or medical advice.

## Privacy
Nothing is sent anywhere. Entries stay in this browser (localStorage). The passport number is never saved: it is used on
screen only; the expiry date is what the checklist needs.
