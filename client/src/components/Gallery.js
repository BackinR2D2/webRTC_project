import React from 'react';
import { SimpleGrid, Box, Button, useDisclosure, Modal, ModalBody, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalFooter } from "@chakra-ui/react";

function Gallery({images}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    console.log(images);
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
                <SimpleGrid columns={4} spacing="4em" className="galleryPhotos">
                    {
                        images.map((imageSrc, i) => (
                            <Box className="img" key={i}>
                                {console.log(imageSrc)}
                                <a href={imageSrc} download="image.jpeg">
                                    <img alt="userImg" src={imageSrc} style={{margin: `${0} auto`}} />
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
        </>
    )
}

export default Gallery
