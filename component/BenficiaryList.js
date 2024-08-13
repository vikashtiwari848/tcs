import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

import {
  View,
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Platform,
  FlatList,
  Alert
} from "react-native";
import axios from "axios";
import { API_URL } from "../Api";


const BeneficiaryList = ({navigation}) => {

    const [list,setList]=useState([]);
    const [user,setUser]=useState(null);
    const [amount,setAmount]=useState(0);
    const fetchList=async()=>{
        const value=await AsyncStorage.getItem('accountNumber');
        console.log(value+"value");
        axios.get(`${API_URL}/getBeneficiary/${JSON.parse(value)}`).then(res=>setList(res.data.result)).catch(err=>console.log(err))

      
    }
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const handleClick=(item)=>{
     setUser(item);
     setModalVisible(true);
    }

    const sendMoney=async()=>{
      
         let value=await AsyncStorage.getItem('accountNumber');
        value=JSON.parse(value);
        await axios.post(`${API_URL}/sendMoney`,{accountNumber:value,
                amount:amount,
                beneficiaryAccountNumber:user?.beneficiaryAccountNumber}).then(res=>{
                    Alert.alert(res.data.message);
                    console.log("success",res.data.message)
                    setAmount(0);
                    toggleModal();
                }).catch(err=>{
                  
                    Alert.alert(err?.response?.data?.message ??"Internal Server Error")
                    toggleModal();
                    console.log("error");
                    console.log(err)})
    }

    const Item = ({item}) => {
        return( 
          <View style={styles.item} >
            <Text style={styles.itemText}>{item.beneficiaryName}</Text>
            <Text  style={styles.itemText}>{item.beneficiaryAccountNumber}</Text>
            <Button title="Send Money" onPress={()=>handleClick(item)} />
          </View>
        );
      }

    const renderItem = ({item})=>( 
        <Item item={item}/>
      );

   useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      
        fetchList();
      });
  
     
      return unsubscribe;
   
   },[navigation])
console.log(user?.beneficiaryName+"user")
    return (
       <SafeAreaView>
        <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <Text>Send Money to {user?.beneficiaryName} Account Number {user?.beneficiaryAccountNumber}</Text>
         
          <TextInput onChangeText={text => setAmount(text)} value={amount} editable placeholder="Enter the amount"/>
          <Button title="Send" onPress={sendMoney} />
         
          <Button title="Cancel" onPress={toggleModal} />
        </View>
      </Modal>

    
       
        <View style={styles.container}>
      <FlatList
       data={list}
       renderItem={renderItem}
       keyExtractor={item => item.beneficiaryAccountNumber}
    />
  </View>
  <Button style={styles.addButton} title="Add New Beneficiary" onPress={()=>navigation.navigate('AddNewBeneficiary')}/>
 </SafeAreaView> 
     
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginTop:30,
      padding:2,
    },
    modal: {
        backgroundColor:"white",
        marginTop:30,
        justifyContent:"space-between",
        padding:19,
        height:"40%"
      },
    item: {
      backgroundColor: '#f5f520',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16
    },
    itemText:{
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft:"40%"
    },
    addButton: {
        marginBottom:30,
        padding:2,
      },
  });

  export default BeneficiaryList;