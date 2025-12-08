/* eslint-disable @next/next/no-img-element */

"use client";

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
type Props = {
  status: "success" | "error" | "missing";
};
export default function ActiveAccount({ status }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(() => {
        router.push("/?showLogin=true");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [status, router]);

  if (status === "missing")
    return (
      <p className="text-red-600 text-center mt-10">Thiếu token kích hoạt.</p>
    );

  if (status === "error")
    return (
      <p className="text-red-600 text-center mt-10">Lỗi kích hoạt tài khoản.</p>
    );

  return (
    <StyledWrapper>
      <div className="card-3d">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i}>
            <img
              src="/images/BillAI.png"
              alt="Shirt Icon"
              className="w-[var(--sz-btn)] h-[var(--sz-btn)] object-contain"
            />
            Tài khoản đã được kích hoạt. Về trang chủ sau 5s...
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full screen height */
  background-color: #fff; /* Optional background */

  @keyframes autoRun3d {
    from {
      transform: perspective(800px) rotateY(-360deg);
    }
    to {
      transform: perspective(800px) rotateY(0deg);
    }
  }

  @keyframes animateBrightness {
    10% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(0.1);
    }
    90% {
      filter: brightness(1);
    }
  }

  .card-3d {
    position: relative;
    width: 500px;
    height: 600px; /* Increased height */
    transform-style: preserve-3d;
    transform: perspective(800px);
    animation: autoRun3d 20s linear infinite;
    will-change: transform;
  }

  .card-3d div {
    position: absolute;
    width: 100px;
    height: 250px; /* Taller card */
    background-color: rgb(199, 199, 199);
    border: solid 2px lightgray;
    border-radius: 0.5rem;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    animation: animateBrightness 20s linear infinite;
    transition-duration: 200ms;
    will-change: transform, filter;
  }

  .card-3d:hover,
  .card-3d:hover div {
    animation-play-state: paused !important;
  }

  .card-3d div:nth-child(1) {
    transform: translate(-50%, -50%) rotateY(0deg) translateZ(200px);
    animation-delay: -0s;
  }

  .card-3d div:nth-child(2) {
    transform: translate(-50%, -50%) rotateY(36deg) translateZ(200px);
    animation-delay: -2s;
  }

  .card-3d div:nth-child(3) {
    transform: translate(-50%, -50%) rotateY(72deg) translateZ(200px);
    animation-delay: -4s;
  }

  .card-3d div:nth-child(4) {
    transform: translate(-50%, -50%) rotateY(108deg) translateZ(200px);
    animation-delay: -6s;
  }

  .card-3d div:nth-child(5) {
    transform: translate(-50%, -50%) rotateY(144deg) translateZ(200px);
    animation-delay: -8s;
  }

  .card-3d div:nth-child(6) {
    transform: translate(-50%, -50%) rotateY(180deg) translateZ(200px);
    animation-delay: -10s;
  }

  .card-3d div:nth-child(7) {
    transform: translate(-50%, -50%) rotateY(216deg) translateZ(200px);
    animation-delay: -12s;
  }

  .card-3d div:nth-child(8) {
    transform: translate(-50%, -50%) rotateY(252deg) translateZ(200px);
    animation-delay: -14s;
  }

  .card-3d div:nth-child(9) {
    transform: translate(-50%, -50%) rotateY(288deg) translateZ(200px);
    animation-delay: -16s;
  }

  .card-3d div:nth-child(10) {
    transform: translate(-50%, -50%) rotateY(324deg) translateZ(200px);
    animation-delay: -18s;
  }
`;
