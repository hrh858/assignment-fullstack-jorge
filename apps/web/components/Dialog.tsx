import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

export default function Dialog(props: {
  children: ReactNode;
  visible?: boolean;
  title: string;
  onExit: () => void;
}) {
  const { children, visible, onExit, title } = props;
  return (
    <>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            transition={{ duration: 0.3 }}
            initial={{ backgroundColor: "rgba(0,0,0,0)" }}
            animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            exit={{ backgroundColor: "rgba(0,0,0,0)" }}
            className="fixed top-0 left-0 bg-black bg-opacity-40 z-50 w-screen h-screen backdrop-blur flex flex-col-reverse items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className=" w-1/2 max-w-screen-xl h-auto bg-hanastone bordrer border-hanagreen rounded-lg py-2 px-4"
            >
              <div className="w-full h-auto flex flex-row items-center justify-between mb-4">
                <h1 className="text-lg font-bold">{title}</h1>
                <button onClick={onExit}>
                  <FontAwesomeIcon icon={faClose} size="lg" />
                </button>
              </div>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
