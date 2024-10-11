import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import ConfirmationModal from '../elements/alert';

const DropdownMenu = ({ isMenuVisible, handleMenuToggle, handleEditMessage, handleDeleteMessage }) => {
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

    const handleDeleteConfirmation = () => {
        setIsConfirmationVisible(true);
    };

    const handleConfirmDelete = () => {
        handleDeleteMessage();
        setIsConfirmationVisible(false);
        handleMenuToggle(); 
    };

    const handleCancelDelete = () => {
        setIsConfirmationVisible(false);
    };

    return (
        <Modal
            animationType='slide'
            transparent
            visible={isMenuVisible}
            onRequestClose={handleMenuToggle}
        >
            <TouchableOpacity
                style={styles.absoluteBlur}
                activeOpacity={1}
                onPress={handleMenuToggle}
            >
                <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <TouchableOpacity
                            onPress={handleEditMessage}
                            style={styles.optionButton}
                        >
                            <Text style={styles.option}>Edit Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDeleteConfirmation}
                            style={[styles.optionButton, styles.marginTop]}
                        >
                            <Text style={styles.option}>Delete Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleMenuToggle}>
                            <Text style={styles.close}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>

            <ConfirmationModal
                visible={isConfirmationVisible}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                message="Are you sure you want to delete this message?"
                confirm="Delete"
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    absoluteBlur: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        borderRadius: 10,
        padding: 20,
        width: 250,
    },
    modalContent: {
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 10,
    },
    optionButton: {
        padding: 10,
    },
    marginTop: {
        marginTop: 10,
    },
    option: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    close: {
        color: 'tomato',
        fontSize: 16,
        paddingVertical: 10,
    },
});

export default DropdownMenu;
