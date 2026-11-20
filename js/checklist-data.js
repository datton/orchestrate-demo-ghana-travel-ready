/* Checklist items as data (Senior Developer 2). Every statement is taken from content/facts.md
   (Ghana Travel & Foreign Affairs Expert, written 20.11.2026). Unconfirmed points say "check with the embassy".
   Item: id, dir ('eu-gh'|'gh-eu'), group, text, asof, source, link (official page, optional), unconfirmed (true = worded as a check). */
(function () {
  'use strict';
  var CHECKED = '20.11.2026';
  var G = { visa: 'Visa and entry', passport: 'Passport', health: 'Health', money: 'Money and customs', safety: 'Insurance and safety', stay: 'Staying in Ghana' };

  var ITEMS = [
    // Europe (and other regions) to Ghana
    { id: 'eg-evisa', dir: 'eu-gh', group: 'visa', text: 'Apply for the online e-visa (business and tourism, since 25 May 2026) at least well before you fly. It is optional for non-Africans in the sources read. Enter Ghana within 90 days of issue; the stay of up to 60 days is set at the border, and approval does not guarantee entry.', asof: '25 May 2026 to Jun 2026', source: 'Ghana e-visa portal; EY', link: 'https://evisa.immigration.gov.gh' },
    { id: 'eg-evisa-time', dir: 'eu-gh', group: 'visa', text: 'E-visa processing time: sources differ, so allow extra lead time and check the portal.', asof: CHECKED, source: 'Ghana e-visa portal', unconfirmed: true },
    { id: 'eg-fee', dir: 'eu-gh', group: 'visa', text: 'The standard single-entry e-visa fee for non-Africans was reported as US$260. Confirm the fee on the portal before you pay; fees for other tiers and at embassies: check with the embassy.', asof: '25 May and 14 Aug 2026', source: 'Graphic; GNA', link: 'https://evisa.immigration.gov.gh' },
    { id: 'eg-voa', dir: 'eu-gh', group: 'visa', text: 'Do not rely on a visa on arrival. The May 2026 reform replaced it, and travelling without an ETA or visa risks being denied boarding.', asof: '5 and 23 Jun 2026', source: 'KPMG; Fragomen' },
    { id: 'eg-declaration', dir: 'eu-gh', group: 'visa', text: 'Complete the mandatory online Health Declaration before departure (required from 12 Nov 2026).', asof: '7 Nov 2026', source: 'Graphic', link: 'https://ehds.ghs.gov.gh/declaration' },
    { id: 'eg-declaration-qr', dir: 'eu-gh', group: 'visa', text: 'Whether the Health Declaration gives you a QR code is unconfirmed: check the official declaration page.', asof: CHECKED, source: 'Ghana Health Service', unconfirmed: true },
    { id: 'eg-passport', dir: 'eu-gh', group: 'passport', key: 'passport', text: 'Your passport should be valid for at least 6 months. Canada says 6 months beyond departure and the UK says 6 months after arrival: use the stricter.', asof: 'Nov 2026', source: 'GIS; Govt of Canada; UK FCDO' },
    { id: 'eg-yf', dir: 'eu-gh', group: 'health', key: 'yf', text: 'Carry a yellow fever vaccination certificate: it is required for all arrivals aged 9 months and over and is valid for life. Vaccinate at least 10 days before travel.', asof: '9 Nov 2026', source: 'CDC; TravelHealthPro' },
    { id: 'eg-yf-outbreak', dir: 'eu-gh', group: 'health', text: 'A yellow fever outbreak was reported in the Upper West Region (121 cases, 19 confirmed, 3 deaths at 19 Oct 2026). CDC has a Level 2 notice.', asof: '28 Oct and 9 Nov 2026', source: 'TravelHealthPro; CDC' },
    { id: 'eg-malaria', dir: 'eu-gh', group: 'health', text: 'Malaria risk covers all of Ghana. Ask a travel clinic about prophylaxis.', asof: 'Nov 2026', source: 'CDC; TravelHealthPro' },
    { id: 'eg-vaccines', dir: 'eu-gh', group: 'health', text: 'Discuss hepatitis A, tetanus and typhoid vaccines with a travel clinic. For some travellers: hepatitis B, rabies, cholera, MMR, meningococcal ACWY.', asof: 'Nov 2026', source: 'TravelHealthPro' },
    { id: 'eg-ebola', dir: 'eu-gh', group: 'health', text: 'Ghana had no confirmed Ebola case at 3 Nov 2026. Arrivals from affected countries face a 21-day travel declaration, thermal screening and monitoring.', asof: '3 Nov 2026', source: 'GNA' },
    { id: 'eg-meds', dir: 'eu-gh', group: 'health', text: 'Some medicines have a different legal status in Ghana. Check the FCDO health page before you pack yours.', asof: CHECKED, source: 'UK FCDO', unconfirmed: true },
    { id: 'eg-cash', dir: 'eu-gh', group: 'money', text: 'Declare cash or monetary instruments above US$10,000 on form FX-5 (since 1 Sep 2025).', asof: '2025', source: 'Bank of Ghana' },
    { id: 'eg-duty', dir: 'eu-gh', group: 'money', text: 'Duty-free allowance: spirits 375 ml, wine 750 ml, tobacco 0.5 kg in total.', asof: 'undated page', source: 'Ghana Revenue Authority' },
    { id: 'eg-prohibited', dir: 'eu-gh', group: 'money', text: 'Do not bring camouflage or military clothing (illegal). Counterfeit money, obscene articles, dangerous weapons and contaminated food are prohibited imports.', asof: 'Nov 2026', source: 'UK FCDO; GRA' },
    { id: 'eg-cards', dir: 'eu-gh', group: 'money', text: 'The currency is the cedi (GHS). Visa is more widely accepted than Mastercard, and card fraud is widespread.', asof: '2024 to 2026', source: 'OBG; Govt of Canada; UK FCDO' },
    { id: 'eg-misc-check', dir: 'eu-gh', group: 'money', text: 'Cedi export limits, drone rules and SIM validity for visitors are unconfirmed: check with the embassy or official sources.', asof: CHECKED, source: 'Ghana High Commission', unconfirmed: true },
    { id: 'eg-insurance', dir: 'eu-gh', group: 'safety', text: 'Take insurance that covers treatment and medical evacuation. Healthcare is inadequate outside Accra and often paid upfront. Travelling against your government’s advice can void cover.', asof: '2 and 4 Nov 2026', source: 'Govt of Canada; UK FCDO' },
    { id: 'eg-advice', dir: 'eu-gh', group: 'safety', text: 'Read your government’s travel advice. Canada: avoid non-essential travel within 25 km of the Burkina Faso border. UK: advises against all but essential travel to Bawku Municipality.', asof: '2 and 4 Nov 2026', source: 'Govt of Canada; UK FCDO' },
    { id: 'eg-emergency', dir: 'eu-gh', group: 'safety', text: 'Emergency numbers: 112; police 191 or 18555; ambulance 193; fire 192.', asof: '2 Nov 2026', source: 'Govt of Canada' },
    { id: 'eg-practical', dir: 'eu-gh', group: 'safety', text: 'Dress conservatively and travel between cities in daylight. Same-sex acts are illegal in Ghana. Power is 230 V, 50 Hz, sockets type G and D. You arrive at Accra International Airport (ACC, renamed 23 Feb 2026).', asof: '2024 to 2026', source: 'Govt of Canada; UK FCDO; OBG; Graphic' },
    { id: 'eg-longer', dir: 'eu-gh', group: 'stay', text: 'To stay longer, extend at the GIS office, Independence Avenue, Accra: GH¢65 per month. Overstaying costs GH¢300 per month.', asof: 'effective 15 May 2025', source: 'Ghana Immigration Service fees' },
    { id: 'eg-work', dir: 'eu-gh', group: 'stay', text: 'A visit visa does not allow work. Work needs a work and residence permit.', asof: 'Nov 2026', source: 'KPMG TIES' },

    // Ghana to Europe (Ghanaian passport)
    { id: 'ge-apply', dir: 'gh-eu', group: 'visa', text: 'Apply at least 15 calendar days before the trip and up to 6 months before. An appointment is needed and there is a waiting list. For Germany (Accra) the embassy states 14 days processing; individual cases may take longer.', asof: CHECKED, source: 'German Embassy Accra', link: 'https://accra.diplo.de/gh-en/service/-VisaInformation/-/2589774' },
    { id: 'ge-fee', dir: 'gh-eu', group: 'visa', text: 'Schengen visa fee at the German Embassy: 90 euros, non-refundable if refused. Paid in cash in GHS or by Visa or Mastercard at the interview.', asof: CHECKED, source: 'German Embassy Accra', link: 'https://accra.diplo.de/gh-en/service/-VisaInformation/-/2589774' },
    { id: 'ge-docs', dir: 'gh-eu', group: 'visa', text: 'Bring the full set of documents to the interview in person: documents sent in advance are not considered. The exact list depends on the trip purpose, so read the embassy’s information sheets. Both parents attend for minors.', asof: CHECKED, source: 'German Embassy Accra' },
    { id: 'ge-other', dir: 'gh-eu', group: 'visa', text: 'Apply to the country of your main destination. Fee and process can differ: confirm with that country’s embassy. Other European and Asian destinations are not covered here.', asof: CHECKED, source: 'General rule: confirm with that embassy' },
    { id: 'ge-vfs', dir: 'gh-eu', group: 'visa', text: 'Visa service-centre fees (VFS or similar) are not an official figure here: check with your embassy.', asof: CHECKED, source: 'Your embassy', unconfirmed: true },
    { id: 'ge-uk', dir: 'gh-eu', group: 'visa', text: 'Going to the UK instead? The Standard Visitor visa is £135 for up to 6 months, applied for online, with a decision usually within 3 weeks. Fingerprints and a photo are taken at the appointment. A TB test is needed only for stays over 6 months.', asof: CHECKED, source: 'GOV.UK', link: 'https://www.gov.uk/standard-visitor/apply-standard-visitor-visa' },
    { id: 'ge-uk-docs', dir: 'gh-eu', group: 'visa', text: 'UK documents: passport valid for the whole stay; travel dates, accommodation and estimated trip cost; home address; income if any; offence details. Sometimes also 10-year travel history, employer details, who pays for the trip and certified translations.', asof: CHECKED, source: 'GOV.UK' },
    { id: 'ge-passport', dir: 'gh-eu', group: 'passport', key: 'passport-eu', text: 'The German embassy page for visits mentions a passport valid at least 3 months beyond the stay. Confirm the rule for your destination country.', asof: CHECKED, source: 'German Embassy Accra', unconfirmed: true },
    { id: 'ge-insurance', dir: 'gh-eu', group: 'safety', text: 'Minimum travel insurance cover and exact bank-balance rules were not on the pages read: check your embassy’s information sheet.', asof: CHECKED, source: 'Your embassy', unconfirmed: true },
    { id: 'ge-yf', dir: 'gh-eu', group: 'health', text: 'Carry your yellow fever certificate (valid for life) and check the entry health rules of your destination.', asof: '9 Nov 2026', source: 'CDC; TravelHealthPro', unconfirmed: true }
  ];

  // Visa answer by passport, from the Ghana side (travelling to Ghana).
  var VISA = {
    canada: { text: 'Canada: a visa is required (tourist, business, student).', asof: '2 Nov 2026', source: 'Govt of Canada' },
    uk: { text: 'United Kingdom: a visa is required.', asof: '4 Nov 2026', source: 'UK FCDO' },
    eu: { text: 'EU and Schengen ordinary passports: a visa is required. No EU ordinary passport is on Ghana’s visa-free list.', asof: '2 Dec 2025', source: 'Ghana MFA list' },
    asia: { text: 'A visa is required for your passport: it is not on the visa-free list.', asof: '2 Dec 2025', source: 'Ghana MFA list' },
    singapore: { text: 'Singapore: visa-free on the December 2025 list, but since 25 May 2026 a free ETA is needed before travel.', asof: '23 Jun 2026', source: 'Ghana MFA list; Fragomen' },
    africa: { text: 'African Union nationals: a free online pre-authorisation applies. Check the portal’s nationality checker and your embassy.', asof: CHECKED, source: 'Ghana e-visa portal', unconfirmed: true },
    other: { text: 'Visa rules for your passport are not confirmed here: check with the Ghana High Commission or the e-visa portal before booking.', asof: CHECKED, source: 'Ghana High Commission', unconfirmed: true }
  };
  var VISA_MAP = { canada: 'canada', uk: 'uk', eu: 'eu', china: 'asia', india: 'asia', japan: 'asia', 'south-korea': 'asia', philippines: 'asia', vietnam: 'asia', malaysia: 'asia', pakistan: 'asia', bangladesh: 'asia', singapore: 'singapore', ecowas: 'africa', 'africa-other': 'africa', caribbean: 'other', other: 'other' };

  window.GTR_DATA = {
    checkedOn: CHECKED, groups: G, items: ITEMS, visa: VISA, visaMap: VISA_MAP,
    disclaimer: 'This is general information, not legal or immigration advice. Confirm with the official sources before you travel.'
  };
})();
