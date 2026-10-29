/*
 * Values more than one page shows. Change them here and every page that reads
 * them follows: the board, projects and apply headings, the hero's typed
 * phrase, the recruitment timeline, the header, the footer and the contact
 * form.
 */
import instagram from '../images/instagram.png';
import github from '../images/github.png';
import email from '../images/email.png';
import linkedin from '../images/linkedin.png';

// The semester the site is recruiting for and showing the team and projects of.
export const CURRENT_SEASON = 'Fall';
export const CURRENT_YEAR = 2026;
export const CURRENT_SEMESTER = `${CURRENT_SEASON} ${CURRENT_YEAR}`;

export const PORTAL_URL = 'https://portal.openprojectberkeley.com';
export const CONTACT_EMAIL = 'openprojectberkeley@gmail.com';

// The footer's icons, in order.
export const socials = [
  { href: 'https://www.instagram.com/openprojectberkeley/', icon: instagram, name: 'Instagram', handle: '@openprojectberkeley' },
  { href: 'https://linkedin.com/company/openprojectberkeley', icon: linkedin, name: 'LinkedIn', handle: 'openprojectberkeley' },
  { href: 'https://github.com/openprojectberkeley', icon: github, name: 'GitHub', handle: 'openprojectberkeley' },
  { href: `mailto:${CONTACT_EMAIL}`, icon: email, name: 'Email', handle: CONTACT_EMAIL },
];
