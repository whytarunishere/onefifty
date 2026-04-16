import React from "react";
import { Mainfeed } from "./Mainfeed";
import { Createpost } from "./Createpost";
import { Trending } from "./Trending";
import { Topcorrespondents } from "./Topcorrespondents";

export default function Maincontent({ isWriting, setIsWriting }) {
  return (
    <section className="w-full bg-black text-white px-4 md:px-12 py-10">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-[70%] space-y-10">
          
          {/* If isWriting is true, show Createpost. If false, show Mainfeed */}
          {isWriting ? (
            <Createpost onCancel={() => setIsWriting(false)} />
          ) : (
            <div className="space-y-12">
              <Mainfeed />
            </div>
          )}

        </div>

        <div className="lg:w-[30%] space-y-10">
          <Trending />
          <Topcorrespondents />
        </div>
      </div>
    </section>
  );
}

