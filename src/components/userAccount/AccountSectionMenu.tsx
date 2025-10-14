"use client";

import React from "react";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";

const accountMenu = [
  { href: "/thong-tin-tai-khoan", label: "Thông tin tài khoản", id: "value-1" },
  {
    href: "/dia-chi-giao-hang-mac-dinh",
    label: "Địa chỉ giao hàng",
    id: "value-2",
  },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng của tôi", id: "value-3" },
];

const AccountMenuBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <StyledWrapper>
      <div className="radio-input">
        {accountMenu.map((item) => {
          const isActive = pathname === item.href;

          return (
            <label key={item.href}>
              <input
                type="radio"
                id={item.id}
                name="value-radio"
                value={item.id}
                checked={isActive}
                readOnly
              />
              <span
                className={isActive ? "active" : ""}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </span>
            </label>
          );
        })}
        <span className="selection" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .radio-input input {
    display: none;
  }

  .radio-input {
    --container_width: 470px;
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 10px;
    background-color: #fff;
    color: #000000;
    width: var(--container_width);
    overflow: hidden;
    border: 1px solid rgba(53, 52, 52, 0.226);
  }

  .radio-input label {
    width: 100%;
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-weight: 600;
    letter-spacing: -1px;
    font-size: 14px;
    white-space: nowrap;
  }

  .selection {
    display: none;
    position: absolute;
    height: 100%;
    width: calc(var(--container_width) / 3);
    z-index: 0;
    left: 0;
    top: 0;
    transition: 0.15s ease;
  }

  .radio-input label:has(input:checked) {
    color: #fff;
  }

  .radio-input label:has(input:checked) ~ .selection {
    background-color: green;
    display: inline-block;
  }

  .radio-input label:nth-child(1):has(input:checked) ~ .selection {
    transform: translateX(calc(var(--container_width) * 0 / 3));
  }

  .radio-input label:nth-child(2):has(input:checked) ~ .selection {
    transform: translateX(calc(var(--container_width) * 1 / 3));
  }

  .radio-input label:nth-child(3):has(input:checked) ~ .selection {
    transform: translateX(calc(var(--container_width) * 2 / 3));
  }
`;

export default AccountMenuBar;
