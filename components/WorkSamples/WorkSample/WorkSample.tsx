import React, { CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import BorderVine from "../../FancyAssets/BorderVine/BorderVine";
import styles from "./WorkSample.module.css";
import { SampleFig } from "../WorkSamples";
import Link from "next/link";
import { useRouter } from "next/router";

export default function WorkSample({
  title,
  blurb,
  features,
  image,
  link,
}: SampleFig) {
  const loreComp = useRef<HTMLDivElement>(null);
  const [borderStyle, setBorderStyle] = useState<CSSProperties>({});
  const router = useRouter();
  const goToPage = () => router.push(link);
  useEffect(() => {
    if (loreComp.current) {
      console.log("Scaling Border");
      // On larger screens I want the border to go above by some number of pixels
      // to include the header a little better. On smaller screens that isn't what I want
      const headerAllowance = window.innerWidth > 800 ? 80 : 50;
      setBorderStyle({
        // scale up to cover lore
        transform: `
          scaleY(${(loreComp.current.clientHeight + headerAllowance) / 271})
        `,
      });
    }
    return () => {};
  }, [loreComp]);
  return (
    <div className={styles["WorkSample"]}>
      <h2 onClick={goToPage}>{title}</h2>
      <div className={styles["content"]}>
        <div className={styles["lore"]} ref={loreComp}>
          <BorderVine style={borderStyle}></BorderVine>
          <p>{blurb}</p>
          <h3>Features</h3>
          <div className={styles["lore-inner"]}>
            <ul>
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <Link href={link}>View Sample</Link>
          </div>
        </div>
        {/*  */}
        <div
          onClick={goToPage}
          className={styles["image"]}
          // The image should get as small as 1/3.2 it's size before it wraps
          // If the viewport (minus padding) is smaller than that, go to to that size
          // This should help it behave nicely with different aspect ratios...
          style={{ minWidth: `min(${image.width / 3.2}px, calc(100vw - 2em))` }}
        >
          <Image
            src={image.src}
            alt={title}
            width={image.width}
            height={image.height}
            layout="responsive"
          ></Image>
        </div>
      </div>
    </div>
  );
}
