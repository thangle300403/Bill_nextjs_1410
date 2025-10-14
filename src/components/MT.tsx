import React from "react";
import styled from "styled-components";

export default function MT() {
  return (
    <StyledWrapper>
      <div className="cube-container">
        <div className="cube">
          <div className="face front">
            <span>Không tìm thấy kết quả.</span>
          </div>
          <div className="face back">Không tìm thấy kết quả.</div>
          <div className="face right">Không tìm thấy kết quả.</div>
          <div className="face left">Không tìm thấy kết quả.</div>
          <div className="face top">Không tìm thấy kết quả.</div>
          <div className="face bottom">Không tìm thấy kết quả.</div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cube-container {
    width: 400px;
    height: 400px;
    perspective: 800px;
    margin: 50px auto;
    transition: 0.8s ease-out;
  }

  .cube-container:hover {
    transform: scale(2);
  }

  .cube {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: rotate 12s infinite linear;
  }

  .face {
    --french: linear-gradient(
        to right,
        #0000ff,
        #ffffff,
        #ffffff,
        #ffffff,
        #ff0000
      )
      1;
    position: absolute;
    width: 200px;
    height: 200px;
    color: white;
    font-size: 18px;
    text-align: center;
    line-height: 200px;
    background: #000000cc;
    border: 2px solid;
    border-image: var(--french);
  }

  .front {
    transform: translateZ(100px);
  }

  .back {
    transform: rotateY(180deg) translateZ(100px);
  }

  .right {
    transform: rotateY(90deg) translateZ(100px);
  }

  .left {
    transform: rotateY(-90deg) translateZ(100px);
  }

  .top {
    transform: rotateX(90deg) translateZ(100px);
  }

  .bottom {
    transform: rotateX(-90deg) translateZ(100px);
  }

  @keyframes rotate {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0);
    }

    100% {
      transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
  }
`;
