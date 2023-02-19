import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      { showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Nicolas Jandre</Text>
          <Text color="gray.300" fontSize="small">
            nicolasjandre@.live.com
          </Text>
        </Box>
      )}

      <Avatar size={['sm', 'md']} name="Nicolas Jandre" src="https://www.github.com/nicolasjandre.png" />
    </Flex>
  )
}