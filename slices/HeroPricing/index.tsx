"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Button from "@/app/components/Button";

export type HeroPricingProps = SliceComponentProps<Content.HeroPricingSlice>;

const HeroPricing: FC<HeroPricingProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      // Rimuovi classi che forzano l'altezza se presenti, lascia che fluisca
    >
      {/* --- GRIGLIA --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* --- COLONNA SINISTRA (Testo) --- */}
        <div className="flex flex-col items-start mb-10 md:mb-0">
          <Heading size="xl" className="mb-6">
            {slice.primary.heading}
          </Heading>

          <div className="prose prose-xl prose-slate prose-invert max-w-lg">
            <PrismicRichText field={slice.primary.description} />
          </div>
        </div>
        
        {/* --- COLONNA DESTRA (Card) --- */}
        <div className="w-full max-w-md mx-auto md:ml-auto md:mr-0 rounded-3xl bg-gradient-to-tr from-yellow-500 via-yellow-400 to-yellow-200 flex flex-col shadow-2xl shadow-yellow-500/40 relative z-10 overflow-hidden">
          
          <div className="pt-10 pb-5 px-5">
            <h1 className="font-bold leading-tight tracking-tight text-4xl md:text-5xl uppercase text-center text-slate-900">
                {slice.primary.headingplan}
            </h1>

            <h2 className="font-bold leading-tight tracking-tight text-6xl md:text-7xl uppercase text-center text-slate-800 mt-2">
                {slice.primary.price}
            </h2>
          </div>


          <div className="text-left p-8 md:pl-16 border-t-2 border-slate-900/10">
            {slice.primary.field.map((item, index) => (
              <div className="flex items-start text-slate-900 mb-4 font-medium last:mb-0" key={index}>
                <span className="inline-block pr-3 text-2xl text-slate-900 mt-[-2px]">
                  <IoIosCheckmarkCircle />
                </span>
                <span className="inline-block text-xl leading-tight">{item.type}</span>
              </div>
            ))}
          </div>
          
          {/* Footer della card (Bottone) - Rimane fisso in basso */}
          <div className="pb-8 flex justify-center w-full px-10">
            <Button 
              linkField={slice.primary.button_link} 
              label={slice.primary.button_label}
              className="w-full text-center shadow-md"
            />
          </div>

        </div>
      </div>
    </Bounded>
  );
};

export default HeroPricing;