import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { colorCombinations } from "@/constants/colors";
import { BookCover } from "@/components/BookCover";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { Textarea } from "./components/ui/textarea";
import JSZip from "jszip";

interface Book {
  id: string;
  title: string;
  author: string;
  subtitle: string;
  coverUrl: string;
  audioUrl: string;
  lang: string;
  durationSec: number;
  publishedAt: string;
  categories: string[];
  summary: string;
  visualUrl: string;
  transcript: string;
}

const INITIAL_BOOKS_JSON = `[
  {
    "id": "deep-work-2131",
    "title": "Deep Work",
    "author": "Cal Newport",
    "subtitle": "Rules for Focused Success in a Distracted World",
    "coverUrl": "/storage/deep-work/cover.png",
    "audioUrl": "/storage/deep-work/audio.mp3",
    "lang": "en",
    "durationSec": 631,
    "publishedAt": "2025-03-14T08:00:00Z",
    "categories": ["productivity", "business"],
    "summary": "/storage/deep-work/summary.json",
    "visualUrl": "/storage/deep-work/visualisation.png",
    "transcript": "/storage/deep-work/transcript.json"
  },
  {
    "id": "atomic-habits-0129",
    "title": "Atomic Habits",
    "subtitle": "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    "author": "James Clear",
    "coverUrl": "/storage/atomic-habits/cover.png",
    "audioUrl": "/storage/atomic-habits/audio.mp3",
    "lang": "en",
    "durationSec": 796,
    "publishedAt": "2025-04-02T08:00:00Z",
    "categories": ["self-help"],
    "summary": "/storage/atomic-habits/summary.json",
    "visualUrl": "/storage/atomic-habits/visualisation.png",
    "transcript": "/storage/atomic-habits/transcript.json"
  },
  {
    "id": "ai-superpowers-3033",
    "title": "AI Superpowers",
    "author": "Kai-Fu Lee",
    "subtitle": "China, Silicon Valley, and the New World Order",
    "coverUrl": "/storage/ai-superpowers/cover.png",
    "audioUrl": "/storage/ai-superpowers/audio.mp3",
    "lang": "en",
    "durationSec": 808,
    "publishedAt": "2025-05-10T08:00:00Z",
    "categories": ["technology", "business"],
    "summary": "/storage/ai-superpowers/summary.json",
    "visualUrl": "/storage/ai-superpowers/visualisation.png",
    "transcript": "/storage/ai-superpowers/transcript.json"
  },
  {
    "id": "cant-hurt-me-30a4",
    "title": "Can't Hurt Me",
    "author": "David Goggins",
    "subtitle": "Master Your Mind and Defy the Odds",
    "coverUrl": "/storage/cant-hurt-me/cover.png",
    "audioUrl": "/storage/cant-hurt-me/audio.mp3",
    "lang": "en",
    "durationSec": 747,
    "publishedAt": "2025-06-15T08:00:00Z",
    "categories": ["self-help", "motivation"],
    "summary": "/storage/cant-hurt-me/summary.json",
    "visualUrl": "/storage/cant-hurt-me/visualisation.png",
    "transcript": "/storage/cant-hurt-me/transcript.json"
  },
  {
    "id": "grit-a0k5",
    "title": "Grit",
    "author": "Angela Duckworth",
    "subtitle": "The Power of Passion and Perseverance",
    "coverUrl": "/storage/grit/cover.png",
    "audioUrl": "/storage/grit/audio.mp3",
    "lang": "en",
    "durationSec": 843,
    "publishedAt": "2025-07-20T08:00:00Z",
    "categories": ["psychology", "self-help"],
    "summary": "/storage/grit/summary.json",
    "visualUrl": "/storage/grit/visualisation.png",
    "transcript": "/storage/grit/transcript.json"
  },
  {
    "id": "the-innovators-dilemma-sd06",
    "title": "The Innovator's Dilemma",
    "author": "Clayton M. Christensen",
    "subtitle": "When New Technologies Cause Great Firms to Fail",
    "coverUrl": "/storage/the-innovators-dilemma/cover.png",
    "audioUrl": "/storage/the-innovators-dilemma/audio.mp3",
    "lang": "en",
    "durationSec": 747,
    "publishedAt": "2025-08-25T08:00:00Z",
    "categories": ["business", "technology"],
    "summary": "/storage/the-innovators-dilemma/summary.json",
    "visualUrl": "/storage/the-innovators-dilemma/visualisation.png",
    "transcript": "/storage/the-innovators-dilemma/transcript.json"
  },
  {
    "id": "superintelligence-90ax",
    "title": "Superintelligence",
    "author": "Nick Bostrom",
    "subtitle": "Paths, Dangers, Strategies",
    "coverUrl": "/storage/superintelligence/cover.png",
    "audioUrl": "/storage/superintelligence/audio.mp3",
    "lang": "en",
    "durationSec": 771,
    "publishedAt": "2025-09-30T08:00:00Z",
    "categories": ["technology", "philosophy"],
    "summary": "/storage/superintelligence/summary.json",
    "visualUrl": "/storage/superintelligence/visualisation.png",
    "transcript": "/storage/superintelligence/transcript.json"
  },
  {
    "id": "thinking-fast-and-slow-a0g9",
    "title": "Thinking, Fast and Slow",
    "author": "Daniel Kahneman",
    "subtitle": "This book is generally published without a subtitle.",
    "coverUrl": "/storage/thinking-fast-and-slow/cover.png",
    "audioUrl": "/storage/thinking-fast-and-slow/audio.mp3",
    "lang": "en",
    "durationSec": 653,
    "publishedAt": "2025-10-05T08:00:00Z",
    "categories": ["psychology", "economics"],
    "summary": "/storage/thinking-fast-and-slow/summary.json",
    "visualUrl": "/storage/thinking-fast-and-slow/visualisation.png",
    "transcript": "/storage/thinking-fast-and-slow/transcript.json"
  },
  {
    "id": "zero-to-one-pj21",
    "title": "Zero to One",
    "author": "Peter Thiel",
    "subtitle": "Notes on Startups, or How to Build the Future",
    "coverUrl": "/storage/zero-to-one/cover.png",
    "audioUrl": "/storage/zero-to-one/audio.mp3",
    "lang": "en",
    "durationSec": 737,
    "publishedAt": "2025-11-12T08:00:00Z",
    "categories": ["business", "startups"],
    "summary": "/storage/zero-to-one/summary.json",
    "visualUrl": "/storage/zero-to-one/visualisation.png",
    "transcript": "/storage/zero-to-one/transcript.json"
  },
  {
    "id": "nexus-ael3",
    "title": "Nexus",
    "author": "Yuval Noah Harari",
    "subtitle": "A Brief History of Information Networks from the Stone Age to AI",
    "coverUrl": "/storage/nexus/cover.png",
    "audioUrl": "/storage/nexus/audio.mp3",
    "lang": "en",
    "durationSec": 739,
    "publishedAt": "2025-12-18T08:00:00Z",
    "categories": ["history", "technology"],
    "summary": "/storage/nexus/summary.json",
    "visualUrl": "/storage/nexus/visualisation.png",
    "transcript": "/storage/nexus/transcript.json"
  }
]`;

