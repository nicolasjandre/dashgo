import { Flex, IconButton, useBreakpointValue, Icon } from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";
import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext";

import { Logo } from "./Logo";
import { NotificationsNav } from "./NotificationsNav";
import { Profile } from "./Profile";
import { SearchBox } from "./SearchBox";

import styles from './styles.module.scss'

export function Header() {
  const { onOpen } = useSidebarDrawer()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  return (
    <Flex w="100%" as="header" maxW={1480} h="20" mx="auto" mt="4" px={["2", '6']} align="center">
      
      {!isWideVersion && (
        <IconButton display={['flex', 'flex', 'flex', 'none']} icon={<Icon as={RiMenuLine} />} fontSize={['20', '24']} variant='unstyled' onClick={onOpen} aria-label='Open navigation' mr='2' />
      )}
      <Logo />
      {isWideVersion && <SearchBox />}

      <Flex ml="auto" align="center">
        
        <NotificationsNav />
        <Profile showProfileData={isWideVersion} />
        
      </Flex>
    </Flex>
  );
}
