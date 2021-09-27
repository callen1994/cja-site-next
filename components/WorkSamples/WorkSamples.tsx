import Link from "next/link";
import BorderVine from "../Utilities/FancyAssets/BorderVine/BorderVine";
import WorkSample from "./WorkSample/WorkSample";
import styles from "./WorkSamples.module.css";

export interface SampleFig {
  title: string;
  link: string;
  blurb: string;
  features: string[];
  image: { src: string; height: number; width: number };
}

export default function WorkSamples() {
  return (
    <section className={styles.WorkSamples}>
      <h1>Work Samples</h1>
      <p>
        Here are a couple of projects built with React to show off what I can
        do. You can see the code for everything on this site at{" "}
        <a href="https://github.com/callen1994/cja-site">
          github.com/callen1994/cja-site
        </a>
      </p>

      {WorkSampleFigs.map((fig, i) => (
        <WorkSample
          title={fig.title}
          link={fig.link}
          blurb={fig.blurb}
          features={fig.features}
          image={fig.image}
          key={i}
        ></WorkSample>
      ))}
    </section>
  );
}

const WorkSampleFigs: SampleFig[] = [
  {
    title: "Dance In The Bay",
    link: "dance",
    blurb:
      "I am an avid swing dancer, so I created a place where I can keep track of partner dance events happening in the area, and share them with my friends.",
    features: [
      "Responsive Layout",
      "Elegant Design",
      "Easy CMS",
      "Next.js for SEO and high performance rendering",
    ],
    image: {
      src: "/DanceScreenShot.png",
      width: 1000,
      height: 560,
    },
  },
  {
    title: 'Staffing Software',
    link: 'staffing-sample',
    blurb: "To show off what I can do building beautiful and functional web-tools, I've created a staffing tool for an imaginary summer camp.",
    features: [
      "Intuitive interface",
      "Elegant design",
      "Data Visualization",
      "Fun to Use",
    ],
    image: {
      src: "/staffing-shot.png",
      width: 1000,
      height: 610
    }
  },
  {
    title: "Virtual Whiteboards",
    link: "virtual-whiteboard",
    blurb:
      "This virtual whiteboard sample primarily showcases back-end functionality. Invite users via text or email. Users are connected through live sockets into a collaborative space.",
    features: [
      "Live Web-sockets (data transfered between users in real time)",
      "Text and Email Integration",
      "Persistent Mongo Database",
      "Custom Node.js Server",
    ],
    image: {
      src: "/whiteboards-shot.png",
      width: 1000,
      height: 576,
    },
  }
];