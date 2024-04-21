import type { FC } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export const HoverMotionDiv: FC<HTMLMotionProps<"div">> = ({ children, className, ...props }) => {
  return (
    <motion.div
      {...props}
      className={className}
      initial={{ borderRadius: "10%", borderWidth: "1px" }}
      transition={{ borderWidth: { duration: 0 } }}
      whileHover={{
        scale: 1.1,
        zIndex: 9999,
        borderRadius: "calc(15% * 1.1)",
        boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
        borderWidth: "3px",
      }}
    >
      {children}
    </motion.div>
  );
};
