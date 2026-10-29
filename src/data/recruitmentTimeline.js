import { CURRENT_SEMESTER, PORTAL_URL } from "./site";

/*
 * When applications close. The recruitment timeline's "Application Due!"
 * entry and the home page's "Join us!" sentence both read this, so the
 * deadline is only ever written here.
 *
 *   date  the short date on the timeline card
 *   day   the long date, e.g. "Saturday, Sep 5th"
 *   time  the time of day it closes
 */
export const applicationDeadline = {
  date: "9/5",
  day: "Saturday, Sep 5th",
  time: "12:00 PM (noon)",
};

// The three steps under the apply page's heading.
export const applySteps = [
  {
    title: "Book a coffee chat",
    text: "Schedule a coffee chat with a board member through Open Portal.",
  },
  {
    title: "Attend an infosession",
    text: "Attend one of our two infosessions and enter the unique code a board member gives you in Open Portal.",
  },
  {
    title: "Rank projects & apply",
    text: "Rank the projects by interest and apply to the ones that excite you most.",
  },
];

export const recruitmentTimeline = [
  {
    "id": "01",
    "date": "8/28",
    "subtitle": "Application Opens!",
    "information": [
      { "text": `Applications are now open for ${CURRENT_SEMESTER}!` }
    ]
  },
  {
    "id": "02",
    "date": "8/26 – 9/6",
    "subtitle": "Coffee Chats",
    "information": [
      { "text": "Schedule through " },
      { "text": "Open Portal", "href": PORTAL_URL },
      { "text": ". Coffee chats can be duo or individual, so bring a friend if you would like!" }
    ]
  },
  {
    "id": "03",
    "date": "8/28",
    "subtitle": "DataBytes",
    "information": [
      { "text": "Join us for DataBytes on " },
      { "text": "Friday, Aug 28th in Hearst Field Annex A1 @ 8PM", "highlight": true },
      { "text": "!" }
    ]
  },
  {
    "id": "04",
    "date": "8/31",
    "subtitle": "Infosession #1",
    "information": [
      { "text": "Our first infosession is on " },
      { "text": "Monday, Aug 31st in GPBB 100 @ 8PM", "highlight": true },
      { "text": "." }
    ]
  },
  {
    "id": "05",
    "date": "9/4",
    "subtitle": "Infosession #2",
    "information": [
      { "text": "Our second infosession is on " },
      { "text": "Friday, Sep 4th in VLSB 2040 @ 8PM", "highlight": true },
      { "text": "." }
    ]
  },
  {
    "id": "06",
    "date": applicationDeadline.date,
    "subtitle": "Application Due!",
    "information": [
      { "text": "Applications are due " },
      { "text": `@${applicationDeadline.time}`, "highlight": true },
      { "text": ` on ${applicationDeadline.day}.` }
    ]
  },
  {
    "id": "07",
    "date": "9/11",
    "subtitle": "Welcome Night",
    "information": [
      { "text": "Welcome Night is on " },
      { "text": "Friday, Sep 11th", "highlight": true },
      { "text": " (invite only)." }
    ]
  }
];
