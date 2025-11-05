import { motion } from "framer-motion";

export default function KumboLogo({ size = 50 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-3"
    >
      <div
        className="rounded-2xl p-3"
        style={{
          background: "linear-gradient(135deg, #1f1f1f, #3b3b3b)",
          boxShadow:
            "0 8px 25px rgba(0,0,0,0.35), 0 0 18px rgba(0, 150, 255, 0.35)",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" fill="#0F62FE" />
          <path
            d="M30 55 L50 30 L70 55 L50 70 Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>

      <motion.span
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-3xl font-semibold tracking-wide"
        style={{
          background: "linear-gradient(to right, #ffffff, #d7e9ff)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 3px 10px rgba(0,0,0,0.35)",
        }}
      >
        KUMBO
      </motion.span>
    </motion.div>
  );
}
