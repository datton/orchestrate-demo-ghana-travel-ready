/* Sample suggestions by budget tier (Senior Developer 3). window.GTR_PICKS.render(answers, container).
   All content is SAMPLE: price bands only, no companies, no bookings. */
(function () {
  'use strict';
  var TIERS = [
    { id: 'budget', label: 'Budget', band: '$' },
    { id: 'mid', label: 'Comfortable', band: '$$' },
    { id: 'comfort', label: 'Premium', band: '$$$' }
  ];

  var DATA = {
    toGhana: {
      title: 'Ideas for your trip to Ghana',
      flights: {
        budget: [['A one-stop flight with a longer layover', 'Usually the lowest fare band. Allow time between flights and keep your onward documents handy.'], ['Flexible dates, midweek travel', 'Midweek departures are often cheaper than weekends. Compare a few days either side.']],
        mid: [['A one-stop flight with a short connection', 'A balance of price and travel time.'], ['A direct overnight flight where one is offered', 'Arrive in Accra in the morning after a night in the air. Direct routes vary by season.']],
        comfort: [['A direct overnight flight with extra legroom', 'The shortest journey to Accra, with more room to rest.'], ['Flexible fare you can change', 'Costs more, but lets you change dates if plans move.']]
      },
      stays: {
        budget: [['A guesthouse near the centre', 'Simple private room, shared or small kitchen, usually a short ride from the main sights.'], ['A hostel dorm bed', 'The cheapest band, and a good way to meet other travellers.']],
        mid: [['A small boutique hotel', 'Private room, breakfast included, a quieter street.'], ['A self-catering apartment', 'Useful for longer stays or travelling as a family.']],
        comfort: [['A beachfront hotel on the coast', 'Pool, restaurant and an easy base for day trips.'], ['A city hotel with airport transfer', 'Short, easy first night after a long flight.']]
      },
      sights: {
        budget: [['Cape Coast Castle', 'A historic fort on the coast near Cape Coast. Check opening hours and fees with the site before you go.'], ['Accra', 'Ghana’s capital. A good base for your first days.']],
        mid: [['Kakum National Park', 'A national park and one of Ghana’s most visited attractions. Check opening hours and fees before you go.'], ['Elmina Castle', 'A historic fort on the coast, often visited with Cape Coast Castle and Kakum as a day trip.']],
        comfort: [['Mole National Park', 'Ghana’s largest protected area, in the Northern Region, with wildlife such as elephants and buffalo. Allow extra days for the journey.'], ['Kumasi', 'One of Ghana’s major cities, a stop if you want to see beyond the coast.']]
      }
    },
    fromGhana: {
      title: 'Ideas for your trip from Ghana',
      flights: {
        budget: [['A one-stop flight from Accra with a longer layover', 'Usually the lowest fare band. Check transit rules for the connecting country.'], ['Flexible dates, midweek travel', 'Compare a few days either side of your preferred date.']],
        mid: [['A one-stop flight with a short connection', 'A balance of price and travel time.'], ['A direct flight from Accra (ACC) where one is offered', 'Direct routes vary by season, so check what is flying on your dates.']],
        comfort: [['A direct overnight flight with extra legroom', 'The shortest journey, with more room to rest.'], ['Flexible fare you can change', 'Costs more, but lets you change dates if plans move.']]
      },
      stays: {
        budget: [['A hostel or shared room near public transport', 'The cheapest band, and well placed for getting around without a car.'], ['A simple guesthouse outside the busiest centre', 'Lower prices a short ride from the main sights.']],
        mid: [['A small hotel in the city centre', 'Private room, breakfast included, walkable to the sights.'], ['A self-catering apartment', 'Useful for longer stays or travelling as a family.']],
        comfort: [['A central hotel with a concierge', 'Easy help with tickets, transport and local tips.'], ['A hotel close to the main station', 'Convenient for day trips by train.']]
      },
      sights: {
        budget: [['A historic old town on foot', 'Free to wander, with churches, squares and markets close together.'], ['Public parks and riverside walks', 'A relaxed, low-cost way to see a city.']],
        mid: [['A major city museum', 'Check the opening days and book a time slot if the museum offers one.'], ['A day trip by train', 'Regional trains make it easy to see a second town.']],
        comfort: [['A guided city tour with a local expert', 'Small groups and a flexible pace.'], ['A countryside day out', 'Landscape, villages and local food away from the crowds.']]
      }
    }
  };

  var SECTIONS = [['flights', 'Flights', '✈'], ['stays', 'Places to stay', '⌂'], ['sights', 'Things to see', '★']];
  var uid = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // Field values from pages/readiness.html: direction eu-gh | gh-eu; budget lean | comfortable | premium.
  function pickDirection(a) { return a && a.direction === 'gh-eu' ? 'fromGhana' : 'toGhana'; }
  function pickTier(a) {
    var b = a && a.budget;
    return b === 'premium' ? 'comfort' : b === 'comfortable' ? 'mid' : 'budget';
  }

  function card(item, band, icon) {
    return '<li class="picks__card"><span class="picks__icon" aria-hidden="true">' + icon + '</span>' +
      '<div><h4>' + esc(item[0]) + '</h4><p>' + esc(item[1]) + '</p>' +
      '<p class="picks__meta"><span class="picks__band" title="Price band, not a price">' + band + '</span>' +
      '<span class="picks__sample">Sample suggestion</span></p></div></li>';
  }

  function render(answers, container) {
    if (!container) return;
    answers = answers || {};
    var dirKey = pickDirection(answers), set = DATA[dirKey], tier = pickTier(answers), id = 'picks' + (++uid);
    container.classList.add('picks');

    function draw() {
      var info = TIERS.filter(function (t) { return t.id === tier; })[0];
      container.innerHTML =
        '<h3 class="picks__title">' + esc(set.title) + '</h3>' +
        '<p class="picks__note">Sample ideas only: price bands, not prices. Nothing here can be booked, and availability is not checked.</p>' +
        '<div class="picks__tabs" role="tablist" aria-label="Budget">' + TIERS.map(function (t) {
          return '<button type="button" role="tab" id="' + id + '-' + t.id + '" class="picks__tab" aria-selected="' + (t.id === tier) + '" tabindex="' + (t.id === tier ? 0 : -1) + '" data-tier="' + t.id + '">' + esc(t.label) + ' <span aria-hidden="true">' + t.band + '</span></button>';
        }).join('') + '</div>' +
        '<div class="picks__panel" role="tabpanel" aria-labelledby="' + id + '-' + tier + '">' + SECTIONS.map(function (s) {
          return '<section class="picks__group"><h4 class="picks__h">' + s[1] + '</h4><ul class="picks__list">' + set[s[0]][tier].map(function (it) { return card(it, info.band, s[2]); }).join('') + '</ul></section>';
        }).join('') + '</div>';
      var tabs = container.querySelectorAll('.picks__tab');
      Array.prototype.forEach.call(tabs, function (b, i) {
        b.addEventListener('click', function () { tier = b.getAttribute('data-tier'); draw(); container.querySelector('.picks__tab[aria-selected="true"]').focus(); });
        b.addEventListener('keydown', function (e) {
          var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!n) return; e.preventDefault();
          tier = TIERS[(i + n + TIERS.length) % TIERS.length].id; draw();
          container.querySelector('.picks__tab[aria-selected="true"]').focus();
        });
      });
    }
    draw();
  }

  window.GTR_PICKS = { render: render };
})();
