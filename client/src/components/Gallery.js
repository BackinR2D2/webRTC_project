import React from 'react';
import { SimpleGrid, Box, Button, useDisclosure, Modal, ModalBody, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalFooter } from "@chakra-ui/react";

function Gallery({images}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
        <Button onClick={onOpen}>Open Gallery</Button>
        <Modal
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="scale"
        size="full"
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Gallery</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <SimpleGrid columns={4} spacing="20px">
                    {
                        images.map(({imageSrc}, i) => (
                        <Box className="img" key={i}>
                            <a href={imageSrc} download="image.jpeg">
                            <img alt="userImg" src={imageSrc} />
                            </a>
                        </Box>
                        ))
                    }
                </SimpleGrid>
            </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        {/* <ScaleFade initialScale={0.9} in={isOpen}>
            <Box
            p="40px"
            color="white"
            mt="4"
            bg="teal.500"
            rounded="md"
            shadow="md"
            >
                <SimpleGrid columns={4} spacing="20px">
                {
                    images.map(({imageSrc}, i) => (
                    <Box className="img" key={i}>
                        <a href={imageSrc} download="image.jpeg">
                        <img alt="userImg" src={imageSrc} />
                        </a>
                    </Box>
                    ))
                }
                </SimpleGrid>
            </Box>
        </ScaleFade> */}
        </>
    )
}

export default Gallery
