// Projects Data - what every semester shares. Each semester's projects and logos
// are in its own file in ./projects, and the current one is CURRENT_SEMESTER in
// site.js.
import { CURRENT_SEMESTER } from './site';
import fall2026 from './projects/fall2026';
import spring2026 from './projects/spring2026';
import fall2025 from './projects/fall2025';
import spring2025 from './projects/spring2025';
import fall2024 from './projects/fall2024';
import spring2024 from './projects/spring2024';
import fall2023 from './projects/fall2023';
import spring2023 from './projects/spring2023';

export const sectionInfo = {
  studio: {
    title: "OP Studio",
    description: "For returning members looking to be involved in a more serious client project. Working with more experienced devs and PMs, you'll hone your skills and learn what tech looks like in industry.",
    color: "#9BE9FF" // blue
  },
  launch: {
    title: "OP Launch",
    description: "Your first steps in Open Project. Projects in OP Launch help grow your fundamentals in development and systems while becoming a part of our growing OP community! We have lots of passion and client projects - there's something here for everyone.",
    color: "#FDFFBC" // yellow
  }
};

export const projectTypes = [
  "Full-Stack Applications: web and mobile software products",
  "Data & Analytics: AI chatbots, machine learning pipelines, dashboards",
  "Systems & Internal Tools: APIs, backend design, automation"
];

/*
 * What goes in a project, in the files in ./projects.
 *
 * Each project's `accent` is the colour of its tile on the projects page: the
 * tile rests on a faint, desaturated gradient of it and fills with it on hover,
 * with its text turning dark on an accent too light for white - see accentInk
 * in accentInk.js. `difficulty`, where known, is beginner, intermediate or
 * advanced. `tagline` is its one line on its row in the list, and `tags` its
 * topics, shown under that and filtered by: the filter offers whatever is here.
 */

// A name as it goes in a link: "Get to the Surface" -> get-to-the-surface.
export const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Where a project is on the projects page, which a link to it arrives by. A
// semester's rows each have one, and a name can come up in more than one semester.
export const projectAnchor = (name, semester = CURRENT_SEMESTER) => (
  semester === CURRENT_SEMESTER
    ? `project-${toAnchorId(name)}`
    : `project-${toAnchorId(semester)}-${toAnchorId(name)}`
);

// The sections in the order the projects page shows them.
export const sectionOrder = ['studio', 'launch'];

// Projects with a logo come first within a section, otherwise in listed order.
export const logosFirst = (list) => [...list].sort((a, b) => (b.logo ? 1 : 0) - (a.logo ? 1 : 0));

// A semester's projects, in the order the projects page shows them.
export const inPageOrder = (semesterProjects) => sectionOrder.flatMap(
  (category) => logosFirst(semesterProjects[category] || []),
);

// The current semester's, in that order. The board page groups its project
// managers by this.
export const orderedProjects = inPageOrder(fall2026);

// The semesters the projects page can show, newest first. Fill one in in its file
// in ./projects.
export const projectsBySemester = {
  [CURRENT_SEMESTER]: fall2026,
  'Spring 2026': spring2026,
  'Fall 2025': fall2025,
  'Spring 2025': spring2025,
  'Fall 2024': fall2024,
  'Spring 2024': spring2024,
  'Fall 2023': fall2023,
  'Spring 2023': spring2023,
};

// Every semester's projects, newest semester first.
export const allProjects = Object.values(projectsBySemester).flatMap(inPageOrder);

// OP Studio and OP Launch began in Fall 2026, so a semester before it is one plain
// list, without their headings or filters. Keep its projects under `studio`.
const semesterNames = Object.keys(projectsBySemester);
export const hasSections = (semester) => semesterNames.indexOf(semester) <= semesterNames.indexOf('Fall 2026');
