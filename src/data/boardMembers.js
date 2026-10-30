import placeholder from "../images/about/person-placeholder.svg";

// Exec
import mia from "../images/about/fall2026/mia.thumb.jpg";
import jenny from "../images/about/fall2026/jenny.thumb.jpg";
import anupriya from "../images/about/spring2025/anupriya.thumb.jpg";
import chad from "../images/about/fall2026/chad.thumb.jpg";
import christopher from "../images/about/fall2026/christopher.thumb.jpg";
import ganesh from "../images/about/fall2026/ganesh.thumb.jpg";
import ashleyl from "../images/about/spring2026/ashleyl.thumb.jpg";
import annie from "../images/about/fall2026/annie.thumb.jpg";
import ashleyi from "../images/about/fall2026/ashleyi.thumb.jpg";
import helena from "../images/about/fall2026/helena.thumb.jpg";
import ryan from "../images/about/fall2026/ryan.thumb.jpg";
import jonathan from "../images/about/fall2026/jonathan.thumb.jpg";
import megan from "../images/about/spring2026/megan.thumb.jpg";
import arnav from "../images/about/spring2026/arnav.thumb.jpg";
import ashwika from "../images/about/fall2026/ashwika.thumb.jpg";
import benh from "../images/about/fall2026/benh.thumb.jpg";
import nicole from "../images/about/fall2026/nicole.thumb.jpg";
import sriya from "../images/about/fall2026/sriya.thumb.jpg";
import diego from "../images/about/fall2026/diego.thumb.jpg";
import felicia from "../images/about/fall2026/felicia.thumb.jpg";
import peter from "../images/about/fall2026/peter.thumb.jpg";
import yashom from "../images/about/spring2025/yashom.thumb.jpg";

// Project Managers
import chester from "../images/about/fall2026/chester.thumb.jpg";
import ojasvi from "../images/about/fall2026/ojasvi.thumb.jpg";
import cindy from "../images/about/fall2026/cindy.thumb.jpg";
// import emmanuel from "../images/about/fall2026/emmanuel.thumb.jpg"; // (placeholder for now)
import sainik from "../images/about/fall2026/sainik.thumb.jpg";
import leol from "../images/about/fall2026/leol.thumb.jpg";
import dayton from "../images/about/fall2026/dayton.thumb.jpg";
import james from "../images/about/fall2026/james.thumb.jpg";
import justin from "../images/about/spring2026/justin.thumb.jpg";
import jamil from "../images/about/fall2026/jamil.thumb.jpg";
import karthik from "../images/about/fall2026/karthik.thumb.jpg";
import navya from "../images/about/fall2026/navya.thumb.jpg";
import austin from "../images/about/fall2026/austin.thumb.jpg";
import keira from "../images/about/fall2026/keira.thumb.jpg";
import nishaad from "../images/about/fall2026/nishaad.thumb.jpg";
// import emily from "../images/about/fall2026/emily.thumb.jpg"; // (placeholder for now)
import ayah from "../images/about/fall2026/ayah.thumb.jpg";
import sneha from "../images/about/fall2026/sneha.thumb.jpg";
import janice from "../images/about/fall2026/janice.thumb.jpg";
import miles from "../images/about/fall2026/miles.thumb.jpg";
import matthew from "../images/about/fall2026/matthew.thumb.jpg";
import turner from "../images/about/fall2026/turner.thumb.jpg";
import joseph from "../images/about/fall2026/joseph.thumb.jpg";
import johanna from "../images/about/fall2026/johanna.thumb.jpg";
import siddharth from "../images/about/fall2026/siddharth.thumb.jpg";
import leop from "../images/about/fall2026/leop.thumb.jpg";
import harshini from "../images/about/fall2026/harshini.thumb.jpg";
import zander from "../images/about/fall2026/zander.thumb.jpg";
import caden from "../images/about/fall2026/caden.thumb.jpg";
import benw from "../images/about/fall2026/benw.thumb.jpg";
import melody from "../images/about/fall2026/melody.thumb.jpg";
import haaziq from "../images/about/fall2026/haaziq.thumb.jpg";
// import yuchan from "../images/about/fall2026/yuchan.thumb.jpg"; // (placeholder for now)
// import jason from "../images/about/fall2026/jason.thumb.jpg"; // (placeholder for now)

