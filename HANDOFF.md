# Pesta Sukan 2026 – Usability Test Prototypes: Handoff Document

## Overview

This folder contains 6 interactive HTML/CSS/JS prototypes for usability testing of the Pesta Sukan 2026 Participant Portal registration flows. Each prototype is a self-contained HTML file that can be loaded on a phone or desktop browser.

**To run:** `cd prototype && python3 -m http.server 3456` then open `http://localhost:3456`

---

## Flows

| # | File | Persona | Description |
|---|------|---------|-------------|
| 1 | `individual-registration.html` | Darren Ho Jun Le | Adult registers himself for Pickleball Open Men's Singles |
| 2 | `parent-registration.html` | Mabel Chan Poh Long (parent) | Parent registers child (Jamie Sng Li Wei) for Pickleball Girls' Youth U14 Singles |
| 3 | `team-invite.html` | Abigail Rish Kanageswari D/o Loganathan | Invited member joins Team Rocket for Basketball 5v5 Women's Open |
| 4 | `indemnity.html` | Mabel Chan Poh Long (guardian) | Parent acknowledges indemnity for Jamie Sng Li Wei in Basketball 5v5 Women's Open |
| 5 | `team-registration-desktop.html` | Darren Ho Jun Le (team manager) | Desktop: Team manager registers Team Rocket for Basketball 5v5 Women's Open |
| 6 | `team-manager.html` | Darren Ho Jun Le (team manager) | Mobile: Team manager dashboard — manage team, view members |

---

## Flow Details

### Flow 1: Individual Registration
**Screens:** Event page → Singpass → Choose role → Athlete details form → Review → Payment → Success → Registration summary → Your games

**Key interactions:**
- Singpass pre-fills: Name (readonly), NRIC (readonly), DOB (readonly), Gender (readonly), Citizenship (readonly), Mobile, Email
- Emergency contact section must be filled manually
- Declaration with numbered list, checkbox in gray box
- Payment auto-fills on first field focus
- Success screen with fireworks, auto-advances in 3 seconds
- "Your games" page accessible after registration via close button on summary
- Event page footer changes to "Registered" state after completing the flow

---

### Flow 2: Parent Registration
**Screens:** Event page → Singpass → Choose role → Athlete + Parent details form → Review → Payment → Success → Registration summary → Your games

