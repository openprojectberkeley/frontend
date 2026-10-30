// Exec
import mia from "../images/about/spring2025/mia.thumb.jpg"; // President
import jenny from "../images/about/spring2026/jenny.thumb.jpg";
// import anupriya from "../images/about/spring2026/anupriyaalt.thumb.jpg"; // VPP — using placeholder for now
import ashwika from "../images/about/spring2026/ashwika.thumb.jpg";
import yashom from "../images/about/spring2025/yashom.thumb.jpg";
import jonathan from "../images/about/spring2026/jonathan.thumb.jpg"; // VPPD
import benh from "../images/about/spring2026/benh.thumb.jpg";
import diego from "../images/about/spring2026/diego.thumb.jpg"; // VP Finance
// import sophie from "../images/about/spring2026/sophie.thumb.jpg"; // no longer VP Finance
import felicia from "../images/about/spring2026/felicia.thumb.jpg";
import ashleyl from "../images/about/spring2026/ashleyl.thumb.jpg"; // VP Marketing
// import ava from "../images/about/spring2025/ava.thumb.jpg"; // no longer VP Marketing
import ashleyi from "../images/about/spring2026/ashleyi.thumb.jpg"; // VP Design
// import devah from "../images/about/spring2026/devah.thumb.jpg"; // no longer VP Tech
import peter from "../images/about/spring2026/peter.thumb.jpg";
import helena from "../images/about/spring2026/helena.thumb.jpg"; // VP Internals
import karthik from "../images/about/spring2026/karthik.thumb.jpg";
import ryan from "../images/about/spring2026/ryan.thumb.jpg";
// import benr from "../images/about/spring2026/benr.thumb.jpg"; // no longer a project manager
// import yon from "../images/about/spring2026/yon.thumb.jpg"; // no longer VP Client
// import anupriya from "../images/about/spring2026/anupriya.thumb.jpg";
// import jonathan from "../images/about/spring2026/jonathan.thumb.jpg";
// import ashleyi from "../images/about/spring2026/ashleyi.thumb.jpg"; // VP Community
import placeholder from "../images/about/person-placeholder.svg"; // TODO: replace with real photos once available

// Project Managers (Fall 2026) — project assignments TBD, using placeholder photos until real ones are provided
// import karthikeya from "../images/about/spring2026/karthikeya.thumb.jpg"; // CoPatible
// import zehra from "../images/about/spring2026/zehra.thumb.jpg"; // no longer a project manager
// import charmi from "../images/about/spring2026/charmi.thumb.jpg"; // no longer a project manager
import harshini from "../images/about/spring2026/harshini.thumb.jpg";
import sainik from "../images/about/spring2026/sainik.thumb.jpg";
import justin from "../images/about/spring2026/justin.thumb.jpg";
// import anupriya from "../images/about/spring2026/anupriya.thumb.jpg"; // Atlas
// import andre from "../images/about/fall2025/andre.thumb.jpg"; // no longer a project manager
// import erin from "../images/about/spring2026/erin.thumb.jpg"; // no longer a project manager
// import andrew from "../images/about/spring2026/andrew.thumb.jpg"; // not a project manager
import ganesh from "../images/about/spring2026/ganesh.thumb.jpg";
// import jaydens from "../images/about/spring2026/jaydens.thumb.jpg"; // no longer a project manager
import arnav from "../images/about/spring2026/arnav.thumb.jpg";
import chris from "../images/about/spring2026/chris.thumb.jpg";
// import jaydenl from "../images/about/spring2026/jaydenl.thumb.jpg"; // no longer a project manager
import leo from "../images/about/spring2026/leo.thumb.jpg";
// import jonathan from "../images/about/spring2026/jonathan.thumb.jpg"; // IBM
// import diego from "../images/about/spring2026/diego.thumb.jpg";
// import benh from "../images/about/spring2026/benh.thumb.jpg";
// import jenny from "../images/about/spring2026/jenny.thumb.jpg"; // BM
// import mia from "../images/about/spring2026/mia.thumb.jpg";
import annie from "../images/about/spring2026/annie.thumb.jpg";
// import parsa from "../images/about/spring2026/parsa.thumb.jpg"; // no longer a project manager
// import jessica from "../images/about/spring2026/jessica.thumb.jpg"; // no longer a project manager
import megan from "../images/about/spring2026/megan.thumb.jpg";
import nishaad from "../images/about/spring2026/nishaad.thumb.jpg";
// import emily from "../images/about/spring2026/emily.thumb.jpg"; // no longer a project manager
// import david from "../images/about/spring2026/david.thumb.jpg"; // no longer a project manager
// import yashom from "../images/about/spring2026/yashom.thumb.jpg"; // ChessBlitz
// import peter from "../images/about/spring2026/peter.thumb.jpg";
// import noor from "../images/about/spring2026/noor.thumb.jpg"; // no longer a project manager
// import surabhi from "../images/about/spring2026/surabhi.thumb.jpg"; // no longer a project manager
import chad from "../images/about/spring2026/chad.thumb.jpg";
// import ryan from "../images/about/spring2026/ryan.thumb.jpg";
// import felicia from "../images/about/spring2026/felicia.thumb.jpg"; // Syncrate
// import helena from "../images/about/spring2026/helena.thumb.jpg";

