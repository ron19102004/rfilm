import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="flex justify-center">
          {["R", "F", "I", "L", "M"].map((letter, index) => (
            <motion.div
              key={index}
              className="text-6xl font-bold "
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 1,
                x: (index - 2) * 25,
                y: 0,
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.15,
                type: "spring",
                stiffness: 50,
                damping: 15,
                mass: 1,
              }}
              style={{
                background:
                  "linear-gradient(90deg, #ff0000 0%, #ff4d4d 50%, #ff0000 100%)",
                backgroundSize: "200% auto",
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                textShadow: "0 0 15px rgba(255, 0, 0, 0.5)",
                marginLeft: index === 0 ? "0" : "-5px",
                animation: "shine 1s linear infinite",
              }}
            >
              {letter}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{
            delay: 1.5,
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className="flex justify-center mt-10"
        >
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
