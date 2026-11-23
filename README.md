# Energy Monitoring Dashboard

My solution for the coding task “Energy Monitoring Dashboard”. A small web app that shows the devices of one energy site (inverters and batteries) and their power during one day. A mock API inside the project creates the data.

- **Part A** Done. Some points are not finished, see below.
- **Part B** Not done.

## Install, run and test

Node 22.22 or newer is needed (React Router v8 needs it).

```bash
npm install
npm run dev        # dev server, normally on http://localhost:5173
npm run test:run   # all tests one time
npm run build      # type check and production build
```

## Tech stack

React 19, TypeScript (strict), Vite, Redux Toolkit with RTK Query, React Router v8, ECharts, Tailwind CSS, Luxon, Vitest and React Testing Library.

## Project structure

- `src/domain` All rules: Berlin days, status, energy, completeness, chart data, filter and sort. Only TypeScript, no React, so it is easy to test.
- `src/api` The mock API with delay, failures and gaps.
- `src/store` Redux store and the RTK Query endpoints.
- `src/components` and `src/pages` The UI. The pages take data from the store, call the domain functions and show the result.

## Main decisions

- **Time zones.** A day starts at midnight in Europe/Berlin and ends at the next midnight in Europe/Berlin. Luxon calculates both. I never add 24 hours. So a normal day has 288 intervals, 29 March 2026 has 276 and 25 October 2026 has 300. One function (`getExpectedSlots`) creates the slots, and the mock, the energy, the completeness and the chart all use it. All times in the UI are in Berlin time.
- **Missing data.** A missing interval means “no data”, not zero. It adds nothing to the energy, and I do not guess values. The chart uses `null` for missing points, so gaps stay visible.
- **Status.** The status is always calculated, never saved. The function gets the current time as a parameter, so it is easy to test. On the list page I use the time when the list was loaded.
- **Quick date changes.** RTK Query saves every device and date in its own cache entry, and the detail page shows `currentData`. So a late answer for an old date does not replace the data on the screen. A component test checks this.

## Assumptions

- Exactly 15 minutes after `lastSeen` is still Online.
- If `lastSeen` cannot be parsed, the device is Offline.
- A reading counts only if its timestamp is exactly on a 5-minute slot of the day. Duplicates count one time.
- Net energy is the sum with signs, so battery charging makes it smaller.

## Tests

37 tests: time slots and daylight saving days, status rule (including exactly 15 minutes and fault), energy and completeness (including missing readings and 29 March / 25 October 2026), chart gaps, filter and sort, and two component tests (error and retry, quick date changes). The tests also pass with another time zone, for example `TZ=America/New_York npm run test:run`.

## Not finished

- The mock data is random and not realistic (for example, power at night), and it is different for every request.
- The mock creates readings in the future for today, and also after `lastSeen` for offline devices.
- No polling, so the status does not update while the page stays open.
- “Device not found” is shown as a normal error with retry. The detail page shows the device id, not the name.
- Part B (Python) is not done.

## Next steps

1. Realistic and reproducible mock data (seed, solar curve, battery plan, no future readings).
2. Polling for the device list.
3. Different error types, and a better detail page header.
4. Part B in Python.