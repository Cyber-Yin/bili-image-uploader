import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        <div className="text-sm font-semibold">页面加载中...</div>
      </div>
    </main>
  );
};

export default Loading;
