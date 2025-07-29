import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";
import Button from "./LinkButton";

export default function Consultation({
  title,
  children,
  btnText,
}: {
  title: string;
  children: ReactNode;
  btnText: string;
}) {
  return (
    <section className="bg-sand-black text-white p-8 lg:p-20 lg:px-12 relative overflow-hidden">
      <div className="flex max-md:flex-col justify-between items-center gap-y-12 gap-x-16 lg:gap-24">
        <div className="z-20">
          <h2 className="text-3xl font-bold text-left">{title}</h2>
          <p className="text-gray-300 text-xl text-left mt-4">{children}</p>
        </div>
        <Button href="/contact">
          {btnText}
          <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover/linkbtn:translate-x-0.5" />
        </Button>
      </div>
      <img
        src="/images/pill.webp"
        alt="pill"
        className="absolute size-44 object-contain pointer-events-none -left-0.5 max-lg:-bottom-32 "
      />
      <img
        src="/images/icosahedron.webp"
        alt="icosahedron"
        className="absolute size-44 object-contain pointer-events-none -right-14 -top-16 "
      />
    </section>
  );
} 