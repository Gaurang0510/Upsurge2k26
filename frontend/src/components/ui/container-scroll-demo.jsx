"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center pt-6 pb-6">
            <span className="case-tag mb-6 sm:mb-8 inline-block">{"//"} Case Overview</span>
            <h1 className="text-4xl font-semibold text-black dark:text-white mt-2">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-4 block leading-none">
                Scroll Animations
              </span>
            </h1>
          </div>
        }
      >
        <img
          src="/images/gallery/smackathon-details-scroll.png"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
