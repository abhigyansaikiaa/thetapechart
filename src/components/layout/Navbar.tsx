"use client";

import { NavbarClient } from "./NavbarClient";
import { NavbarMock } from "./NavbarMock";

const isClerkEnabled = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YWxwaGFlZGdl") &&
  process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("placeholder");

export function Navbar() {
  if (isClerkEnabled) {
    return <NavbarClient />;
  }
  return <NavbarMock />;
}
