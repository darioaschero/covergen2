import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Topbar */}
      <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-8 bg-white shadow z-10">
        <div className="font-bold text-lg">My App</div>
        <Button>Export</Button>
      </div>
      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-96 h-96 bg-red-500 flex items-center justify-center">
          <h1 className="text-white text-2xl">Testing Tailwind</h1>
        </div>
      </div>
    </div>
  )
}

export default App
