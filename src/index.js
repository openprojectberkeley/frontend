import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { hydrate, render } from "react-dom";

function normalizePath(path) {
  if (!path) return '/';
  const normalized = path.replace(/\/+$/, '');
  return normalized || '/';
}

const rootElement = document.getElementById("root");
const snapshotRoute = rootElement
  ?.querySelector('[data-snapshot-route]')
  ?.getAttribute('data-snapshot-route');
const currentRoute = normalizePath(window.location.pathname);
const shouldHydrate = rootElement.hasChildNodes() && normalizePath(snapshotRoute) === currentRoute;

if (shouldHydrate) {
  hydrate(<App />, rootElement);
} else {
  // If the fallback served a different snapshot (e.g. homepage for /about),
  // clear stale markup and perform a fresh client render.
  rootElement.innerHTML = "";
  render(<App />, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