**Key interactions:**
- Choose role: "Yes" option is disabled (grayed out), "No, registering for child" pre-selected
- Athlete details are BLANK (parent enters child's info manually)
- Date of birth: single text field with "DD / MM / YYYY" placeholder
- Gender: pre-filled as "Female" (static, not dropdown)
- Citizenship dropdown: Singapore Citizen, Permanent Resident, Foreigner with valid pass
- "Your details" section: pre-filled from Myinfo (name readonly, mobile/email editable)
- "Are you the athlete's parent?" — Yes/No toggle with check/cross icons
  - Clicking "Yes" reveals "Use my contact in case of emergencies" checkbox
  - Checking checkbox → hides Emergency contact section, auto-fills it with parent's details
  - Unchecking → shows Emergency contact section again
- Declaration references parent/legal guardian in item 7
- Event hero has dark gradient background with white text

---

### Flow 3: Team Invite (Join as Member)
**Screens:** Invite landing → Singpass → Choose role → Athlete details form → Review → Success → Team registration details

**Key interactions:**
- Landing page: full-screen gray background with "Join Team Rocket" centered
- Singpass pre-fills: Name (readonly), NRIC (readonly), DOB (readonly), Gender (readonly), Citizenship (readonly), Mobile, Email
- Jersey number is a required field
- Success screen: "{Name} has joined **Team Rocket** in Basketball 5v5 Women's Open"
- Team registration details page:
  - Curved gray header with Team Rocket info
  - Team members card: AR (age 30), JS with "Has not submitted indemnity" banner, NA
  - Clicking any member opens bottom sheet with full details + Edit/Remove buttons
  - Team manager and Team details cards with info

---

### Flow 4: Acknowledge Indemnity
**Screens:** Landing → Singpass → Indemnity form → Success

**Key interactions:**
- Landing: full-screen gray, "Acknowledge indemnity for **Jamie Sng Li Wei** to participate in **Basketball 5v5 Women's Open**"
- Form has "Are you the athlete's parent or legal guardian?" Yes/No toggle
  - Clicking "No" shows error: "You must be the parent or legal guardian..."
- "Use my contact in case of emergencies" checkbox → hides emergency section, fills with parent's data
- Declaration with numbered list including item 7 about parent/legal guardian
- Success screen: "Indemnity submitted"

---

### Flow 5: Team Registration (Desktop)
**Screens:** Event page → Singpass (screenshot) → Form Step 1 → Review → Payment → Success → Team summary (empty) → Add members → Add members review → Team summary (with members)

**Key interactions:**
- Event page: desktop layout with nav bar, dark gradient hero, eligibility + next steps + rules
- Singpass: static screenshot image, click anywhere to continue
- Form has labeled progress steps: "Team details / Review / Payment"
- Back button and X aligned to form content width (560px centered)
- Name of team manager is readonly (from Singpass)
- Review shows "Input text" as placeholder for unfilled fields
- Payment auto-fills, shows alert about member requirement
- Success: fireworks, "Team Rocket is headed to Basketball 5v5 Women's Open"
- Team summary (empty): 0/9 members, "No members yet" empty state
- "Share team invite link" opens invite modal with copy link
- "Add members manually" opens add-members form:
  - Dynamic athlete sections (up to 15)
  - Accordion: only 1 section expanded at a time
  - Section header: "Athlete N: {name}" updates live, tick icon when all fields complete
  - Sticky section header while scrolling
  - "Remove member" with bin icon (minimum 1 section)
  - "+ Add another member" adds new section, collapses previous, scrolls to new
  - Team eligibility card at top with current member count
  - "Review" button → review page with static data
  - "Add members to team" → team summary now showing 3 members (AR, JS with warning, NA with warning)

---

### Flow 6: Team Manager Dashboard
**Screens:** Team registration details → Your games (dashboard)

**Key interactions:**
- Team registration details page:
  - Sticky "Pesta Sukan 2026" header, curved gray top section
  - Alert: "Add at least 6 more members!"
  - Team members: AR (with dark "Has not submitted indemnity" banner), JS (with same banner), NA
  - Clicking any member → bottom sheet with full details + Edit/Remove
  - "Share team invite link" → invite modal
  - Team manager + Team details cards with Edit buttons
- "Your games" dashboard (via close button):
  - Your team: Basketball Women's Open 5v5, "Team Rocket" card with "Still missing 3 team members"
  - Your child's games: Pickleball Girls' Youth U14 Singles, "Jamie Ho Yun Ling"
  - Athletes you manage: Basketball Men's Open 5v5 with "Team Airplane" + "Show more" toggle, Girls' Youth U14 5v5

---

## Shared Design System

### Files
- `shared/styles.css` — All component styles, design tokens, responsive layout
- `shared/components.js` — Screen navigation, form validation, timers, Singpass mock, fireworks, invite modal, payment autofill

### Design Tokens (Grayscale)
| Token | Value | Usage |
|-------|-------|-------|
| Buttons/primary | `#333` | Primary CTAs |
| Text dark | `#282828` | Headings, body text |
| Text medium | `#393939` | Labels, secondary text |
| Text light | `#686868` | Helpers, placeholders |
| Borders | `#D0D0D0` | Input borders |
| Background light | `#F5F5F5` | Cards, disabled fields |
| Error (semantic) | `#D32F2F` | Validation errors |
| Success (semantic) | `#2E7D32` | Success states |
| Warning (semantic) | `#ED6C02` | Countdown timers |

### Key UX Patterns
1. **Singpass mock**: Clicking the Singpass page (HTML recreation with QR code) advances to the next screen
2. **Read-only fields**: Name, NRIC, DOB, Gender, Citizenship — pre-filled from Singpass, cannot be edited
3. **Editable fields**: Mobile, Email — pre-filled but user can change
4. **Validation**: Always-enabled buttons; errors shown on submit; live revalidation clears errors on input
5. **Clear button**: Only visible when field has content
6. **Declaration**: Full numbered list visible in form step; collapsible with "Show more ∨" in review step
7. **Checkbox**: Gray box styling in forms; readonly gray in review
8. **Payment autofill**: Clicking any card field fills all card fields with mock data
9. **Success screen**: Grayscale firework particles, auto-advances after 3 seconds
10. **Countdown timer**: Visual "Holding your slot for XX:XX mins" in footer (does not expire)
11. **Bottom sheet**: For member details on mobile, with dark overlay, Edit/Remove buttons
12. **Invite modal**: Centered dialog with copy link functionality

### Assets
- `shared/singpass-logo.png` — Singpass logo image
- `shared/singpass-desktop.png` — Desktop Singpass login screenshot (click-through)
- `shared/singpass-login.png` — Mobile Singpass screenshot (unused, HTML recreation used instead)

---

## Testing Checklist

### Before each session
- [ ] Start server: `cd prototype && python3 -m http.server 3456`
- [ ] Open `http://localhost:3456` on test device
- [ ] Select the appropriate flow from the index page
- [ ] Verify Singpass click-through works
- [ ] Verify form fields are interactive

### Per-flow checks
- [ ] Can navigate forward through all screens
- [ ] Back button returns to previous screen
- [ ] Validation errors appear when submitting empty required fields
- [ ] Validation errors clear when field is filled
- [ ] Pre-filled readonly fields cannot be edited
- [ ] Pre-filled editable fields can be cleared and retyped
- [ ] Payment autofill works on first field focus
- [ ] Success screen auto-advances or tap to skip
- [ ] Summary/registration details page shows correct data
- [ ] Close button navigates to "Your games" (where applicable)

---

## Notes for Facilitator

- All prototypes are **self-contained HTML files** — no build step, no npm, no framework
- Flows are designed for **mobile-first** (max-width 480px) except Flow 5 (desktop)
- The Singpass page is a **mock** — it does not perform any real authentication
- Payment fields accept **any input** — no real card validation
- Timer countdown is **visual only** — session never actually expires
- Data entered in forms carries to review/summary screens via JavaScript
- The "Your games" dashboard is the **end state** after registration — represents what the user would see next time they open the app
