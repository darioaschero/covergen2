import { BookOpen } from "lucide-react";
import "@fontsource/dm-mono";
import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import { Logo } from "./Logo";

interface BookCoverProps {
  className?: string;
  backgroundColor: string;
  title: string;
  author: string;
  language: 'english' | 'deutsch';
}

export function BookCover({ className, backgroundColor, title, author, language }: BookCoverProps) {
  const byText = language === 'english' ? 'by' : 'von';
  const bookText = language === 'english' ? 'BOOK' : 'BUCH';

  return (
    <div className={`h-full flex flex-col px-20 ${className}`}>
      {/* Book Icon - Top */}
      <div className="flex-1 flex items-start justify-center pt-32">
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
              {bookText}
            </span>
          </div>
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
          {byText} {author}
        </span>
      </div>

      {/* Publisher - Bottom */}
      <div className="flex-1 flex items-end justify-center pb-24">
        <Logo size={300} />
      </div>
    </div>
  );
} 