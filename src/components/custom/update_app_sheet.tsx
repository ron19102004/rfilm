import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, X } from "lucide-react";
import { useSystemContext } from "@/context";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";

const UpdateAppSheet: React.FC = () => {
  const { updateAvailable, urlDownloadAppAndroid, isLoading } =
    useSystemContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform() && updateAvailable && !isLoading) {
      setIsVisible(true);
    }
  }, [isLoading]);
  if (isLoading) return null;
  return (
    <div
      className={cn(
        "fixed bottom-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 w-[95vw] z-50 left-1/2 -translate-x-1/2 py-5 rounded-lg",
        isVisible ? "block" : "hidden"
      )}
    >
      <div className="flex items-center justify-between max-w-screen-sm mx-auto px-4">
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="w-5 h-5 text-blue-500" />
          <p className="text-sm font-medium">Có phiên bản mới</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {}}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <a href={urlDownloadAppAndroid}>Cập nhật</a>
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            size="sm"
            variant="ghost"
            className="p-1 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppSheet;
