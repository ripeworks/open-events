import { useEffect, useState } from "react";
import Auth from "./Auth";

export default function withAuth(Component) {
  return (props) => {
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
      fetch("/api/auth")
        .then((res) => res.json())
        .then((res) => setHasAccess(res.hasAccess))
        .catch(() => {
          setHasAccess(false);
        });
    }, []);

    if (hasAccess === null) {
      return null;
    }

    return hasAccess ? <Component {...props} /> : <Auth />;
  };
}
