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
import { SubmitHandler } from "react-hook-form";

interface User {
  name: string;
  id?: string;
  email?: string;
  sex: string;
  profession: string;
}

interface EditUser extends User {
  user: User;
}

interface ModalProps {
  isLoading: boolean;
  isConfirmingEditUser: boolean;
  isErrorOnEdit: boolean;
  isEditingUserModalOpen: boolean;
  handleCloseEditingUsersModal: () => void;
  setIsConfirmingEditUser: (x: boolean) => void;
  handleEditUser: SubmitHandler<any>;
  data: EditUser | null;
}

export function EditingUsersModal({
  isLoading,
  isConfirmingEditUser,
  isErrorOnEdit,
  isEditingUserModalOpen,
  handleCloseEditingUsersModal,
  setIsConfirmingEditUser,
  handleEditUser,
  data,
}: ModalProps) {
  const route = useRouter();

  return (
    <Modal
      isOpen={isEditingUserModalOpen}
      onClose={() => handleCloseEditingUsersModal()}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent alignItems="center" justifyContent="center" bg="gray.600">
        {isErrorOnEdit ? (
          <ModalHeader color="red" textAlign="center">
            Erro!
          </ModalHeader>
        ) : (
          data &&
          isConfirmingEditUser && (
            <ModalHeader textAlign="center">
              Deseja confirmar a edição?
            </ModalHeader>
          )
        )}
        {!data && (
          <ModalHeader color="red" textAlign="center">
            Oops...
          </ModalHeader>
        )}
        {data && !isConfirmingEditUser && isLoading && (
          <ModalHeader>Editando usuário...</ModalHeader>
        )}
        {data && !isErrorOnEdit && !isConfirmingEditUser && !isLoading && (
          <ModalHeader color="#00FF00	" textAlign="center">
            Sucesso!
          </ModalHeader>
        )}
        {!data && (
          <ModalBody textAlign="center">
            Você não alterou nenhum campo.
          </ModalBody>
        )}
        {data && isErrorOnEdit ? (
          <ModalBody textAlign="center">
            Ocorreu um erro ao editar o usuário.
          </ModalBody>
        ) : (
          <ModalBody textAlign="center">
            {data && isConfirmingEditUser && ""}
            {data && !isConfirmingEditUser && !isLoading && "Usuário editado."}
          </ModalBody>
        )}

        <ModalFooter justifyContent="center">
          {data && isConfirmingEditUser ? (
            <>
              <HStack spacing="8">
                <Button
                  colorScheme="red"
                  onClick={() => handleEditUser(data)}
                  minW="100px"
                >
                  Sim
                </Button>

                <Button
                  colorScheme="red"
                  onClick={() => {
                    handleCloseEditingUsersModal();
                    setIsConfirmingEditUser(true);
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
                handleCloseEditingUsersModal();
                if (data && !isErrorOnEdit) {
                  route.asPath.includes("profile")
                    ? route.push("/profile")
                    : route.push("/users");
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
