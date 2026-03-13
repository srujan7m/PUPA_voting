# PUPA Makers Movement User Flow

This document explains how the application works for the three main user groups:

- Voters
- Team representatives
- Admins at the voter desk

It is written as a practical guide for using the system during the event.

## 1. System Overview

The application supports a stall-based innovation voting process.

Main idea:

- Each project is assigned to one stall/team number.
- Team representatives fill in their stall details before or during the event.
- Voters browse stalls, choose one team, and submit their mobile number.
- The vote is not counted immediately.
- An admin at the voter desk verifies the voter and approves or denies the submission.
- Only approved votes are counted in the results.

## 2. Public Pages

### Home page
Route: `/`

Purpose:

- Introduces the event
- Lets users go to the teams page
- Lets users view leaderboard/results

### Teams page
Route: `/teams`

Purpose:

- Shows all stalls/teams
- Lets a voter open a stall preview
- Lets a voter select exactly one team
- Lets a voter submit their vote for admin verification

### Team details page
Route: `/team/[id]`

Purpose:

- Shows a single team in detail
- Displays uploaded stall image, description, and members if available

### Leaderboard / results
Routes:

- `/leaderboard`
- `/results`

Purpose:

- Displays vote standings based on approved votes only

## 3. Voter Flow

### Step 1: Open the teams page
The voter opens `/teams` and sees all stall cards.

### Step 2: Browse and inspect a stall
The voter can click a stall card to open a preview modal.

The preview may show:

- Stall number
- Team or project name
- Description
- Team members
- Uploaded image
- Current vote count

### Step 3: Select one team
The voter can select only one team.

Important rule:

- The system now allows only one vote per voter session.

### Step 4: Submit mobile number
After selecting a team, the voter clicks the submit button.
They are then asked to enter a mobile number.

This submission creates a pending vote request.

### Step 5: Admin verification
The voter must go to the voter desk and show the phone/mobile number to the admin.

The vote status becomes one of the following:

- `PENDING`: waiting for admin action
- `APPROVED`: vote counted successfully
- `DENIED`: vote rejected, voter can retry

### Step 6: Vote completion
If approved:

- The vote is permanently recorded
- Vote count is incremented for the selected team
- The voter cannot cast another vote

If denied:

- The voter may return and submit again

## 4. Team Representative Flow

### Step 1: Open setup page
Route: `/setup`

This page is for stall/team representatives.

### Step 2: Select stall
The representative chooses the stall from the dropdown.

Current behavior:

- Stalls are shown as `Stall #1`, `Stall #2`, and so on
- Seeded data does not contain fake project descriptions anymore

### Step 3: Enter team PIN
The representative enters the PIN assigned to the stall.

This is used to protect editing access.

### Step 4: Fill team details
The representative can update:

- Team / project name
- Project description
- Team members
- Stall image

### Step 5: Upload image
The representative can upload one image.

Current upload behavior:

- Supported formats: JPG, PNG, WebP, GIF, AVIF
- Upload is processed on the server
- File is stored and later shown in stall preview/details

### Step 6: Save profile
When saved successfully, the team profile is updated and visible to voters.

## 5. Admin Flow

### Step 1: Open admin login
Route: `/admin`

The admin enters the 6-digit admin PIN.

### Step 2: Open dashboard
Route: `/admin/dashboard`

This is the voter-desk approval screen.

The dashboard shows pending submissions with:

- Mobile number
- Submission time
- Selected team

### Step 3: Verify voter
The admin asks the voter to show the mobile number on their phone.

The admin compares that number with the pending entry.

### Step 4: Approve or deny
If valid:

- Click `Approve`
- The vote is committed to the database
- Vote count is increased
- Pending request becomes `APPROVED`

If invalid:

- Click `Deny`
- Pending request becomes `DENIED`
- Voter may resubmit later

### Step 5: View leaderboard
Route: `/admin/leaderboard`

The admin can monitor results and rankings.

## 6. Vote Status Rules

The system is designed to support controlled voting.

### One vote only
A voter can vote for only one team.

### Approval required
Votes are not counted at submission time.
They are counted only after admin approval.

### Duplicate protection
The system uses the browser voter token and pending/approved status checks to reduce duplicate voting.

## 7. Data Reset / Operations

The project includes two useful maintenance commands.

### Clear details but keep teams
Command:

```bash
pnpm run db:clear
```

What it does:

- Deletes votes
- Deletes pending votes
- Deletes voter records
- Clears team details such as description, members, images, and vote counts
- Keeps team/stall rows intact

### Full reseed of teams
Command:

```bash
pnpm exec prisma db seed
```

What it does:

- Clears vote-related data
- Recreates team rows
- Seeds clean stall entries only

## 8. Practical Event Flow

A simple real-world event sequence looks like this:

1. Organizer seeds the stalls before the event.
2. Team representatives open `/setup` and complete their stall profiles.
3. Voters browse `/teams` and choose one stall.
4. Voters submit their mobile number.
5. Admin verifies the number at the desk.
6. Admin approves or denies the request.
7. Approved votes appear in the leaderboard.

## 9. Important Notes

- A vote is not final until the admin approves it.
- Team data can be edited from the setup page after PIN verification.
- Uploaded stall images are stored separately and displayed in previews/details.
- If the database is cleared, voter history and pending approvals are removed.
- If the database is reseeded, teams are recreated in a clean state.
