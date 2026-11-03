import React from 'react';
import aboutStyles from '../css/About.module.css';
import styles from '../css/Projects.module.css';
import FilterSelect from './FilterSelect';
import { DIFFICULTY_LEVELS } from './ProjectDetail';
import { orderedProjects, projects, projectsBySemester, sectionInfo, sectionOrder } from '../data/projectsData';

export const NO_FILTERS = { query: '', types: [], difficulties: [], topics: [] };

const TYPES = sectionOrder.filter((category) => projects[category]?.length > 0);

/*
 * Every word searched for is somewhere in the project, and it is of one of the
 * types and difficulties, and has one of the topics, picked, where any are.
 */
export const matchesFilters = (project, category, { query, types, difficulties, topics }) => {
  const haystack = [project.name, project.clientName, project.tagline, ...project.tags, ...project.pms, project.description]
    .join(' ')
    .toLowerCase();

  return (
    query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word))
    && (types.length === 0 || types.includes(category))
    && (difficulties.length === 0 || difficulties.includes(project.difficulty))
    && (topics.length === 0 || topics.some((topic) => project.tags.includes(topic)))
  );
};

const SEMESTER_OPTIONS = Object.keys(projectsBySemester).map((name) => ({ value: name, label: name }));

const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LEVELS).map(([difficulty, level]) => ({
  value: difficulty,
  label: (
    <>
      <span className={styles.difficultyPips} aria-hidden="true">
        {[1, 2, 3].map((pip) => <span key={pip} className={pip <= level ? styles.pipOn : undefined} />)}
      </span>
      <span className={styles.filterOptionLabel}>{difficulty}</span>
    </>
  ),
}));

const TOPIC_OPTIONS = [...new Set(orderedProjects.flatMap(({ tags }) => tags))]
  .sort()
  .map((topic) => ({ value: topic, label: topic }));

// What a dropdown of any number says about what is picked in it.
const summaryOf = (name, picked) => {
  if (picked.length === 0) return name;

  return picked.length === 1 ? picked[0] : `${name}: ${picked.length}`;
};

const toggled = (list, item) => (list.includes(item) ? list.filter((other) => other !== item) : [...list, item]);

function FilterChip({ pressed, colour, onClick, children }) {
  return (
    <button
      type="button"
      className={styles.filterChip}
      style={colour ? { '--chip': colour } : undefined}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* Above the list. The semester is what is being filtered, so Clear leaves it be. */
export default function ProjectFilters({ filters, onChange, semester, onSemesterChange, shown, total }) {
  const { query, types, difficulties, topics } = filters;
  const active = query !== '' || types.length > 0 || difficulties.length > 0 || topics.length > 0;

  return (
    <div className={styles.filters}>
      <label className={styles.searchField}>
        <span className={aboutStyles.visuallyHidden}>Search projects</span>
        <input
          type="search"
          value={query}
          placeholder="Search names, clients, PMs"
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </label>

      <div className={styles.filterChips}>
        <div className={styles.filterGroup} role="group" aria-label="Filter by type">
          {TYPES.map((category) => (
            <FilterChip
              key={category}
              colour={sectionInfo[category].color}
              pressed={types.includes(category)}
              onClick={() => onChange({ ...filters, types: toggled(types, category) })}
            >
              {sectionInfo[category].title}
            </FilterChip>
          ))}
        </div>

        <div className={`${styles.filterGroup} ${styles.filterDropdowns}`}>
          <FilterSelect
            name="Difficulty"
            summary={summaryOf('Difficulty', difficulties)}
            options={DIFFICULTY_OPTIONS}
            selected={difficulties}
            multiple
            onChange={(next) => onChange({ ...filters, difficulties: next })}
          />

          <FilterSelect
            name="Topics"
            summary={summaryOf('Topics', topics)}
            options={TOPIC_OPTIONS}
            selected={topics}
            multiple
            onChange={(next) => onChange({ ...filters, topics: next })}
          />

          <FilterSelect
            name="Semester"
            summary={semester}
            options={SEMESTER_OPTIONS}
            selected={[semester]}
            onChange={([next]) => onSemesterChange(next)}
          />
        </div>
      </div>

      <div className={styles.filterStatus}>
        <span aria-live="polite">{`${shown} of ${total} projects`}</span>
        {active && (
          <button type="button" className={styles.filterClear} onClick={() => onChange(NO_FILTERS)}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
