"use client";

import { FC, useState } from "react"; // Importa useState
import { Content } from "@prismicio/client";
import { PrismicRichText, PrismicText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import clsx from "clsx";
import { MdArrowOutward } from "react-icons/md";

export type FormBoxProps = SliceComponentProps<Content.FormBoxSlice>;

const FormBox: FC<FormBoxProps> = ({ slice }) => {
  // Stati per gestire i valori del form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  // Funzione per gestire l'invio (per ora logga i dati)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previene il ricaricamento della pagina
    const formData = { name, email, description };
    console.log("Dati del form inviati:", formData);
    // Qui è dove collegherai un'API per inviare la mail
    // (es. Resend, Formspree, o un API route)
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Contenitore per centrare il form e limitarne la larghezza */}
      <div className="mx-auto max-w-2xl px-4">
        
        <div className="text-center mb-10">
          <h1 className="font-bold md:mb-0 mb-5 leading-tight tracking-tight  text-slate-300 text-5xl md:text-9xl">
            <PrismicRichText field={slice.primary.heading} />
          </h1>
  
          <div className="prose prose-slate prose-invert md:text-2xl text-xl">
            <PrismicRichText field={slice.primary.description} />
          </div>
        </div> 
       

        <form onSubmit={handleSubmit} className="space-y-6">
           
          {/* --- Campo Nome --- */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium leading-6 text-slate-100"
            >
              Nome
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6 transition-all duration-150"
              />
            </div>
          </div>

          {/* --- Campo Email --- */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium leading-6 text-slate-100"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6 transition-all duration-150"
              />
            </div>
          </div>

          {/* --- Campo Descrizione (Textarea) --- */}
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium leading-6 text-slate-100"
            >
              Descrizione Consulenza
            </label>
            <div className="mt-2">
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6 transition-all duration-150"
              />
            </div>
          </div>

          {/* --- Bottone di Invio --- */}
          <div className="flex justify-center mt-14">
            <button
              type="submit"
              className="group relative flex w-fit text-slate-800 items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-50  px-4 py-2 font-bold transition-transform ease-out  hover:scale-105"
            >
              <span
                className={"absolute inset-0 z-0 h-full translate-y-9 bg-yellow-300 transition-transform  duration-300 ease-in-out group-hover:translate-y-0"}
              />
              <span className="relative flex items-center justify-center gap-2">
                Invia Richiesta {<MdArrowOutward className="inline-block" />}
              </span>
            </button>
          </div>
        </form>
      </div>
    </Bounded>
  );
};

export default FormBox;
