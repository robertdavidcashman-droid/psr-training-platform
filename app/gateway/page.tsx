import { Suspense } from "react";
import { GatewayClient } from "./GatewayClient";

export default function GatewayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <GatewayClient />
    </Suspense>
  );
}

