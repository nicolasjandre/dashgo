import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
}

export function ActiveLink({ children, ...rest }: ActiveLinkProps) {
  let { asPath } = useRouter();
  let isActive = false;

  if (asPath.includes(String(rest.href))) isActive = true;

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: isActive ? "red.500" : "white",
      })}
    </Link>
  );
}
