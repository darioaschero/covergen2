import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { colorCombinations } from "@/constants/colors";
import { BookCover } from "@/components/BookCover";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const INITIAL_BIOGRAPHIES_JSON = `[
  {
    "id": "elon-musk-01",
    "title": "Elon Musk",
    "author": "Biography Team",
    "subtitle": "Visionary Entrepreneur and Innovator",
    "coverUrl": "/storage/elon-musk/cover.png",
    "audioUrl": "/storage/elon-musk/audio.mp3",
    "lang": "en",
    "durationSec": 780,
    "publishedAt": "2025-01-10T08:00:00Z",
    "categories": ["technology", "entrepreneurship"],
    "description": "Elon Musk is the CEO of Tesla and SpaceX, known for revolutionizing electric vehicles, private space travel, and pushing the boundaries of innovation.",
    "visualUrl": "/storage/elon-musk/visualisation.png",
    "transcript": "/storage/elon-musk/transcript.json"
  },
  {
    "id": "marie-curie-02",
    "title": "Marie Curie",
    "author": "Biography Team",
    "subtitle": "Pioneer of Radioactivity",
    "coverUrl": "/storage/marie-curie/cover.png",
    "audioUrl": "/storage/marie-curie/audio.mp3",
    "lang": "en",
    "durationSec": 732,
    "publishedAt": "2025-02-15T08:00:00Z",
    "categories": ["science", "history"],
    "description": "Marie Curie was a physicist and chemist who discovered polonium and radium, becoming the first person to win Nobel Prizes in two different sciences.",
    "visualUrl": "/storage/marie-curie/visualisation.png",
    "transcript": "/storage/marie-curie/transcript.json"
  },
  {
    "id": "martin-luther-king-03",
    "title": "Martin Luther King Jr.",
    "author": "Biography Team",
    "subtitle": "Champion of Civil Rights",
    "coverUrl": "/storage/martin-luther-king/cover.png",
    "audioUrl": "/storage/martin-luther-king/audio.mp3",
    "lang": "en",
    "durationSec": 755,
    "publishedAt": "2025-03-10T08:00:00Z",
    "categories": ["history", "leadership"],
    "description": "Martin Luther King Jr. was a Baptist minister and civil rights leader whose vision of equality and nonviolence transformed America's struggle for justice.",
    "visualUrl": "/storage/martin-luther-king/visualisation.png",
    "transcript": "/storage/martin-luther-king/transcript.json"
  },
  {
    "id": "steve-jobs-04",
    "title": "Steve Jobs",
    "author": "Biography Team",
    "subtitle": "Co-founder of Apple",
    "coverUrl": "/storage/steve-jobs/cover.png",
    "audioUrl": "/storage/steve-jobs/audio.mp3",
    "lang": "en",
    "durationSec": 768,
    "publishedAt": "2025-04-22T08:00:00Z",
    "categories": ["technology", "business"],
    "description": "Steve Jobs co-founded Apple Inc. and revolutionized personal computing, music, and mobile technology through his relentless pursuit of excellence.",
    "visualUrl": "/storage/steve-jobs/visualisation.png",
    "transcript": "/storage/steve-jobs/transcript.json"
  },
  {
    "id": "malala-yousafzai-05",
    "title": "Malala Yousafzai",
    "author": "Biography Team",
    "subtitle": "Voice for Education and Equality",
    "coverUrl": "/storage/malala-yousafzai/cover.png",
    "audioUrl": "/storage/malala-yousafzai/audio.mp3",
    "lang": "en",
    "durationSec": 721,
    "publishedAt": "2025-05-18T08:00:00Z",
    "categories": ["activism", "education"],
    "description": "Malala Yousafzai is a Pakistani activist and Nobel Peace Prize laureate who advocates for girls' education and human rights worldwide.",
    "visualUrl": "/storage/malala-yousafzai/visualisation.png",
    "transcript": "/storage/malala-yousafzai/transcript.json"
  },
  {
    "id": "albert-einstein-06",
    "title": "Albert Einstein",
    "author": "Biography Team",
    "subtitle": "Genius of Modern Physics",
    "coverUrl": "/storage/albert-einstein/cover.png",
    "audioUrl": "/storage/albert-einstein/audio.mp3",
    "lang": "en",
    "durationSec": 812,
    "publishedAt": "2025-06-25T08:00:00Z",
    "categories": ["science", "philosophy"],
    "description": "Albert Einstein developed the theory of relativity and reshaped our understanding of time, space, and energy, influencing modern physics forever.",
    "visualUrl": "/storage/albert-einstein/visualisation.png",
    "transcript": "/storage/albert-einstein/transcript.json"
  },
  {
    "id": "nelson-mandela-07",
    "title": "Nelson Mandela",
    "author": "Biography Team",
    "subtitle": "Symbol of Freedom and Reconciliation",
    "coverUrl": "/storage/nelson-mandela/cover.png",
    "audioUrl": "/storage/nelson-mandela/audio.mp3",
    "lang": "en",
    "durationSec": 790,
    "publishedAt": "2025-07-29T08:00:00Z",
    "categories": ["politics", "leadership"],
    "description": "Nelson Mandela was a South African anti-apartheid revolutionary and the country's first Black president, renowned for his fight for equality and peace.",
    "visualUrl": "/storage/nelson-mandela/visualisation.png",
    "transcript": "/storage/nelson-mandela/transcript.json"
  },
  {
    "id": "ada-lovelace-08",
    "title": "Ada Lovelace",
    "author": "Biography Team",
    "subtitle": "The First Computer Programmer",
    "coverUrl": "/storage/ada-lovelace/cover.png",
    "audioUrl": "/storage/ada-lovelace/audio.mp3",
    "lang": "en",
    "durationSec": 703,
    "publishedAt": "2025-08-12T08:00:00Z",
    "categories": ["technology", "history"],
    "description": "Ada Lovelace was a 19th-century mathematician who wrote the first algorithm intended for a machine, earning her the title of the world's first programmer.",
    "visualUrl": "/storage/ada-lovelace/visualisation.png",
    "transcript": "/storage/ada-lovelace/transcript.json"
  },
  {
    "id": "leonardo-da-vinci-09",
    "title": "Leonardo da Vinci",
    "author": "Biography Team",
    "subtitle": "The Renaissance Genius",
    "coverUrl": "/storage/leonardo-da-vinci/cover.png",
    "audioUrl": "/storage/leonardo-da-vinci/audio.mp3",
    "lang": "en",
    "durationSec": 829,
    "publishedAt": "2025-09-20T08:00:00Z",
    "categories": ["art", "science"],
    "description": "Leonardo da Vinci was an Italian polymath whose brilliance spanned art, science, and invention, embodying the spirit of the Renaissance.",
    "visualUrl": "/storage/leonardo-da-vinci/visualisation.png",
    "transcript": "/storage/leonardo-da-vinci/transcript.json"
  },
  {
    "id": "oprah-winfrey-10",
    "title": "Oprah Winfrey",
    "author": "Biography Team",
    "subtitle": "Media Mogul and Philanthropist",
    "coverUrl": "/storage/oprah-winfrey/cover.png",
    "audioUrl": "/storage/oprah-winfrey/audio.mp3",
    "lang": "en",
    "durationSec": 765,
    "publishedAt": "2025-10-25T08:00:00Z",
    "categories": ["media", "inspiration"],
    "description": "Oprah Winfrey rose from humble beginnings to become one of the most influential media figures and philanthropists in modern history.",
    "visualUrl": "/storage/oprah-winfrey/visualisation.png",
    "transcript": "/storage/oprah-winfrey/transcript.json"
  }
]`;

