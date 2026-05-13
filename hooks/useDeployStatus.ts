"use client";

import { useEffect, useState } from "react";

interface DeployStatus {
  github: boolean;
  vercel: boolean;
}

export function useDeployStatus(): DeployStatus | null {
  const [status, setStatus] = useState<DeployStatus | null>(null);

  useEffect(() => {
    fetch("/api/deploy/status")
      .then((r) => r.json())
      .then((data) => setStatus(data as DeployStatus))
      .catch(() => setStatus({ github: false, vercel: false }));
  }, []);

  return status;
}
