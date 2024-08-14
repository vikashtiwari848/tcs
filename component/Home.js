import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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
import { API_URL } from "../Api";


const HomeScreen = ({navigation}) => {
    const [balance,setBalance]=useState(0);
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

   useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', async() => {
        let value=await AsyncStorage.getItem('accountNumber');
        value=JSON.parse(value);
        await axios.post(`${API_URL}/getBalance`,{accountNumber:value
                }).then(res=>{
                    setBalance(res?.data?.balance??0);
                    console.log("success",res.data)                
                }).catch(err=>{
                  Alert.alert(err?.response?.data?.message ??"Internal Server Error")
                    console.log(err)})
      });
     return unsubscribe;  
   },[navigation])
  
    return (
       <View style={styles.container}>
        <Text style={styles.header}>Welcome to SBI</Text>
        <Text style={styles.balance}>Your Bank Balance {balance}</Text>
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
    },
    balance: {
       
        marginLeft:80,
        fontWeight: 'bold',
        fontSize: 20,
      }
 
  });
  export default HomeScreen;