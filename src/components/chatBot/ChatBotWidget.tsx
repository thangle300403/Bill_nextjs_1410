/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import AskChatbot from "./AskChatBot";
import styled from "styled-components";

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);

  // Auto-close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Floating Chat Button */}
      <StyledWrapper>
        <button onClick={() => setOpen(true)}>
          <span>
            <img
              src="/images/ChatbotBill3.png"
              alt="Chatbot Bill"
              className="w-16 h-16 object-contain"
            />
          </span>
        </button>
      </StyledWrapper>

      {/* Slide-over Chatbot Panel */}
      <div
        className={`fixed z-50 bottom-0 right-0 w-full sm:w-[700px] transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh", zIndex: 9999 }}
      >
        {open && (
          <div
            ref={chatbotRef}
            className="relative bg-white rounded-t-3xl shadow-2xl border border-yellow-100 overflow-auto"
            style={{ height: "90vh" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-blue-500 focus:outline-none text-2xl"
              aria-label="Đóng chatbot"
            >
              <IoClose />
            </button>
            <AskChatbot />
          </div>
        )}
      </div>
    </>
  );
}

const StyledWrapper = styled.div`
  button {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999;
    border: none;
    border-radius: 50%;
    background: linear-gradient(
      32deg,
      #ec5c5cff,
      #00ff00ff,
      #ffe600ff,
      #f700ffff
    );
    transition: all 1.5s ease;
    font-family: "Ropa Sans", sans-serif;
    font-weight: bold;
    letter-spacing: 0.05rem;
    padding: 0;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 24px rgba(84, 76, 11, 0.6), 0 6px 20px rgba(0, 0, 0, 0.4);
  }

  button span {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border-radius: 50%;
    background: rgba(255, 234, 0, 0.51);
    backdrop-filter: blur(20px);
    transition: 0.4s ease-in-out;
    transition-property: color;
    width: 100%;
    height: 100%;
  }

  button span:hover {
    backdrop-filter: blur(0px);
    color: #ffffff;
  }
`;
