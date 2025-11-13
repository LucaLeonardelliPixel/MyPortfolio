import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Button from "@/app/components/Button";

/**
 * Props for `LinkProject`.
 */
export type LinkProjectProps = SliceComponentProps<Content.LinkProjectSlice>;

/**
 * Component for "LinkProject" Slices.
 */
const LinkProject: FC<LinkProjectProps> = ({ slice }) => {
  return (
    <div className="mt-20">
      <Button linkField={slice.primary.button_link} label={slice.primary.button_label} target="_blank" className="mx-auto text-xl no-underline group relative flex w-fit text-slate-800 items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-50  px-4 py-2 font-bold transition-transform ease-out  hover:scale-105 "/>
    </div>
  );
};

export default LinkProject;
