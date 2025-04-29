import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle } from "lucide-react";
import { useSystemContext } from "@/context";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";

const UpdateAppSheet: React.FC = () => {
  const { updateAvailable, isLoading ,downloadAndInstallApk} =
    useSystemContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform() && updateAvailable && !isLoading) {
      setIsVisible(true);
    }
  }, [isLoading,updateAvailable]);
  if (isLoading) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 bg-[#1a1a1a]/10 backdrop-blur z-50",
        isVisible ? "block" : "hidden"
      )}
    >
      <div
        className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-[#2a2a2a] border border-[#3a3a3a] z-50 py-10 rounded-xl w-72 "
        )}
      >
        <div className="flex flex-col gap-4 items-center justify-between  mx-auto px-4">
          <div className="flex flex-col items-center mx-auto space-y-5">
            <div className="flex items-center gap-2 text-2xl">
              <ArrowUpCircle className="w-5 h-5 text-white" />
              <h1 className="font-medium text-white">Có phiên bản mới</h1>
            </div>
            <div className="text-white space-y-2">
              <p className="border-l-3 pl-2 border-l-[#5a5a5a] rounded">
                Sửa lỗi: Đã khắc phục một số lỗi nhỏ từ phiên bản trước giúp
                trải nghiệm ổn định hơn.
              </p>
              <p className="border-l-3 pl-2 border-l-[#5a5a5a] rounded">
                Hãy cập nhật ngay để tận hưởng những cải tiến mới nhất!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Button
              onClick={downloadAndInstallApk}
              size="lg"
              className="bg-blue-500 text-white"
            >
              <p>Cập nhật</p>
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              size="lg"
              className="bg-white-500 border border-[#3a3a3a]"
            >
              <p>Để sau</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppSheet;
