import { motion } from "framer-motion";

export default function Button({ text, type = "primary", onClick, disabled, style }) {
  return (
    <motion.button 
      className={`btn btn-${type}`} 
      onClick={onClick}
      disabled={disabled}
      style={style}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </motion.button>
  );
}