function App() {
  const squareRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [colorIndex, setColorIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [booksJson, setBooksJson] = useState<string>(INITIAL_BOOKS_JSON);
  const [lastValidBooks, setLastValidBooks] = useState<Book[]>(JSON.parse(INITIAL_BOOKS_JSON));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>(lastValidBooks);

  useEffect(() => {
    try {
      const parsedBooks = JSON.parse(booksJson);
      if (Array.isArray(parsedBooks)) {
        setBooks(parsedBooks);
        setLastValidBooks(parsedBooks);
        setJsonError(null);
      } else {
        setJsonError("JSON must be an array of books");
      }
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  }, [booksJson]);

  const handleExport = async () => {
    try {
      const zip = new JSZip();
      const hdFolder = zip.folder("hd");

      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const squareRef = squareRefs.current.get(book.id);
        if (!squareRef) continue;

        // Store original styles
        const originalTransform = squareRef.style.transform;
        const originalPosition = squareRef.style.position;
        const originalLeft = squareRef.style.left;
        const originalTop = squareRef.style.top;

        // Reset positioning for export
        squareRef.style.transform = 'none';
        squareRef.style.position = 'relative';
        squareRef.style.left = '0';
        squareRef.style.top = '0';

        // Generate HD version (3000x3000)
        const hdDataUrl = await toPng(squareRef, {
          width: 3000,
          height: 3000,
          pixelRatio: 1,
          quality: 1,
          skipAutoScale: true
        });

        // Restore original styles
        squareRef.style.transform = originalTransform;
        squareRef.style.position = originalPosition;
        squareRef.style.left = originalLeft;
        squareRef.style.top = originalTop;

        // Create thumbnail (400x400)
        const hdImg = new window.Image();
        hdImg.src = hdDataUrl;
        await new Promise(resolve => { hdImg.onload = resolve; });
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2D context for thumbnail canvas');
        ctx.drawImage(hdImg, 0, 0, 3000, 3000, 0, 0, 400, 400);
        const thumbnailDataUrl = canvas.toDataURL('image/png');

        // Convert base64 to blob
        const hdBlob = await fetch(hdDataUrl).then(res => res.blob());
        const thumbnailBlob = await fetch(thumbnailDataUrl).then(res => res.blob());
        
        // Add files to zip
        hdFolder?.file(`${book.id}.png`, hdBlob);
        zip.file(`${book.id}.png`, thumbnailBlob);
      }
      
      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Download zip file
      const link = document.createElement("a");
      link.download = "covers.zip";
      link.href = URL.createObjectURL(zipBlob);
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to export images");
    }
  };

  // Get the background color from the current combo's class
  const getBgColor = (index: number) => {
    const combo = colorCombinations[(colorIndex + index) % colorCombinations.length];
    const bgClass = combo.bgClass.split(' ').find(c => c.startsWith('bg-'));
    if (!bgClass) return '#FFF';
    
    // Create a temporary element to get the computed style
    const temp = document.createElement('div');
    temp.className = bgClass;
    document.body.appendChild(temp);
    const color = window.getComputedStyle(temp).backgroundColor;
    document.body.removeChild(temp);
    return color;
  };

  return (
    <div className="w-screen min-h-screen relative">
      {/* Topbar */}
      <div className="fixed top-0 left-0 w-full h-16 flex items-center px-8 bg-white shadow z-10">
        <div className="flex gap-4 items-center w-full">
          <input
            type="range"
            min={0}
            max={colorCombinations.length - 1}
            value={colorIndex}
            onChange={e => setColorIndex(Number(e.target.value))}
            className="w-full flex-grow"
          />
          <span className="text-sm text-gray-500 w-[72px] text-center tabular-nums">
            {colorIndex + 1}-{Math.min(colorIndex + books.length, colorCombinations.length)}
          </span>
          <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
          <Button onClick={handleExport}>Export All</Button>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {jsonError && (
            <div className="p-2 bg-red-100 text-red-700 text-sm">
              {jsonError}
            </div>
          )}
          <Textarea
            value={booksJson}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBooksJson(e.target.value)}
            className="w-full flex-1 font-mono text-xs whitespace-pre"
          />
        </div>
      </div>

      {/* Grid of covers */}
      <div className={`pt-24 px-8 pb-8 transition-all duration-300 ${isSidebarOpen ? 'pr-[calc(2rem+20rem)]' : 'pr-8'}`}>
        <div className="grid grid-cols-[repeat(auto-fit,300px)] gap-8">
          {books.map((book, index) => (
            <div
              key={book.id}
              className="relative w-[300px] h-[300px]"
            >
              <div
                ref={(el: HTMLDivElement | null) => {
                  if (el) {
                    squareRefs.current.set(book.id, el);
                  }
                }}
                className={`absolute w-[3000px] h-[3000px] origin-center ${colorCombinations[(colorIndex + index) % colorCombinations.length].bgClass}`}
                style={{ 
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%) scale(0.1)',
                }}
              >
                <BookCover 
                  className={colorCombinations[(colorIndex + index) % colorCombinations.length].textClass} 
                  backgroundColor={getBgColor(index)}
                  title={book.title}
                  author={book.author}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