// Alumni
import ethan from "../images/about/fall2023/ethan.thumb.jpg";
import colin from "../images/about/spring2023/colin.thumb.jpg";
import nick from "../images/about/spring2023/nick.thumb.jpg";
import uyen from "../images/about/fall2023/uyen.thumb.jpg";
import joel from "../images/about/fall2023/joel.thumb.jpg";
import nhu from "../images/about/fall2023/nhu.thumb.jpg";
import jess from "../images/about/spring2024/jess.thumb.jpg";
import christopher from "../images/about/spring2024/chris.thumb.jpg";
import kitty from "../images/about/spring2024/kitty.thumb.jpg";
import rohan from "../images/about/spring2024/rohan.thumb.jpg";
import zee from "../images/about/fall2023/zee.thumb.jpg";

import { orderedProjects } from "./projectsData";

/*
 * Everyone on the board page this semester, once each - someone on the
 * executive team who also manages a project is still one entry here, so their
 * photo, major and year are only ever typed in one place.
 *
 *   image        the photo on the card
 *   hoverImage   the photo the hover wipe uncovers (placeholder until there is one)
 *   major        shown with year in the label that follows the cursor
 *   year         e.g. "Class of 2027"
 *   link         optional: a LinkedIn or personal site, shown as an icon
 *   coffee_chat  optional: a Calendly or other booking link, shown as an icon
 *
 * The key is the person's name exactly as it is written in `board` below and
 * in each project's `pms` in projectsData.js.
 */
