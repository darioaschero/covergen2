import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { colorCombinations } from "@/constants/colors";
import { BookCover } from "@/components/BookCover";

function App() {
  const squareRef = useRef<HTMLDivElement>(null);
  const [colorIndex, setColorIndex] = useState(0);

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

      const dataUrl = await toPng(squareRef.current, {
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

      const link = document.createElement("a");
      link.download = "square-3000x3000.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to export image");
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
          <Button onClick={handleExport}>Export</Button>
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
        />
      </div>
    </div>
  );
}

export default App;
