"use client"

import { FC, useEffect, useRef } from "react";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import gsap from "gsap";
import Shapes from "./Shapes";

/**
 * Props for `NewHero`.
 */
export type NewHeroProps = SliceComponentProps<Content.NewHeroSlice>;

/**
 * Component for "NewHero" Slices.
 */
const NewHero: FC<NewHeroProps> = ({ slice }) => {
    const component = useRef(null)
    
    useEffect(()=>{
      let ctx = gsap.context(()=>{
  
        const tl = gsap.timeline()

        tl.fromTo(".heading-title", {
         y:20,
         opacity: 0,
         scale: 1.2 
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          ease: "elastic.out(1,0.3)",
        })
  
        // Name animation
        tl.fromTo(".name-animation", {
          x: -100,
          opacity: 0,
          rotate: -10,
        },{
          x:0,
          opacity:1,
          rotate: 0,
          ease: "elastic.out(1,0.3)",
          duration: 1,
          transformOrigin: "left top",
          stagger: {
            each: 0.1,
            from: "random"
          }
        })
  
        tl.fromTo(".job-title", {
         y:20,
         opacity: 0,
         scale: 1.2 
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          ease: "elastic.out(1,0.3)",
        })
  
      }, component)
      return () => ctx.revert();
    }, []);

  const renderLetters = (name: KeyTextField, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span key={index} className={`name-animation name-animation-${key} inline-block`}>
        {letter}
      </span>
    ))
  }


  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
      className="h-screen"
    >
      {/* Centratura verticale e orizzontale perfetta */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]"> 
        <div className="absolute inset-0 -z-10"> 
          <Shapes />
        </div>
        <div className="text-center md:row-start-1 z-10">
          
          {/* 1. HEADING */}
          <span className="mb-8 heading-title block bg-gradient-to-tr from-slate-500 via-slate-200 to-slate-500 bg-clip-text text-xl font-bold uppercase tracking-[0.2rem] text-transparent md:text-3xl">
            {slice.primary.heading}
          </span>
          
          {/* 2 & 3. FIRST NAME & LAST NAME */}
          <h1 className="mb-8 text-7xl md:text-[10rem] font-extrabold leading-none tracking-tighter" 
              aria-label={slice.primary.first_name + " " + slice.primary.last_name}>
            
            {/* FIRST NAME: block su mobile, md:inline su desktop */}
            <span className="block md:inline text-slate-100 md:mr-10"> 
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            
            {/* LAST NAME: block su mobile, md:inline su desktop */}
            <span className="block md:inline text-slate-100 md:mt-0"> 
              {renderLetters(slice.primary.last_name, "last")}
            </span>
          </h1>
          
          {/* 4. TAG_LINE */}
          <span className="job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-2xl font-bold uppercase tracking-[0.2rem] text-transparent md:text-4xl">
            {slice.primary.tag_line}
          </span>
          
        </div>
      </div>
    </Bounded>
  );
};

export default NewHero;