export const people = {
    // Executive team
    "Mia Salinas": {
        image: mia,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Jenny Liang": {
        image: jenny,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Anupriya Islam": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Chad Park": {
        image: chad,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Christopher Chang": {
        image: chris,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Ganesh Karayi": {
        image: ganesh,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Ashley Li": {
        image: ashleyl,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Annie Lin": {
        image: annie,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Ashley Iattoni": {
        image: ashleyi,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Helena Zhang": {
        image: helena,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Ryan Lin": {
        image: ryan,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Jonathan Tran": {
        image: jonathan,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Megan Nguyen": {
        image: megan,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Arnav Mahadev": {
        image: arnav,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Ashwika Gampa": {
        image: ashwika,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Benjamin Huang": {
        image: benh,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Nicole Ta": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Sriya Bandarupalli": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Diego Llamas": {
        image: diego,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Felicia Ye": {
        image: felicia,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Peter Lourenco": {
        image: peter,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Yashom Kapoor": {
        image: yashom,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },

    // Project managers not on the executive team
    "James Apuyan": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Turner Osswald": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Jamil Shirinov": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Leo Li": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Janice Lin": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Melody Shane": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Miles Petrick": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Johanna Flores": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Keira Tan": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Joseph Ong": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Zander Rosenzweig": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Harshini Pulivarthi": {
        image: harshini,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Sneha Atmakur": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Ayah Elzein": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Navya Lella": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Nishaad Sovani": {
        image: nishaad,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Siddharth Garimella": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Emily Yue": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Caden Luu": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Austin Tenbrink": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Dayton Phan": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Matthew Rodrigues": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Cindy Wang": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Ojasvi Shrivastava": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Chester Duan": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Benjamin Wang": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Haaziq Kazi": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Leo Park": {
        image: leo,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Emmanuel Elizalde-Ocampo": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Justin Le": {
        image: justin,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Sainik Ghosh": {
        image: sainik,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Karthik Subramanian": {
        image: karthik,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Jason Shorey": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
    "Yuchan Chang": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Major",
        year: "Class of 20XX",
    },
};

const person = (name) => {
    if (!people[name]) {
        console.warn(`boardMembers: "${name}" has no entry in people`);
        return { name, image: placeholder, hoverImage: placeholder };
    }

    return { name, ...people[name] };
};

// The executive team, in the order the cards are dealt.
export const board = [
    { name: "Mia Salinas", title: "Co-President" },
    { name: "Jenny Liang", title: "Co-President" },
    { name: "Anupriya Islam", title: "VP of Projects" },
    { name: "Chad Park", title: "VP of Projects" },
    { name: "Christopher Chang", title: "VP of Projects" },
    { name: "Ganesh Karayi", title: "VP of Projects" },
    { name: "Ashley Li", title: "VP of Marketing" },
    { name: "Annie Lin", title: "VP of Marketing" },
    { name: "Ashley Iattoni", title: "VP of Design" },
    { name: "Helena Zhang", title: "VP of Internals" },
    { name: "Ryan Lin", title: "VP of Internals" },
    { name: "Jonathan Tran", title: "VP of Professional Development" },
    { name: "Megan Nguyen", title: "VP of Professional Development" },
    { name: "Arnav Mahadev", title: "VP of Professional Development" },
    { name: "Ashwika Gampa", title: "VP of Client" },
    { name: "Benjamin Huang", title: "VP of Client" },
    { name: "Nicole Ta", title: "VP of Externals" },
    { name: "Sriya Bandarupalli", title: "VP of Externals" },
    { name: "Diego Llamas", title: "VP of Finance" },
    { name: "Felicia Ye", title: "VP of Finance" },
    { name: "Peter Lourenco", title: "VP of Tech" },
    { name: "Yashom Kapoor", title: "VP of Tech" },
].map(({ name, title }) => ({ ...person(name), title }));

/*
 * The project managers, worked out from each project's `pms` in
 * projectsData.js rather than listed here, so a PM is added, moved or removed
 * by editing the project. They come grouped by project in the order the
 * projects page shows them, and someone on more than one project is one card
 * listing them all, at the first.
 */
export const projectLeads = (() => {
    const leads = new Map();

    orderedProjects.forEach((project) => {
        project.pms.forEach((name) => {
            if (!leads.has(name)) leads.set(name, { ...person(name), projects: [] });
            leads.get(name).projects.push(project.name);
        });
    });

    return [...leads.values()].map(({ projects: names, ...lead }) => ({ ...lead, project: names.join(", ") }));
})();

export const alumni = [
    {
        name: "Ethan Ikegami",
        link: "https://ethanikegami.com/",
        title: "Co-Founder",
        image: ethan,
        hoverImage: placeholder,
    },
    {
        name: "Nick Litvinov",
        link: "https://www.linkedin.com/in/nick-litvinov-ab04981b5/",
        title: "Co-Founder",
        image: nick,
        hoverImage: placeholder,
    },
    {
        name: "Colin FitzGerald",
        link: "https://www.linkedin.com/in/colinfitzgerald328/",
        title: "Co-Founder",
        image: colin,
        hoverImage: placeholder,
    },
    {
        name: "Uyen Phan",
        link: "https://uyentphan.com/",
        title: "Co-Founder",
        image: uyen,
        hoverImage: placeholder,
    },
    {
        name: "Nhu Vu",
        link: "https://www.linkedin.com/in/nhu-vu-0b9b89215/",
        title: "Co-Founder",
        image: nhu,
        hoverImage: placeholder,
    },
    {
        name: "Joel Jaison",
        link: "https://www.linkedin.com/in/joel-jaison/",
        title: "Co-Founder",
        image: joel,
        hoverImage: placeholder,
    },
    {
        name: "Jessica Lee",
        link: "https://www.linkedin.com/in/jessica-lee-5370b71b4",
        title: "",
        image: jess,
        hoverImage: placeholder,
    },
    {
        name: "Christopher Bannon",
        link: "https://cbannon.com/",
        title: "",
        image: christopher,
        hoverImage: placeholder,
    },
    {
        name: "Kitty Ng",
        link: "https://www.linkedin.com/in/kitty-ng-443678246/",
        title: "",
        image: kitty,
        hoverImage: placeholder,
    },
    {
        name: "Rohan Agarwal",
        link: "https://www.linkedin.com/in/rohan-agarwal-2908321a1",
        title: "",
        image: rohan,
        hoverImage: placeholder,
    },
    {
        name: "Zee Babar",
        link: "https://www.linkedin.com/in/moebabar",
        title: "",
        image: zee,
        hoverImage: placeholder,
    },
];
