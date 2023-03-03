import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext";
import { useRealUser } from "../../hooks/useRealUser";
import { SidebarNav } from "./SidebarNav";

export function DrawerSidebar() {
  const { user } = useUser();
  const { data } = useRealUser(user?.email as string);

  const { isOpen, onClose } = useSidebarDrawer();

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent bg="gray.800" p="4">
          <DrawerCloseButton mt="6" />
          <DrawerHeader>
            Navegação
            {data?.user?.needUpdateProfile && (
              <Link href="/profile"><Text pt='2' color="red.400" fontSize="sm">Novo usuário? Edite seu perfil!</Text></Link>
            )}
          </DrawerHeader>

          <DrawerBody>
            <SidebarNav />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
