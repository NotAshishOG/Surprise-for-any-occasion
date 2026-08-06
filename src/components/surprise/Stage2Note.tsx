import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Stage2Props {
  card: {
    senderName?: string;
    recipientName: string;
    message: string;
    photo1Url?: string;
  };
  onNext: () => void;
}

export function Stage2Note({ card, onNext }: Stage2Props) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [skipTyping, setSkipTyping] = useState(false);

  useEffect(() => {
    if (skipTyping) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedMessage(card.message || "");
      setIsTypingComplete(true);
      return;
    }

    let index = 0;
    let currentHtml = "";
    const html = card.message || "";
    
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (index >= html.length) {
          clearInterval(interval);
          setIsTypingComplete(true);
          return;
        }
        
        if (html[index] === '<') {
          const closingIndex = html.indexOf('>', index);
          if (closingIndex !== -1) {
            currentHtml += html.substring(index, closingIndex + 1);
            index = closingIndex + 1;
          } else {
            currentHtml += html[index];
            index++;
          }
        } else {
          currentHtml += html[index];
          index++;
        }
        
        setDisplayedMessage(currentHtml);
      }, 35);
      
      return () => clearInterval(interval);
    }, 800);
    
    return () => clearTimeout(startDelay);
  }, [card.message, skipTyping]);

  return (
    <motion.div
      className="w-full h-full flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-12 relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
      onClick={() => !isTypingComplete && setSkipTyping(true)}
    >
      {/* Left Column: Photo/Illustration */}
      <motion.div 
        className="w-full max-w-[240px] md:w-1/3 flex-shrink-0 flex items-center justify-center cursor-pointer md:cursor-default"
        initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.5 }}
        whileHover={{ scale: 1.02, rotate: -2 }}
      >
        {card.photo1Url ? (
          <div className="w-full aspect-[3/4] bg-gray-100 relative border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden group">
            <Image 
              src={card.photo1Url} 
              alt="Memory" 
              fill
              unoptimized={true}
              className="object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
              draggable={false}
            />
          </div>
        ) : (
          <div className="w-full aspect-[3/4] bg-[#D0F0FF] relative border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden flex flex-col items-center justify-center">
            <span className="text-4xl">🤝</span>
          </div>
        )}
      </motion.div>
      
      {/* Right Column: Message */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-sans"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Dear {card.recipientName},
        </motion.h2>
        
        <div 
          className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-sans flex-1 min-h-[150px]"
        >
          <span dangerouslySetInnerHTML={{ __html: displayedMessage }} />
          {!isTypingComplete && (
            <motion.span 
              className="inline-block w-2 h-5 bg-gray-400 ml-1 translate-y-1 rounded-sm"
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
            />
          )}
        </div>
        
        <div className="mt-8 flex justify-between items-end">
          <motion.p 
            className="text-gray-900 font-handwriting text-xl md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: isTypingComplete ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            — {card.senderName || 'your friend'}
          </motion.p>

          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              if (isTypingComplete) {
                onNext();
              } else {
                setSkipTyping(true);
              }
            }}
            className="px-6 py-2 bg-[#FFD166] border-2 border-black rounded-full font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 transition-all uppercase"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isTypingComplete ? 1 : 0.7, 
              scale: isTypingComplete ? 1 : 0.95 
            }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {isTypingComplete ? 'NEXT' : 'SKIP'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
