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


const AddNewBeneficiary = ({navigation}) => {
    
   const [accountNumber,setAccountNumber]=useState(0);
   const [name,setName]=useState("");
   const add=async()=>{
    const value=await AsyncStorage.getItem('accountNumber');
    if(!accountNumber){
        Alert.alert("Please Enter the account Number");
        return;
    }
    if(!name){
        Alert.alert("Please Enter the Name");
        return;
    }
    await axios.post(`${API_URL}/addBeneficiary`,{customerAccountNumber:value,
        benficiaryAccountNumber:accountNumber,
        beneficiaryName:name}).then(res=>{
            console.log(res.status);
            if(res.status==200 ){
                Alert.alert(res.data.message);
                navigation.navigate('BeneficiaryList');
            }
           
        }).catch(err=>{
            console.log(err?.response?.data);
            Alert.alert(err?.response?.data?.message ??"Internal Server Error")})
   }
    return (
       <View>
        <Text>Add New Beneficiary</Text>
       
        <TextInput onChangeText={text => setAccountNumber(text)} value={accountNumber} editable placeholder="Account Number"/>
        <TextInput onChangeText={text => setName(text)} value={name} editable placeholder="Name"/>
       <Button title="Add" onPress={add}/>
       </View> 
     
    );
  };

  export default AddNewBeneficiary;