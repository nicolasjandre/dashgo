import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationItem({
  isCurrent = false,
  number,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="red"
        _disabled={{ bg: "red.500", cursor: "default" }}
        isDisabled
      >
        {number}
      </Button>
    );
  }
  return (
    <Button
      onClick={() => onPageChange(number)}
      size="sm"
      fontSize="xs"
      width="4"
      bg="gray.700"
      _hover={{ bg: "gray.500" }}
    >
      {number}
    </Button>
  );
}