function App() {
  const squareRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [colorIndex, setColorIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'english' | 'deutsch'>('english');
  const [type, setType] = useState<'book' | 'biography'>('book');
  const [booksJson, setBooksJson] = useState<string>(INITIAL_BOOKS_JSON);
  const [biographiesJson, setBiographiesJson] = useState<string>(INITIAL_BIOGRAPHIES_JSON);
  const [lastValidBooks, setLastValidBooks] = useState<Book[]>(JSON.parse(INITIAL_BOOKS_JSON));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>(lastValidBooks);

  useEffect(() => {
    const currentJson = type === 'book' ? booksJson : biographiesJson;
    try {
      const parsedData = JSON.parse(currentJson);
      if (Array.isArray(parsedData)) {
        setBooks(parsedData);
        if (type === 'book') {
          setLastValidBooks(parsedData);
        }
        setJsonError(null);
      } else {
        setJsonError("JSON must be an array");
      }
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  }, [booksJson, biographiesJson, type]);

  const handleExport = async () => {
    try {
      const zip = new JSZip();
      const hdFolder = zip.folder("hd");

      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const squareRef = squareRefs.current.get(book.id);
        if (!squareRef) continue;

        // Format color combo index as 6 digits
        const colorComboIndex = (colorIndex + i) % colorCombinations.length;
        const formattedIndex = (colorComboIndex + 1).toString().padStart(6, '0');
        
        // Create filename with new convention: 000001_[slug].png
        const filename = `${formattedIndex}_${book.id}.png`;

        // Create a temporary container for export
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);

        // Clone the element for HD version
        const hdClone = squareRef.cloneNode(true) as HTMLElement;
        hdClone.style.transform = 'none';
        hdClone.style.position = 'relative';
        hdClone.style.left = '0';
        hdClone.style.top = '0';
        hdClone.style.width = '3000px';
        hdClone.style.height = '3000px';
        tempContainer.appendChild(hdClone);

        // Generate HD version (3000x3000)
        const hdDataUrl = await toPng(hdClone, {
          width: 3000,
          height: 3000,
          pixelRatio: 1,
          quality: 1,
          skipAutoScale: true
        });

        // Clear the temporary container
        tempContainer.innerHTML = '';

        // Create a wrapper for thumbnail that will handle the scaling
        const thumbnailWrapper = document.createElement('div');
        thumbnailWrapper.style.width = '400px';
        thumbnailWrapper.style.height = '400px';
        thumbnailWrapper.style.position = 'relative';
        thumbnailWrapper.style.overflow = 'hidden';
        thumbnailWrapper.style.display = 'flex';
        thumbnailWrapper.style.alignItems = 'center';
        thumbnailWrapper.style.justifyContent = 'center';
        tempContainer.appendChild(thumbnailWrapper);

        // Clone for thumbnail and scale everything
        const thumbnailClone = squareRef.cloneNode(true) as HTMLElement;
        thumbnailClone.style.position = 'absolute';
        thumbnailClone.style.width = '3000px';
        thumbnailClone.style.height = '3000px';
        thumbnailClone.style.transform = 'scale(0.133333)'; // 400/3000
        thumbnailClone.style.transformOrigin = 'center center';
        thumbnailClone.style.left = '50%';
        thumbnailClone.style.top = '50%';
        thumbnailClone.style.marginLeft = '-1500px'; // -width/2
        thumbnailClone.style.marginTop = '-1500px';  // -height/2
        thumbnailWrapper.appendChild(thumbnailClone);

        // Generate thumbnail version (400x400)
        const thumbnailDataUrl = await toPng(thumbnailWrapper, {
          width: 400,
          height: 400,
          pixelRatio: 1,
          quality: 1,
          skipAutoScale: true
        });

        // Remove the temporary container
        document.body.removeChild(tempContainer);

        // Convert base64 to blob
        const hdBlob = await fetch(hdDataUrl).then(res => res.blob());
        const thumbnailBlob = await fetch(thumbnailDataUrl).then(res => res.blob());
        
        // Add files to zip with new naming convention
        hdFolder?.file(filename, hdBlob);
        zip.file(filename, thumbnailBlob);
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
          <div className="p-4 border-b space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <Select value={language} onValueChange={(value) => setLanguage(value as 'english' | 'deutsch')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="deutsch">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <Select value={type} onValueChange={(value) => setType(value as 'book' | 'biography')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="biography">Biography</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {jsonError && (
            <div className="p-2 bg-red-100 text-red-700 text-sm">
              {jsonError}
            </div>
          )}
          {type === 'book' ? (
            <Textarea
              value={booksJson}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBooksJson(e.target.value)}
              className="w-full flex-1 font-mono text-xs whitespace-pre"
              placeholder="Enter book data JSON..."
            />
          ) : (
            <Textarea
              value={biographiesJson}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBiographiesJson(e.target.value)}
              className="w-full flex-1 font-mono text-xs whitespace-pre"
              placeholder="Enter biography data JSON..."
            />
          )}
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
                  subtitle={book.subtitle}
                  language={language}
                  type={type}
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
