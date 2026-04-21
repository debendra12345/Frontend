# Frontend
# Patient Dashboard – Coalition Technologies Assessment

This project is a single-page web application built as part of the Coalition Technologies technical assessment. The goal was to convert an Adobe XD design into a functional and responsive UI while integrating real-time data from an API.


Working prototype - https://frontend-pied-psi-19.vercel.app/
---

## 🚀 Overview

The application displays patient information by fetching data from the provided API and rendering it dynamically on the UI. The focus was on accuracy to the design, clean code structure, and efficient data handling.

Only the data for **Jessica Taylor** is displayed, as per the requirements.

---

## 🛠️ Tech Stack

- HTML5 (Semantic structure)
- CSS3 (Flexbox & Grid for layout)
- JavaScript (Vanilla JS)
- Chart.js (for data visualization)

---

## ⚙️ Features

- Responsive single-page layout
- API integration using `fetch()`
- Dynamic rendering of patient details
- Filtering and displaying data for a specific patient (Jessica Taylor)
- Blood pressure visualization using Chart.js (systolic & diastolic trends)
- Clean and modular code structure
- Basic error handling for API calls

---

## 📊 Data Handling

- Data is fetched from the provided API endpoint
- Filter logic ensures only **Jessica Taylor’s** data is used
- UI components are populated dynamically using JavaScript
- Chart data is extracted and formatted for visualization

---

## 📁 Project Structure

/project-folder  
│── index.html  
│── styles.css  
│── script.js  
│── README.md  

- **index.html** → Structure of the UI  
- **styles.css** → Styling and layout  
- **script.js** → API calls, data processing, DOM updates, and chart rendering  

---

## 📌 Key Functions

- `fetchPatientData()` → Fetches data from API  
- `filterJessicaTaylor()` → Filters required patient  
- `renderUI()` → Updates UI dynamically  
- `renderChart()` → Displays blood pressure graph  

---

## 🎯 Focus Areas

- Matching the Adobe XD design as closely as possible  
- Writing clean, readable, and maintainable code  
- Avoiding unnecessary features not present in the design  
- Ensuring proper data flow from API to UI  

---

## ⚠️ Notes

- No unnecessary UI interactions were added (as instructed)  
- Focus was kept on design accuracy and core functionality  
- The application is built using **vanilla JavaScript** for simplicity and clarity  

---

## 💡 Possible Improvements

- Add loading skeletons for better UX  
- Improve accessibility (ARIA roles, keyboard navigation)  
- Enhance responsiveness for more screen sizes  
- Add caching for API responses  

---

## 👨‍💻 Author

Debendra Nath Bandyopadhyay  
Computer Science Student | Developer  
