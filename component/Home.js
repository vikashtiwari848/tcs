import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useEffect, useState } from "react";

import {
  View,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Platform,
  Alert
} from "react-native";


const HomeScreen = ({navigation}) => {
   const logOut=async()=>{
    try {
        await AsyncStorage.removeItem('accountNumber').then(()=>{
            navigation.replace("Login")
        })
    }
    catch(exception) {
        console.log(exception)
    }
   }
  
    return (
       <View style={styles.container}>
        <Text style={styles.header}>Welcome to SBI</Text>
        <Button
        title="Transfer Money"
        onPress={() =>
          navigation.navigate('BeneficiaryList')
        }
      />
      <Button
        title="Log Out"
        onPress={logOut}
      />
       
       
       </View> 
     
    );
  };

  const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"space-between"
    },
    header: {
      marginTop: 50,
      marginBottom:30,
      marginLeft:80,
      fontWeight: 'bold',
      fontSize: 30,
    }
 
  });
  export default HomeScreen;