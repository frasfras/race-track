# ---
name: LEADERBOARD
description: Add professional LEADERBOARD to HTML websites with 
#  localStorage persistence
version: 1.0.0
---

# Leaderboard Skill

## Overview
This Skill provides a standardized implementation for creating dynamic leaderboards in web applications. Use this when users request ranking systems, score tracking.

## When to Use This Skill
- User asks to "create a leaderboard"
- User wants a "ranking system" or "score tracker"
- User mentions displaying "top players" or "high scores"

# JSON Data Structure Example

[
    {
      "rank": 1,
      "vehicle_id": "GR86-002-000",
      "session": "R1_Barber_2025-09-07",
      "summary": {
        "laps_analyzed": 8,
        "duration_seconds": 1542.6
      },
      "features": {
        "mean_throttle": 74.2,
        "mean_brake": 0.13,
        "steering_variability": 12.7,
        "lap_distance_max": 3715.0
      },
      "scores": {
        "aggression": 0.74,
        "smoothness": 0.75,
        "consistency": 0.62,
        "focus": 0.93,
        "adaptability": 0.68,
        "strategy": 0.93,
        "composure": 0.85,
        "composite": 0.79
      },
      "overall_profile": "Strategic Driver",
      "map": {
        "points": [
          { "lat": 33.53258, "lon": -86.61963, "throttle": 0.74 },
          { "lat": 33.53259, "lon": -86.61964, "throttle": 0.52 },
          { "lat": 33.53261, "lon": -86.61967, "throttle": 0.89 }
        ]
      }
    } 
  ]


