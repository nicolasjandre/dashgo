import { Box } from "@chakra-ui/react";
import { DrawerSidebar } from "./DrawerSidebar";
import { SidebarNav } from "./SidebarNav";

import styles from '../../pages/styles.module.scss'

export function Sidebar() {
  return (
    <Box className={styles.sidebar} as='aside' w='64' mr='8'>
      <SidebarNav />
      <DrawerSidebar />
    </Box>
  )
}