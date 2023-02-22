import {
  Icon,
  Text,
  LinkProps as ChakraLinkProps,
  Flex,
} from "@chakra-ui/react";
import { ElementType } from "react";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType;
  children: string;
  href: string;
}

export function NavLink({ children, icon, href }: NavLinkProps) {
  return (
    <ActiveLink href={href}>
      <Flex alignItems="center" py="1">
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">
          {children}
        </Text>
      </Flex>
    </ActiveLink>
  );
}
