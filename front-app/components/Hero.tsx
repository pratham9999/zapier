/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { useRouter } from "next/navigation";
import { Feature } from "./Feature";

export const Hero = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-center">
        <div className="text-5xl font-semibold text-center pt-8 max-w-xl">
          Automate as fast as you can type
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <div className="text-xl font-normal text-center pt-8 max-w-2xl">
          Let AI and Zapier do the heavy lifting, automating tasks and
          streamlining your processes, so you can focus on what truly matters.
        </div>
      </div>

      <div className="flex justify-center pt-4 pr-8">
        <div className="flex">
          <PrimaryButton onClick={() => {
            router.push("/signup")
          }} size="big">
            Get started free
          </PrimaryButton>
          <div className="pl-4">
            <SecondaryButton onClick={() => {}} size="big">
              Contact Sales
            </SecondaryButton>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Feature title={"Free Forever"} subtitle={"for core features"} />
        <Feature title={"More apps"} subtitle={"than any other platforms"} />
        <Feature title={"cutting edge"} subtitle={"Ai features"} />
      </div>
    </div>
  );
};