// Alumni
import ethan from "../images/about/fall2023/ethan.thumb.jpg";
import colin from "../images/about/spring2023/colin.thumb.jpg";
import nick from "../images/about/spring2023/nick.thumb.jpg";
import uyen from "../images/about/fall2023/uyen.thumb.jpg";
import joel from "../images/about/fall2023/joel.thumb.jpg";
import nhu from "../images/about/fall2023/nhu.thumb.jpg";
import jess from "../images/about/spring2024/jess.thumb.jpg";
import christopher_alumni from "../images/about/spring2024/chris.thumb.jpg";
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
        major: "Cognitive Science, Media Studies",
        year: "Senior",
    },
    "Jenny Liang": {
        image: jenny,
        hoverImage: placeholder,
        major: "Data Science, Statistics",
        year: "Senior",
    },
    "Anupriya Islam": {
        image: anupriya,
        hoverImage: placeholder,
        major: "Stats",
        year: "Senior",
    },
    "Chad Park": {
        image: chad,
        hoverImage: placeholder,
        major: "Data Science, Industrial Engineering & Operations Research",
        year: "Senior",
    },
    "Christopher Chang": {
        image: christopher,
        hoverImage: placeholder,
        major: "Data Science & Economics",
        year: "Sophomore",
    },
    "Ganesh Karayi": {
        image: ganesh,
        hoverImage: placeholder,
        major: "Applied Math, Data Science",
        year: "Junior",
    },
    "Ashley Li": {
        image: ashleyl,
        hoverImage: placeholder,
        major: "Analytics",
        year: "Senior",
    },
    "Annie Lin": {
        image: annie,
        hoverImage: placeholder,
        major: "Cognitive Science, Data Science",
        year: "Sophomore",
    },
    "Ashley Iattoni": {
        image: ashleyi,
        hoverImage: placeholder,
        major: "Cognitive Science, Data Science",
        year: "Junior",
    },
    "Helena Zhang": {
        image: helena,
        hoverImage: placeholder,
        major: "Math + Data Science",
        year: "Senior",
    },
    "Ryan Lin": {
        image: ryan,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Jonathan Tran": {
        image: jonathan,
        hoverImage: placeholder,
        major: "Computer Science, Data Science",
        year: "Senior",
    },
    "Megan Nguyen": {
        image: megan,
        hoverImage: placeholder,
        major: "Data Science + Integrative Biology",
        year: "Sophomore",
    },
    "Arnav Mahadev": {
        image: arnav,
        hoverImage: placeholder,
        major: "EECS",
        year: "Junior",
    },
    "Ashwika Gampa": {
        image: ashwika,
        hoverImage: placeholder,
        major: "EECS",
        year: "Senior",
    },
    "Benjamin Huang": {
        image: benh,
        hoverImage: placeholder,
        major: "ECE + Physics",
        year: "Junior",
    },
    "Nicole Ta": {
        image: nicole,
        hoverImage: placeholder,
        major: "Business Administration",
        year: "Junior",
    },
    "Sriya Bandarupalli": {
        image: sriya,
        hoverImage: placeholder,
        major: "Applied Mathematics",
        year: "Sophomore",
    },
    "Diego Llamas": {
        image: diego,
        hoverImage: placeholder,
        major: "Business Administration, Data Science, & Economics",
        year: "Senior",
    },
    "Felicia Ye": {
        image: felicia,
        hoverImage: placeholder,
        major: "Applied Math, Computer Science",
        year: "Junior",
    },
    "Peter Lourenco": {
        image: peter,
        hoverImage: placeholder,
        major: "EECS",
        year: "Junior",
    },
    "Yashom Kapoor": {
        image: yashom,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },

    // Project managers not on the executive team
    "James Apuyan": {
        image: james,
        hoverImage: placeholder,
        major: "Data Science & Economics",
        year: "Sophomore",
    },
    "Turner Osswald": {
        image: turner,
        hoverImage: placeholder,
        major: "Astrophysics, Physics",
        year: "Junior",
    },
    "Jamil Shirinov": {
        image: jamil,
        hoverImage: placeholder,
        major: "Computer Science",
        year: "Sophomore",
    },
    "Leo Li": {
        image: leol,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Janice Lin": {
        image: janice,
        hoverImage: placeholder,
        major: "Applied Math, Data Science",
        year: "Senior",
    },
    "Melody Shane": {
        image: melody,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Senior",
    },
    "Miles Petrick": {
        image: miles,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Johanna Flores": {
        image: johanna,
        hoverImage: placeholder,
        major: "Computer Science",
        year: "Junior",
    },
    "Keira Tan": {
        image: keira,
        hoverImage: placeholder,
        major: "EECS",
        year: "Sophomore",
    },
    "Joseph Ong": {
        image: joseph,
        hoverImage: placeholder,
        major: "Applied Math and Computer Science",
        year: "Sophomore",
    },
    "Zander Rosenzweig": {
        image: zander,
        hoverImage: placeholder,
        major: "Cognitive Science & Data Science",
        year: "Sophomore",
    },
    "Harshini Pulivarthi": {
        image: harshini,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Sneha Atmakur": {
        image: sneha,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Ayah Elzein": {
        image: ayah,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Senior",
    },
    "Navya Lella": {
        image: navya,
        hoverImage: placeholder,
        major: "IEOR",
        year: "Sophomore",
    },
    "Nishaad Sovani": {
        image: nishaad,
        hoverImage: placeholder,
        major: "Statistics + Economics",
        year: "Junior",
    },
    "Siddharth Garimella": {
        image: siddharth,
        hoverImage: placeholder,
        major: "Applied Math + Data Science",
        year: "Sophomore",
    },
    "Emily Yue": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Caden Luu": {
        image: caden,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Sophomore",
    },
    "Austin Tenbrink": {
        image: austin,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Senior",
    },
    "Dayton Phan": {
        image: dayton,
        hoverImage: placeholder,
        major: "Data Science, CS",
        year: "Junior",
    },
    "Matthew Rodrigues": {
        image: matthew,
        hoverImage: placeholder,
        major: "Computer Science + Business",
        year: "Junior",
    },
    "Cindy Wang": {
        image: cindy,
        hoverImage: placeholder,
        major: "Economics + Cognitive Science",
        year: "Junior",
    },
    "Ojasvi Shrivastava": {
        image: ojasvi,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Senior",
    },
    "Chester Duan": {
        image: chester,
        hoverImage: placeholder,
        major: "EECS",
        year: "Senior",
    },
    "Benjamin Wang": {
        image: benw,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Haaziq Kazi": {
        image: haaziq,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Leo Park": {
        image: leop,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Sophomore",
    },
    "Emmanuel Elizalde-Ocampo": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Junior",
    },
    "Justin Le": {
        image: justin,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Justin Le",
    },
    "Sainik Ghosh": {
        image: sainik,
        hoverImage: placeholder,
        major: "Statistics and Economics",
        year: "Junior",
    },
    "Karthik Subramanian": {
        image: karthik,
        hoverImage: placeholder,
        major: "EECS",
        year: "Sophomore",
    },
    "Jason Shorey": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Sophomore",
    },
    "Yuchan Chung": {
        image: placeholder,
        hoverImage: placeholder,
        major: "Data Science",
        year: "Sophomore",
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
        image: christopher_alumni,
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
