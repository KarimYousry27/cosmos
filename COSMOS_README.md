# 🚀 COSMOS — Space Dashboard

COSMOS is a responsive space dashboard built with HTML, CSS, and vanilla JavaScript. It brings together NASA's Astronomy Picture of the Day, upcoming rocket launches, and an interactive guide to the eight planets in our solar system.

I built this project to practice working with APIs, asynchronous JavaScript, DOM manipulation, and responsive layouts.

## ✨ Features

### 🌌 Today in Space
- Explore NASA's Astronomy Picture of the Day (APOD).
- Choose a date to load its available image or video.
- Read the title, description, and other details provided by NASA.

### 🚀 Upcoming Launches
- View upcoming space launches fetched from the Launch Library API.
- See launch dates, times, rockets, providers, and locations when available.
- Open additional launch details using the **Details** buttons.
- Display a fallback image when a launch image is unavailable.

### 🪐 Solar System Explorer
- Select any of the eight planets to update the details panel.
- View each planet's image, description, and key facts.
- Uses a small local JavaScript dataset for planet information.

### 📱 Responsive Interface
- Dashboard layout designed for different screen sizes.
- Section navigation and interactive cards.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS
- Font Awesome
- Fetch API and async/await

## 🌐 Data Sources

- [NASA Astronomy Picture of the Day](https://science.nasa.gov/planetary-science/programs/astronomy-picture-of-the-day/)
- [Launch Library by The Space Devs](https://thespacedevs.com/)
- Local JavaScript data for the Solar System Explorer

External data and images depend on the availability of their respective services.

## 📁 Project Structure

```text
COSMOS/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── index.js
├── images/
│   └── ...
└── readme.md
```

## ▶️ Getting Started

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Open `index.html` with the **Live Server** extension (or another local development server).
4. Explore the dashboard in your browser.

No build step is required.

## 💡 What I Learned

Through this project, I practiced fetching and displaying external data, handling asynchronous operations, updating the DOM in response to user interactions, and building a responsive interface with HTML, CSS, and JavaScript.

---

**COSMOS** is a front-end learning project created to explore space data through a simple, interactive dashboard.
