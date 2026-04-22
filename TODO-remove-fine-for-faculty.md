# Remove Fine for Faculty
Status: Refinement - Remove fine column/text from history tables in faculty dashboards.

## Information Gathered
- student_portal/studentportal.html (Student): Full fine calc ₹10/day >10 days, history fines, popups, notifications.
- student_portal/facultydashboard.html & student_portal/faculty.html (Faculty): Mock `fine: 0`, "overdue" status, 30-day period text, fine mentions in history but no calc.
- libraryDashboard.html (Librarian): General fine calc ₹1/day, not role-specific.
- No role-based fine logic; fines shown universally.

## Plan
- **student_portal/faculty.html & student_portal/facultydashboard.html**: 
  1. Change borrowing period text to "No fines for faculty".
  2. Set all `fine: 0` permanently, remove overdue warnings/popups.
  3. Update history table: Hide/remove fine column or show ₹0.
- **student_portal/studentportal.html**: Add role check (if faculty from localStorage, fine=0).
- **libraryDashboard.html**: Optional - disable fines for faculty IDs.

## Dependent Files
- student_portal/faculty.html
- student_portal/facultydashboard.html
- student_portal/studentportal.html (add faculty check)

## Followup Steps
1. Confirm plan.
2. Edit faculty files.
3. Test login as faculty → no fines shown.
4. Complete.

Confirm plan before edits?
