import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH,db } from './config';

const useFriends = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = FIREBASE_AUTH.currentUser.uid;
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
            setLoading(true);
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const friendsIds = userData.friends || [];

                if (friendsIds.length > 0) {
                    const friendsQuery = query(
                        collection(db, 'users'),
                        where('uid', 'in', friendsIds)
                    );

                    const querySnapshot = await getDocs(friendsQuery);
                    const friendsData = querySnapshot.docs.map(doc => doc.data());
                    setFriends(friendsData);
                } else {
                    setFriends([]); // No friends
                }
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Clean up listener on unmount
    }, []);

    return { friends, loading };
};

export default useFriends;
