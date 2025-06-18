import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";

function App() {
  const squareRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!squareRef.current) return;
    try {
      // Temporarily remove the scale transform for high-res export
      const originalTransform = squareRef.current.style.transform;
      squareRef.current.style.transform = 'none';
      const dataUrl = await toPng(squareRef.current, {
        width: 3000,
        height: 3000,
        pixelRatio: 1
      });
      // Restore the scale
      squareRef.current.style.transform = originalTransform;

      const link = document.createElement("a");
      link.download = "square-3000x3000.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to export image");
    }
  };

  return (
    <div className="w-screen h-screen relative">
      {/* Topbar */}
      <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-8 bg-white shadow z-10">
        <div className="font-bold text-lg">My App</div>
        <Button onClick={handleExport}>Export</Button>
      </div>
      {/* Absolutely centered square */}
      <div
        ref={squareRef}
        className="w-[3000px] h-[3000px] bg-red-500 flex items-center justify-center origin-center absolute left-1/2 top-1/2"
        style={{ transform: 'translate(-50%, -50%) scale(0.1)' }}
      >
        <h1 className="text-white text-[200px]">Testing Tailwind</h1>
      </div>
    </div>
  );
}

export default App;
