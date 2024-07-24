"use client";

import { features } from "@/lib/constants";
import ShineBorder from "./magicui/shine-border";

type Props = {};

import {
  Folder,
  PresentationChart,
  MagnifyingGlass,
  Compass,
  Check,
} from "@phosphor-icons/react";

function getIcon(icon: string) {
  switch (icon) {
    case "Folder":
      return <Folder size={32} />;
    case "PresentationChart":
      return <PresentationChart size={32} />;
    case "MagnifyingGlass":
      return <MagnifyingGlass size={32} />;
    case "Compass":
      return <Compass size={32} />;
    default:
      return <Folder size={32} />;
  }
}

function FeatureList({}: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {features.map((feature, index) => (
        <ShineBorder
          className="relative flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-lg border bg-background md:shadow-xl p-8 space-y-4"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          {/* icon */}
          <div className="w-16 h-16 gradient__background flex items-center justify-center rounded-full p-[1px]">
            <div className="flex items-center justify-center w-full h-full  bg-white rounded-full">
              {getIcon(feature.icon)}
            </div>
          </div>

          <p className="text-center text-2xl font-medium tracking-tighter text-grey-600 dark:text-white">
            {feature.title}
          </p>

          <div className="flex flex-col gap-2 items-start">
            {feature.descriptions.map((description, index) => (
              <div className="flex items-start justify-center">
                <Check className="w-6 h-6 text-green-500" />
                <p className="ml-2">{description}</p>
              </div>
            ))}
          </div>
        </ShineBorder>
      ))}
    </div>
  );
}

export default FeatureList;
