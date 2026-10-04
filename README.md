Icarus — Know the Limit

Icarus is a web app for tracking things that have a limit. It can be used for things like study time, screen time, money, pages, tasks, or any other numerical value.

The main idea is simple: **know how close you are to your limit before you cross it.**

Features:

* Create multiple trackers
   Two tracker types:
      Counter — for numbers such as pages, money, tasks, etc.
      Timer — for things measured in time
* Set a custom limit for each tracker
* Increase or decrease counter values
* Choose the amount added or removed each time
* Start, pause and reset timers
* Progress bars showing how close you are to the limit
* Automatic status messages
* Clear warning when a limit is reached or exceeded
* Edit tracker limits
* Delete and reset trackers
* Data is saved in the browser using Local Storage
* Dashboard showing the number of active, approaching and exceeded trackers

Files:

1) index.html

This is the main page of the website. It contains the layout, forms, dashboard and tracker sections.

2) style.css

This contains the styling for the website, including the colours, cards, buttons, progress bars, warnings and responsive layout.

3) script.js

This contains the main functionality of the app. It handles creating trackers, counters, timers, limits, status messages, the dashboard and saving data to Local Storage.

4) README.md

This file contains information about the project and explains what each file does.

## How the limit works

The progress is calculated using:

`(Current Value / Limit) × 100`

The tracker then shows:

* **Below 80%:** Within limit
* **80%–99.99%:** Approaching limit
* **100%:** Limit reached
* **Above 100%:** Limit exceeded

## How to run

There are no extra libraries or installations needed.

Open `index.html` in a modern web browser and the application will run.

## Technologies

* HTML
* CSS
* JavaScript
* Local Storage

## Project

Made for **Codexis Round 3**.

**Icarus — Know the Limit**
