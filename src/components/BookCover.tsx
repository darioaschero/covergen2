import { Brain } from "lucide-react";
import "@fontsource/dm-mono";
import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";

interface BookCoverProps {
  className?: string;
  backgroundColor: string;
}

export function BookCover({ className = "", backgroundColor }: BookCoverProps) {
  return (
    <div className={`h-full flex flex-col px-20 ${className}`}>
      {/* Publisher - Top */}
      <div className="flex-1 flex items-start justify-center pt-24">
        <div 
          className="text-[150px] tracking-tight text-center"
          style={{ fontFamily: "Fraunces", fontWeight: 600 }}
        >
          Wisora
        </div>
      </div>

      {/* Title and Author - Middle */}
      <div className="flex flex-col items-center">
        <h1 
          className="text-[360px] leading-[420px] tracking-tight text-center"
          style={{ fontFamily: "Fraunces", fontWeight: 700 }}
        >
          Can't Hurt Me
        </h1>
        <span 
          className="text-[360px] leading-[420px] tracking-tight text-center block -mt-24"
          style={{ fontFamily: "Fraunces", fontWeight: 300 }}
        >
          by David Goggins
        </span>
      </div>

      {/* Book Type - Bottom */}
      <div className="flex-1 flex items-end justify-center pb-32">
        <div className="flex items-center">
          <div 
            className="w-[165px] h-[165px] rounded-full flex items-center justify-center bg-current"
          >
            <Brain 
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
              BOOK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 