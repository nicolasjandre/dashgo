import { Box } from "@chakra-ui/react";
import { DrawerSidebar } from "./DrawerSidebar";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  return (
    <Box display={["none", "none", "none", "flex"]} as="aside" w="64" mr="8">
      <SidebarNav />
      <DrawerSidebar />
    </Box>
  );
}
