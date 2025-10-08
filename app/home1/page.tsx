"use client";

import Hero1 from "@/components/Hero1";

import Services from "@/components/Services";

import About from "@/components/About";
import CTA from "@/components/CTA";
import BlogCard from "@/components/BlogCard";
import FuturisticSlider from "@/components/FuturisticSlider";
import HeroSlider from "@/components/HeroSlider";

export default function HomePage() {
  return (
    <div className="font-sans bg-black text-white space-y-20">

      <Hero1/>  
      <HeroSlider/> 
      <About />
      <FuturisticSlider/>
      <Services />

      <BlogCard/>
      <CTA/>

    </div>
  );
}


