import React from "react";
import dynamic from "next/dynamic";

// Was getting a weird error with importing konva (and react-konva). Next.js said they were importing eachother wrong
// Found these two relevant comment threads.
// This is a bunch of people discussing exactly the konva/next.js error on github
// https://github.com/vercel/next.js/issues/25454

// This is where I got the solution of dynamically importing the entire VirtualWhiteboard components
// https://www.gitmemory.com/issue/vercel/next.js/25454/862571514

const VirtualWhiteboard = dynamic(
  () => import("../components/VirtualWhiteboard/VirtualWhiteboard"),
  { ssr: false }
);

export default function DrawWithFriendsPage() {
  return <VirtualWhiteboard />;
}
