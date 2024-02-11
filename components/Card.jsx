    import React from 'react';
    import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

    const Card = ({ title, onPress, onDelete }) => {
        return (
            <TouchableOpacity style={styles.card} onPress={onPress}>
                <View style={styles.cardContent}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const styles = StyleSheet.create({
        card: {
            backgroundColor: '#ffffff',
            padding: 16,
            margin: 8,
            borderRadius: 8,
            elevation: 3,
        },
        cardContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        deleteButton: {
            padding: 5,
            backgroundColor: 'lightcoral',
            borderRadius: 5,
        },
        deleteButtonText: {
            color: 'white',
        }
    });

    export default Card;