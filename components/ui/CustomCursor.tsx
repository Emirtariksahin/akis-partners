"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [text, setText] = useState("");
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    // eslint-disable-next-line
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const clickable = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
      
      if (clickable) {
        setIsPointer(true);
        const customText = clickable.getAttribute('data-cursor-text');
        if (customText) {
          setText(customText);
        } else {
          setText("");
        }
      } else {
        setIsPointer(false);
        setText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", () => {
      setIsPointer(false);
      setText("");
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: text ? 80 : isPointer ? 40 : 16,
        height: text ? 80 : isPointer ? 40 : 16,
        backgroundColor: text || isPointer ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 1)",
        borderRadius: "50%",
      }}
      transition={{ duration: 0.2 }}
    >
      {text && (
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-black text-xs font-semibold tracking-widest text-center"
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );
}
