import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

interface ModalProps {
  isLoading: boolean;
  isConfirmingDeleteUsers: boolean;
  isErrorOnDelete: boolean;
  isDeletingUsersModalOpen: boolean;
  usersLength: number;
  handleCloseDeletingUsersModal: () => void;
  setIsConfirmingDeleteUsers: (x: boolean) => void;
  handleDeleteUser: (userId: string) => void;
  userId: string;
}

export function DeletingUsersModal({
  isLoading,
  isConfirmingDeleteUsers,
  isErrorOnDelete,
  isDeletingUsersModalOpen,
  usersLength,
  handleCloseDeletingUsersModal,
  setIsConfirmingDeleteUsers,
  handleDeleteUser,
  userId,
}: ModalProps) {
  const route = useRouter();

  return (
    <Modal
      isOpen={isDeletingUsersModalOpen}
      onClose={() => handleCloseDeletingUsersModal()}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent alignItems="center" justifyContent="center" bg="gray.600">
        {isErrorOnDelete ? (
          <ModalHeader color="red" textAlign="center">
            Erro!
          </ModalHeader>
        ) : (
          isConfirmingDeleteUsers && (
            <ModalHeader textAlign="center">
              {usersLength < 2
                ? "Tem certeza que quer deletar o usuário?"
                : `Tem certeza que quer deletar ${usersLength} usuários?`}
            </ModalHeader>
          )
        )}
        {!isConfirmingDeleteUsers &&
          isLoading &&
          (usersLength < 2 ? (
            <ModalHeader>Deletando usuário...</ModalHeader>
          ) : (
            <ModalHeader>Deletando usuários...</ModalHeader>
          ))}
        {!isErrorOnDelete && !isConfirmingDeleteUsers && !isLoading && (
          <ModalHeader color="#00FF00	" textAlign="center">
            Sucesso!
          </ModalHeader>
        )}
        {isErrorOnDelete ? (
          <ModalBody textAlign="center">
            Ocorreu um erro ao deletar o usuário.
          </ModalBody>
        ) : (
          <ModalBody textAlign="center">
            {isConfirmingDeleteUsers && ""}
            {!isConfirmingDeleteUsers &&
              !isLoading &&
              (usersLength < 2 ? "Usuário deletado." : "Usuários deletados.")}
          </ModalBody>
        )}

        <ModalFooter justifyContent="center">
          {isConfirmingDeleteUsers ? (
            <>
              <HStack spacing="8">
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteUser(userId)}
                  minW="100px"
                >
                  Sim
                </Button>

                <Button
                  colorScheme="red"
                  onClick={() => {
                    handleCloseDeletingUsersModal();
                    setIsConfirmingDeleteUsers(true);
                  }}
                  minW="100px"
                >
                  Não
                </Button>
              </HStack>
            </>
          ) : (
            <Button
              colorScheme="red"
              onClick={() => {
                handleCloseDeletingUsersModal();
                if (userId && !isErrorOnDelete) {
                  route.push("/users");
                }
              }}
              isLoading={isLoading}
            >
              Ok
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
