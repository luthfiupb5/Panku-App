# Panku App — Complete UI Redesign Task

## Phase 1: Color System & Global CSS
- [x] Review existing codebase
- [ ] Update [index.css](file:///f:/panku%20app/src/index.css) with new teal/dark color palette from spec
- [ ] Update avatar colors to match spec

## Phase 2: App Architecture & Navigation
- [ ] Redesign [App.tsx](file:///f:/panku%20app/src/App.tsx) — 4-tab bottom bar (Home, Expenses, Summary, Report)
- [ ] Add "back" navigation from event dashboard to home
- [ ] Add new [ReportScreen](file:///f:/panku%20app/src/screens/ReportScreen.tsx#10-145) tab

## Phase 3: Screen Rewrites

### Home / Onboarding Screen
- [ ] Onboarding screen (first visit, no events) — logo, headline, 3 cards, CTA
- [ ] Event list screen — dark cards with shadow, event details

### Event Dashboard
- [ ] Event dashboard header card (gradient) showing total, members, expenses
- [ ] Members section with avatars
- [ ] Expenses list section
- [ ] Floating `+ Add Expense` button

### Create Event Screen
- [ ] Inline create event form (not modal) — event name, members chips

### Add Expense Screen
- [ ] Full-screen add expense form (modal or screen)
- [ ] Checkbox chips for participants

### Settlement / Summary Screen
- [ ] Total expense hero card
- [ ] Member balance cards (positive green / negative red)
- [ ] Settlement instructions with arrow icons

### Graph & Analytics Screen
- [ ] Pie chart (expense distribution)
- [ ] Create the new Teal Dark color palette (CSS variables) [REVERTED]
- [ ] Define utility classes for cards, buttons, and inputs [REVERTED]
- [ ] Implement the global layout foundation [REVERTED]
- [ ] Restructure [App.tsx](file:///f:/panku%20app/src/App.tsx) for 4-tab bottom navigation [REVERTED]
- [ ] Implement the new Header with back button logic [REVERTED]
- [ ] Create the Onboarding experience in [HomeScreen.tsx](file:///f:/panku%20app/src/screens/HomeScreen.tsx) [REVERTED]
- [ ] Redesign the Event List in [HomeScreen.tsx](file:///f:/panku%20app/src/screens/HomeScreen.tsx) [REVERTED]
- [ ] Build the new Dashboard/Expense List screen [REVERTED]
- [ ] Implement category-specific icons and avatars [REVERTED]
- [ ] Redesign the Settlement (Results) screen with debt summary [REVERTED]
- [ ] Implement the Report/Analytics screen with charts [REVERTED]
- [ ] Polishing & Verification [REVERTED]
- [ ] Run dev server and visually verify all screens
- [ ] Verify PDF export still works
- [ ] Write walkthrough
