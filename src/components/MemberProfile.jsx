import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { NavHashLink } from 'react-router-hash-link';
import applyStyles from '../css/Apply.module.css';
import contactStyles from '../css/Contact.module.css';
import boardStyles from '../css/Board.module.css';
import homeStyles from '../css/HomePage.module.css';
import heroStyles from '../css/ImmersiveHero.module.css';
import projectStyles from '../css/Projects.module.css';
import styles from '../css/MemberProfile.module.css';
import accentInk from './accentInk';
import arriveAt from './arriveAt';
import useInViewOnce from './useInViewOnce';
import { FixedStarField } from './StarField';
import JoinScene from './JoinScene';
import PixelImage from './PixelImage';
import PixelSwap from './PixelSwap';
import { ScrambleRuns } from './ScrambleText';
import NotFound from './NotFound';
import { ProjectDifficulty } from './ProjectDetail';
import { profileNamed } from '../data/boardMembers';
import { projectAnchor } from '../data/projectsData';
import LinkedInIcon from './LinkedInIcon';
import websiteicon from '../images/about/web.png';
import coffeechaticon from '../images/about/coffeechat.png';

/* What is typed in over the heading's sentence is typed in quickly, a card a beat
   behind the one above it. */
const QUICK_SCRAMBLE_MS = 400;
const TYPED_AFTER_TITLE_MS = 300;
const CARD_GAP_MS = 60;
// The size of the blocks the photo comes in with, in px.
const PHOTO_BLOCK = 20;
const SECTION_COLOURS = { current: '#4DB6AC', past: '#AB8FF3' };

/* A role, if they have one, marked out from the rest of the sentence. */
const runsFor = ({ title, year, major }) => {
  const rest = [year, major].filter(Boolean).join(' · ');

  if (!title) return [{ text: rest || 'Open Project' }];

  return [{ text: title, colour: '#4DB6AC' }, { text: rest ? ` · ${rest}` : '' }];
};

const QuickScramble = ({ text, play, delay, instant, className }) => (
  <ScrambleRuns
    runs={[{ text }]}
    play={play}
    delay={delay}
    duration={QUICK_SCRAMBLE_MS}
    instant={instant}
    className={className}
  />
);

/*
 * Back the way they came: to the project they came from, picked and in view, or
 * otherwise to the board.
 */
function BackButton({ fromProject, fromSemester, play, instant }) {
  const label = (
    <button className={`${homeStyles.getInvolvedButton} ${heroStyles.ctaButton} ${heroStyles.ctaBack}`}>
      <span className={heroStyles.ctaArrowBack} aria-hidden="true">←</span>
      <QuickScramble
        text={fromProject ? 'Back to projects' : 'Back to board'}
        play={play}
        instant={instant}
        className={styles.inlineScramble}
      />
    </button>
  );

  return fromProject ? (
    <NavHashLink className={styles.back} to={`/projects/#${projectAnchor(fromProject, fromSemester)}`} scroll={arriveAt}>
      {label}
    </NavHashLink>
  ) : (
    <Link className={styles.back} to="/board">{label}</Link>
  );
}

/*
 * A project as it is in the projects page's list, going to its row there, in its
 * semester. One from a past semester says when it was. Its words are typed in, and
 * what has no words blurs in with them, when `play` is first raised.
 */
