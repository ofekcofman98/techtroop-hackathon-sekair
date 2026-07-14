# React + Vite
#SekAir - Social Polling Platform

SekAir is a social polling platform built specifically for classmates to create, answer, and analyze surveys. The application enables users to learn more about each other, discover social connections, and uncover matching voting patterns between peers.

---
##  Quick Links
*   ** Project Presentation:** [ View Our Slides (Google Slides )]
*   (https://docs.google.com/presentation/d/1Y1xHoZkiSM2zMhVr8DxYY3NhbZNhtQGI/edit?usp=drive_link&ouid=114613080574017526198&rtpof=true&sd=true)
*   ** Live Application:** [ Click Here to Visit SekAir ] (https://ofekcofman98.github.io/techtroop-hackathon-sekair/)

##  Team Members & Roles

*   **Ofek Cofman**
    *   *Role:* Survey Creation & Content Management (View & Controller)
    *   *Key Areas:* Dynamic form state, dashboard category filtering, and the classmate matching algorithm.
*   **Matan Maabari**
    *   *Role:* Infrastructure & Profile (Data Layer)
    *   *Key Areas:* `supabase.auth`, RLS policies, and creator conditional survey deletion.
*   **Darya Abbassov**
    *   *Role:* Voting, Analytics & Real-time (Business Logic)
    *   *Key Areas:* Preventing duplicate voting, data visualization charts, and visual result screens.

---
##  Technical Highlights & Core Engine

*   **Multi-Question Creation:** Handled complex state management for dynamic forms, allowing users to create multi-question surveys under custom categories.
*   **Anonymity Control:** Full flexibility to set surveys as either completely Anonymous (strict privacy) or Public (displaying voter profiles via badging).
*   **Secure Access & Deletion:** Enforced via route guards and Supabase RLS, ensuring only authenticated users can enter, and only the original creator can delete a survey.
*   **Ballot Lock & Smooth Transitions:** Implemented checkups to verify if a user already voted based on their User ID. Once a vote is submitted, the system immediately locks the ballot and reroutes the user directly to the live results without page flickering.
*   **Nested Response Parser:** Processes flat database rows of voter data from Supabase into structured MobX states to calculate exact percentages dynamically.
*   **Personal Dashboard:** Dedicated profile tabs tracking "My Surveys" and "Answered Surveys" for seamless content management and searching classmates by username.
*   **Classmate Alignment Algorithm & Social Connections:** A custom matching system that parses and compares a student's non-anonymous survey answers against their classmates' to mathematically extract and display their closest peers based on shared interests.

---
##  Tech Stack
*   **Frontend:** React, Vite, MobX, Mantine (UI & Charts)
*   **Backend & DB:** Supabase (Database, Auth, Row-Level Security)

