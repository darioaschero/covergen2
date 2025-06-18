import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { colorCombinations } from "@/constants/colors";
import { BookCover } from "@/components/BookCover";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JSZip from "jszip";

function App() {
  const squareRef = useRef<HTMLDivElement>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState("Can't Hurt Me");
  const [author, setAuthor] = useState("David Goggins");

  const handleExport = async () => {
    if (!squareRef.current) return;
    try {
      // Store original styles
      const originalTransform = squareRef.current.style.transform;
      const originalPosition = squareRef.current.style.position;
      const originalLeft = squareRef.current.style.left;
      const originalTop = squareRef.current.style.top;

      // Reset positioning for export
      squareRef.current.style.transform = 'none';
      squareRef.current.style.position = 'relative';
      squareRef.current.style.left = '0';
      squareRef.current.style.top = '0';

      // Generate HD version (3000x3000)
      const hdDataUrl = await toPng(squareRef.current, {
        width: 3000,
        height: 3000,
        pixelRatio: 1,
        quality: 1,
        skipAutoScale: true
      });

      // Restore original styles
      squareRef.current.style.transform = originalTransform;
      squareRef.current.style.position = originalPosition;
      squareRef.current.style.left = originalLeft;
      squareRef.current.style.top = originalTop;

      // Create thumbnail (400x400) by scaling down the HD image
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

      // Create zip file
      const zip = new JSZip();
      
      // Convert base64 to blob
      const hdBlob = await fetch(hdDataUrl).then(res => res.blob());
      const thumbnailBlob = await fetch(thumbnailDataUrl).then(res => res.blob());
      
      // Add files to zip
      zip.file("CoverHD.png", hdBlob);
      zip.file("Cover.png", thumbnailBlob);
      
      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Download zip file
      const link = document.createElement("a");
      link.download = "cover.zip";
      link.href = URL.createObjectURL(zipBlob);
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to export images");
    }
  };

  const currentCombo = colorCombinations[colorIndex];
  
  // Get the background color from the current combo's class
  const getBgColor = () => {
    const bgClass = currentCombo.bgClass.split(' ').find(c => c.startsWith('bg-'));
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
    <div className="w-screen h-screen relative">
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
          <span className="text-sm text-gray-500 w-[72px] text-center tabular-nums">{colorIndex + 1} / {colorCombinations.length}</span>
          <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Absolutely centered square */}
      <div
        ref={squareRef}
        className={`w-[3000px] h-[3000px] origin-center absolute left-1/2 top-1/2 ${currentCombo.bgClass}`}
        style={{ 
          transform: 'translate(-50%, -50%) scale(0.2)',
        }}
      >
        <BookCover 
          className={currentCombo.textClass} 
          backgroundColor={getBgColor()}
          title={title}
          author={author}
        />
      </div>
    </div>
  );
}

export default App;