function ProjectCard({ project, semester, play, delay, instant }) {
  const typed = { play, delay, instant };

  return (
    <li
      className={`${projectStyles.projectRow} ${play || instant ? projectStyles.inView : ''}`}
      style={{
        '--accent': project.accent,
        '--on-accent': accentInk(project.accent),
        '--reveal-delay': `${delay}ms`,
      }}
    >
      <span className={projectStyles.cardWipe} aria-hidden="true" />

      <div className={projectStyles.projectIcon} aria-hidden={project.logo ? undefined : 'true'}>
        {project.logo ? (
          <img src={project.logo} alt={`${project.name} logo`} className={projectStyles.projectLogo} />
        ) : (
          project.name[0]
        )}
      </div>

      <div className={projectStyles.cardText}>
        <div className={projectStyles.rowHead}>
          <div className={projectStyles.projectTitle}>
            <h3 className={projectStyles.projectName}>
              <NavHashLink
                to={`/projects/#${projectAnchor(project.name, semester)}`}
                scroll={arriveAt}
                aria-label={semester ? `${project.name}, ${semester}` : project.name}
              >
                <QuickScramble text={project.name} {...typed} />
              </NavHashLink>
            </h3>

            {(semester || project.clientName) && (
              <p className={projectStyles.projectClient}>
                <QuickScramble text={semester || project.clientName} {...typed} />
              </p>
            )}
          </div>

          {project.difficulty && (
            <ProjectDifficulty difficulty={project.difficulty} play={play} delay={delay} instant={instant} />
          )}
        </div>

        <p className={projectStyles.projectTagline}>
          <QuickScramble text={project.tagline} {...typed} />
        </p>

        <ul className={projectStyles.projectTags}>
          {project.tags.map((tag) => (
            <li key={tag} className={projectStyles.projectTag}>
              <QuickScramble text={tag} {...typed} />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/* Comes in once, as it reaches the window: its title highlighted in - see .flash -
   and everything under it typed in behind that. */
function ProjectSection({ title, colour, projects }) {
  const sectionRef = useRef(null);
  const inView = useInViewOnce(sectionRef);
  const instant = useReducedMotion();

  return (
    <section ref={sectionRef} className={styles.projects}>
      <h2
        className={`${styles.projectsTitle} ${inView ? projectStyles.inView : ''}`}
        style={{ '--hl': colour }}
      >
        <span className={projectStyles.flash}>{title}</span>
      </h2>

      {projects.length === 0 ? (
        <p className={styles.none}>
          <QuickScramble text="Nothing listed yet." play={inView} delay={TYPED_AFTER_TITLE_MS} instant={instant} />
        </p>
      ) : (
        <ul className={projectStyles.projectRows}>
          {projects.map(({ project, semester }, index) => (
            <ProjectCard
              key={`${semester} ${project.name}`}
              project={project}
              semester={semester}
              play={inView}
              delay={TYPED_AFTER_TITLE_MS + index * CARD_GAP_MS}
              instant={instant}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

/*
 * A board member's own page: the contact page's frame, with who they are and
 * their projects down the left and their photo, coming in in blocks once it has
 * loaded and pixelating under the pointer, in the right. Everything on it comes from `profiles` in boardMembers.js.
 */
export default function MemberProfile() {
  const { slug } = useParams();
  const { state } = useLocation();
  const profile = profileNamed(slug);
  const headRef = useRef(null);
  const headIn = useInViewOnce(headRef, 0);
  const reducedMotion = useReducedMotion();
  const runs = useMemo(() => (profile ? runsFor(profile) : []), [profile]);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const photoShown = headIn && photoLoaded;

  useEffect(() => {
    if (!profile) return undefined;

    const photo = new Image();
    const onLoaded = () => setPhotoLoaded(true);

    photo.addEventListener('load', onLoaded);
    photo.addEventListener('error', onLoaded);
    photo.src = profile.image;

    return () => {
      photo.removeEventListener('load', onLoaded);
      photo.removeEventListener('error', onLoaded);
    };
  }, [profile]);

  if (!profile) return <NotFound />;

  const { name, image, link, coffee_chat: coffeeChat, currentProjects, pastProjects } = profile;

  const socials = (link || coffeeChat) && (
    <div className={styles.socials}>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link.includes('linkedin') ? (
            <LinkedInIcon label={`${name}'s LinkedIn`} />
          ) : (
            <img src={websiteicon} className={boardStyles.icon} alt={`${name}'s profile link`} />
          )}
        </a>
      )}
      {coffeeChat && (
        <a href={coffeeChat} target="_blank" rel="noopener noreferrer">
          <img
            src={coffeeChat.includes('calendly') ? coffeechaticon : websiteicon}
            className={boardStyles.icon}
            alt={`Book a coffee chat with ${name}`}
          />
        </a>
      )}
    </div>
  );

  return (
    <>
      <FixedStarField />
      <div className={`${applyStyles.applyWrapper} ${styles.page} limitWidth`}>
        <div className={contactStyles.main}>
          <BackButton fromProject={state?.fromProject} fromSemester={state?.fromSemester} play={headIn} instant={reducedMotion} />

          <div ref={headRef}>
            <JoinScene
              arrived={headIn}
              reducedMotion={reducedMotion}
              title={name}
              titleAside={socials}
              headClassName={contactStyles.head}
              runs={runs}
              button={null}
            />
          </div>

          <ProjectSection title="Current projects" colour={SECTION_COLOURS.current} projects={currentProjects} />
          <ProjectSection title="Past projects" colour={SECTION_COLOURS.past} projects={pastProjects} />
        </div>

        <PixelSwap swapKey={photoShown ? 'shown' : 'hidden'} block={PHOTO_BLOCK} className={styles.photo}>
          {photoShown && <PixelImage src={image} alt={name} />}
        </PixelSwap>
      </div>
    </>
  );
}
