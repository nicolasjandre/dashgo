import { Box, Stack, HStack, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0);
}

export function Pagination({
  totalCountOfRegisters,
  registersPerPage = 10,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage!);

  const previousPage =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : [];

  return (
    <Stack
      direction={["column", "row"]}
      mt="8"
      justify="space-between"
      align="center"
      spacing="6"
    >
      <Box>
        {currentPage === 1 ? (
          <strong>{`1 - 10 de ${totalCountOfRegisters}`}</strong>
        ) : currentPage === lastPage ? (
          <strong>{`${
            currentPage * registersPerPage > totalCountOfRegisters
              ? currentPage * registersPerPage -
                registersPerPage +
                1 +
                " " +
                "-" +
                " " +
                totalCountOfRegisters +
                " de " +
                totalCountOfRegisters
              : ""
          }`}</strong>
        ) : (
          <strong>{`${
            currentPage * registersPerPage - registersPerPage + 1
          } - ${
            currentPage * registersPerPage
          } de ${totalCountOfRegisters}`}</strong>
        )}
      </Box>
      <HStack spacing="2">
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem onPageChange={onPageChange} number={1} />
            {currentPage > 2 + siblingsCount && (
              <Text
                opacity={0.5}
                color="gray"
                w="8"
                h="8"
                textAlign="center"
                border="1px solid"
                borderColor="gray.500"
                borderRadius={6}
              >
                ...
              </Text>
            )}
          </>
        )}

        {previousPage.length > 0 &&
          previousPage.map((page) => {
            return (
              <PaginationItem
                onPageChange={onPageChange}
                key={page}
                number={page}
              />
            );
          })}

        <PaginationItem
          onPageChange={onPageChange}
          number={currentPage}
          isCurrent
        />

        {nextPages.length > 0 &&
          nextPages.map((page) => {
            return (
              <PaginationItem
                onPageChange={onPageChange}
                key={page}
                number={page}
              />
            );
          })}

        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <Text
                opacity={0.5}
                color="gray"
                w="8"
                h="8"
                textAlign="center"
                border="1px solid"
                borderColor="gray.500"
                borderRadius={6}
              >
                ...
              </Text>
            )}
            <PaginationItem onPageChange={onPageChange} number={lastPage} />
          </>
        )}
      </HStack>
    </Stack>
  );
}
