import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, FlatList } from 'react-native';
import { doc, onSnapshot, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../firebase/config';
import { getUserById } from '../firebase/getUser';

export default function FriendRequestModal({ visible, onClose }) {
    const [friendRequests, setFriendRequests] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        if (visible) {
            const currentUserId = FIREBASE_AUTH.currentUser.uid;
            const userDocRef = doc(db, 'users', currentUserId);

            // Fetching the friend requests received
            const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const requests = data.friendRequestsReceived || [];
                    setFriendRequests(requests);

                    // Fetch user details for each request
                    const details = {};
                    for (const requestId of requests) {
                        const userData = await getUserById(requestId);
                        details[requestId] = userData;
                    }
                    setUserDetails(details);
                }
            });

            return () => unsubscribe();
        }
    }, [visible]);

    const handleAcceptRequest = async (requestId) => {
        const currentUserId = FIREBASE_AUTH.currentUser.uid;
        const userDocRef = doc(db, 'users', currentUserId);
        const targetUserDocRef = doc(db, 'users', requestId);

        // Accept the request
        await updateDoc(userDocRef, {
            friends: arrayUnion(requestId),
            friendRequestsReceived: arrayRemove(requestId),
        });
        await updateDoc(targetUserDocRef, {
            friends: arrayUnion(currentUserId),
            friendRequestsSent: arrayRemove(currentUserId),
        });

        // Close modal after accepting
        onClose();
    };

    const handleDeclineRequest = async (requestId) => {
        const currentUserId = FIREBASE_AUTH.currentUser.uid;
        const userDocRef = doc(db, 'users', currentUserId);
        const targetUserDocRef = doc(db, 'users', requestId);

        // Decline the request
        await updateDoc(userDocRef, {
            friendRequestsReceived: arrayRemove(requestId),
        });
        await updateDoc(targetUserDocRef, {
            friendRequestsSent: arrayRemove(currentUserId),
        });

        // Close modal after declining
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Friend Requests</Text>
                    <FlatList
                        data={friendRequests}
                        keyExtractor={(item) => item}
                        renderItem={({ item: requestId }) => (
                            <View key={requestId} style={styles.requestItem}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: userDetails[requestId]?.profileImage || 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0' }}
                                        style={styles.profileImage}
                                    />
                                    <View style={styles.requestInfo}>
                                        <Text style={styles.requestText}>{userDetails[requestId]?.username || 'Unknown'}</Text>
                                    </View>
                                </View>
                                <View style={styles.requestActions}>
                                    <TouchableOpacity
                                        style={styles.declineButton}
                                        onPress={() => handleDeclineRequest(requestId)}
                                    >
                                        <Text style={styles.requestButtonText}>Decline</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.acceptButton}
                                        onPress={() => handleAcceptRequest(requestId)}
                                    >
                                        <Text style={styles.requestButtonText}>Accept</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.noRequestsText}>No new friend requests.</Text>}
                    />
                    <TouchableOpacity onPress={onClose} style={styles.closeModalButton}>
                        <Text style={styles.closeModalButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker semi-transparent background
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '110%',
        maxHeight: '80%',
        backgroundColor: '#121212',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    requestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingBottom: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        marginRight: 5,
        borderRadius: 30,
    },
    requestInfo: {
        left:5,
        flex: 1,
    },
    requestText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },
    requestActions: {
        position: 'absolute',
        right: 10,
        top: 10,
        flexDirection: 'row',
    },
    acceptButton: {
        alignSelf: 'center',
        backgroundColor: 'tomato',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    declineButton: {
        marginRight: 10,
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    requestButtonText: {
        color: 'white',
        fontSize: 12,
    },
    noRequestsText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
    },
    closeModalButton: {
        marginTop: 20,
        backgroundColor: '#555',
        paddingVertical: 12,
        borderRadius: 8,
    },
    closeModalButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
});
