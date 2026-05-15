# Tip-Out Calculator — Project Context

## Overview
Single-file web app (`index.html`) hosted on GitHub Pages at `https://vinny4567.github.io/tipout/`. Used by restaurant manager Vinny to calculate tip-outs for staff. All code lives in one `index.html` file (~62,000 chars).

## Repo
- GitHub: `vinny4567/tipout`
- Branch: `main`
- Deploys automatically via GitHub Pages (Actions build takes ~40s)
- Cache-bust deployments with `?v=TIMESTAMP` query param

## App Structure
Four tabs: **Employees**, **Private Party**, **Settings**, **Report**
- Tab switching: `switchTab('input'|'party'|'settings'|'report')`
- Panel IDs: `panel-input`, `panel-party`, `panel-settings`, `panel-report`

## Roster (employees by role)
- **Servers** (19): Angelo Notarangeli, Ashley Penick, Ava Fangmann, Carter Bergholtz, Cody Brickner, Colleen Morgan, Connor Batogowski, Emma Dawson, Ernest Notarangeli, Gyselle Tavizon, Hannah Pierce, Isabel Wilde, Jaden Tareta, Jared Malek, Kristina Mastrino, Mike Fornero, Trinette Notarangeli, Valerie Mitchell, Vincent Notarangeli
- **Bartenders** (8): Gyselle Tavizon, Haley Cassells, Kirsten O'Hara, Martin Rife, Michael Goodwin, Nancy Newell, Pricilla Lagace, Robin Jaramillo
- **Bussers** (21): Addison Feldmann, Allison Wolf, Angel Morales, Carter Berning, Dennis Anderson, Drew Murphy, Erin Burke, Jackson Trotta, Jason Hornbaker, Kamila Skorupskas, Katelyn Batogowski, Kayleigh Knight, Lauren Jennings, Luke Johnson, Matthew Kralik, Micah Fiore, Ryan Walsh, Sona Hudakova, Susah Hurwitz, Taylor Kunka, Will Harvey
- **Food Runners** (6): Carson Cassell, Drew Mastrino, Drew Murphy, Lexi Allen, Preston Rose, Sean Young

## Tipout Logic

### Regular Tipout (Employees tab)
- Servers enter their tips
- Bussers and Runners enter hours worked
- Tipout percentage is configurable in Settings (default 20%)
- Servers tip out a percentage of their tips, split among bussers/runners by hours

### Private Party Tipout
- Single tip amount entered for the party
- Split: **70% servers keep**, **20% busser pool**, **10% bartender pool**
- Each pool divided equally among employees in that role
- Only Servers, Bartenders, and Bussers on the party tab (no Runners)

## Key Functions
- `renderEmployees()` — renders Employees tab dropdowns (line ~780)
- `renderPartyEmployees()` — renders Private Party tab dropdowns (line ~1171)
- `calculateParty()` — calculates party tipout distribution
- `syncToGoogleSheets()` — saves regular report to Google Sheets (has "Are you sure?" confirmation)
- `syncPartyToGoogleSheets()` — saves party report to Google Sheets (has "Are you sure?" confirmation)
- `switchTab(tabName)` — switches between tabs

## Google Sheets Integration
- Uses Google Apps Script (Code.gs) deployed as web app
- Script URL stored in Settings tab
- Secret key: `vtip-9f3k-x82m-p47w`
- Both save buttons have "Are you sure?" confirmation (first click shows confirmation, reverts after 3s, second click saves)

## Recent Changes (April 2026)
- Compact UI CSS for iPad dimensions (1024x768)
- Employee dropdowns filtered by role (each section only shows employees belonging to that role)
- Dropdowns sorted alphabetically by first name using `.sort((a, b) => a.localeCompare(b))`
- Fixed `calculateParty()` — replaced undefined `tipoutAmount` with `(busserPool + barPool)`
- Fixed duplicate `const btnText` declaration that was breaking all JS after that point
- Added "Are you sure?" confirmation to both Save to Google Sheets buttons

## Code Style
- 2-space indentation
- Mix of `const`/`let` and `var` (older code uses `var`)
- Inline HTML templates using template literals
- No build tools — everything is in one HTML file

## Common Pitfalls
- Don't declare `const` or `let` with the same name as an existing `var` in the same function scope — causes SyntaxError that breaks ALL subsequent JS
- After committing, wait for GitHub Actions build (~40s) before testing live site
- Use cache-busting `?v=` param when testing deployments
