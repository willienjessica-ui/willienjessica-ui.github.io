import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  angle: number;
  distance: number;
  color: string;
}

const colors = ['#00D1FF', '#38bdf8', '#7dd3fc', '#ffffff', '#60a5fa'];

export const Sparks: React.FC = () => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const generateSpark = (): Spark => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 0.5,
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 150 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    // Initial sparks
    const initialSparks = Array.from({ length: 40 }, generateSpark);
    setSparks(initialSparks);

    // Continuously add and remove sparks
    const interval = setInterval(() => {
      setSparks((currentSparks) => {
        // Keep some existing sparks, add new ones
        const keptSparks = currentSparks.slice(10);
        const newSparks = Array.from({ length: 15 }, generateSpark);
        return [...keptSparks, ...newSparks];
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full"
            style={{
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: spark.size,
              height: spark.size,
              backgroundColor: spark.color,
              boxShadow: `0 0 ${spark.size * 3}px ${spark.color}, 0 0 ${spark.size * 6}px ${spark.color}`,
            }}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 0.5, 0],
              x: Math.cos(spark.angle) * spark.distance,
              y: Math.sin(spark.angle) * spark.distance + 100, // Gravity effect
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: spark.duration,
              delay: spark.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
