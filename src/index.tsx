import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//---Expectations---
// Create this project in your github account and share the link to it after you are done.
// You should think about the UI and UX of your app.
// But all UX is up to you, you can use any UI library
// You should think about the state management of your app.
// You should build this application using Reactjs(Typescript will be a plus).

// ---Data Table Challenge---

// ---- Step 1 -----
// Display the data provided in src/data.json in tabular form using Tanstack Table Library.
// The keys of each object will be the header of the table.

// ---- Step 2 -----
// The table cells must be editable. On edit, highlight the cell that was edited.

// ---- Step 3 -----
// The page will have a Save button to save all the changes. The updated data should be persisted on page refresh.

// ---- Step 4 -----
// Add a search input for each column to allow searching for values in a column.

// ---What we are looking for---
// Simple, clear, readable code: How well structured it is? Clear separation of concerns? Can anyone just look at it and get the idea to what is being done? Does it follow any standards?
// Correctness: Does the application do what it promises? Can we find bugs or trivial flaws?
// Memory & Peformance efficiency: How will it behave in case of large datasets? Are results cached? Do you have debounce on your search?
// Testing: How well tested your application is? Can you give some metrics?

// ---Questions & Delivery---
// If you have any questions to this challenge, please do reach out to us.
// The challenge should be delivered as a link to a public git repository

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
