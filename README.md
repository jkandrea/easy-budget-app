# Easy Budget App

> A simple budget tracking web app prototype built with React and Firebase.  
> This app will eventually be converted into a cross-platform native app.

## Overview

Easy Budget App is a lightweight and easy-to-use budget management tool.  
Its main goal is to allow users to track and manage their finances quickly, using a top-down input method rather than entering every transaction individually.

Key features of this prototype:
- Set up multiple bank accounts with nickname and bank name.
- Register initial balances for the current month.
- Update balances in case of previous month discrepancies.
- Add transactions individually or grouped by categories (e.g., monthly card payments, insurance, utilities).
- Multi-level categorization: top-level summary → category sums → individual transactions.

## Tech Stack

- **Frontend:** React
- **Backend/Database:** Firebase Firestore
- **Authentication & Hosting:** Firebase (for now, web prototype)

## Future Plans

- Convert the web prototype into a cross-platform native app using React Native.
- Add additional features such as reports, charts, and offline support.
- Implement automated GitHub Actions workflow for continuous deployment.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/jkandrea/easy-budget-app.git
