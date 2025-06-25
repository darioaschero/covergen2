import { BookOpen } from "lucide-react";
import "@fontsource/dm-mono";
import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";

interface BookCoverProps {
  className?: string;
  backgroundColor: string;
  title: string;
  author: string;
}

export function BookCover({ className, backgroundColor, title, author }: BookCoverProps) {
  return (
    <div className={`h-full flex flex-col px-20 ${className}`}>
      {/* Publisher - Top */}
      <div className="flex-1 flex items-start justify-center pt-24">
        <div 
          className="text-[150px] tracking-tight text-center"
          style={{ fontFamily: "Fraunces", fontWeight: 600 }}
        >
          900s
        </div>
      </div>

      {/* Title and Author - Middle */}
      <div className="flex flex-col items-center justify-center h-full">
        <h1 
          className="text-[328px] leading-[383px] tracking-tight text-center"
          style={{ fontFamily: "Fraunces", fontWeight: 700 }}
        >
          {title}
        </h1>
        <span 
          className="text-[328px] leading-[383px] tracking-tight text-center block"
          style={{ fontFamily: "Fraunces", fontWeight: 300 }}
        >
          von {author}
        </span>
      </div>

      {/* Book Type - Bottom */}
      <div className="flex-1 flex items-end justify-center pb-32">
        <div className="flex items-center">
          <div 
            className="w-[165px] h-[165px] rounded-full flex items-center justify-center bg-current"
          >
            <BookOpen 
              size={105} 
              style={{ color: backgroundColor }}
            />
          </div>
          <div 
            className="h-[165px] flex items-center border-[6px] rounded-full px-12 -ml-6 z-10"
            style={{ borderColor: 'currentColor', backgroundColor }}
          >
            <span 
              className="text-[105px] text-center"
              style={{ fontFamily: "DM Mono" }}
            >
              BUCH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 