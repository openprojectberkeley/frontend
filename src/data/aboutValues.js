/*
 * The club's four values, each with its shape and the colour it is called in.
 *
 * Read by the about page, which sets them out as a grid with their words under
 * them, and by the end of the home page's hero, which sets the shapes out as a
 * diamond and shows the words on hover - so the wording lives here once.
 */
import star from '../images/star.png';
import triangle from '../images/triangle.png';
import square from '../images/square.png';
import circle from '../images/circle.png';

export const aboutValues = [
  {
    key: 'star',
    image: star,
    title: 'Inclusive Community',
    colour: '#F9C12C',
    body:
      'We value individual differences and strive to build a welcoming environment for everyone passionate about the tech space and creating meaningful projects.',
  },
  {
    key: 'triangle',
    image: triangle,
    title: 'Choose Your Own Path',
    colour: '#4DB6AC',
    body:
      'We believe it is crucial that students are able to facilitate and operate their own development teams, ensuring an outlet for creative independence.',
  },
  {
    key: 'square',
    image: square,
    title: 'Build and Learn Together',
    colour: '#AB8FF3',
    body:
      'We aim to maintain a curious space for everyone to collaborate with and learn from one another by allowing every individual to have pivotal roles in their respective development teams.',
  },
  {
    key: 'circle',
    image: circle,
    title: 'Challenge Your Limits',
    colour: '#83B8E0',
    body:
      'We always encourage our peers to reach beyond their comfort zones and explore areas they are unfamiliar with as we believe it is essential to their personal development.',
  },
];

export const MISSION_PREFIX = 'Mission statement:';
export const MISSION =
  'We strive to build an open community for creators passionate about working on tech projects most meaningful to them.';
