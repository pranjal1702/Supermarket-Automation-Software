import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useSnackbar } from './SnackbarContext';
import { BASEURL } from './config';

export default function AddStockModalBox({props}) {
    const { showSnackbar } = useSnackbar();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex', 
        flexDirection: 'column'
      };
      
      const [quantity,setQuantity]=useState(null);
      const addStockHandler=async ()=>{
        if(parseInt(quantity)<=0||parseInt(quantity)>10000){
          showSnackbar("Please enter Valid Quantity","warning");
          return;
        }
        try{
          const url=BASEURL+"product/update-stock";
          const token=localStorage.getItem("token");
          const res=await axios.post(url,{
            name:props.name,
            code:props.code,
            quantity:quantity
          },{
            headers:{
              'Authorization': `Bearer ${token}`
            }
          })
          if(res.status==200){
            showSnackbar("Updated successfully","success");
            console.log("Updated successfully");
          }else{
            console.log("Some error occurred");
          }
        }catch(err){
          console.log("Some error occurred"+err);
        }
      }
  return (
    <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: '#2E5C8A',margin:'10px'}}>
            Add New Stock
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px'}}>
            Code:{props.code}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px'}}>
             Item Name:{props.name}
          </Typography>
          
          <TextField 
          id="outlined-basic" 
          label="Quantinty" 
          variant="outlined" 
          style={{margin:'10px'}} 
          type='number'
          onChange={(e)=>{
            setQuantity(e.target.value);
          }}
           />
          

          <button 
          style={{margin:'10px',fontSize:'25px',borderRadius:'5px',backgroundColor:'#2E5C8A',color:'white',cursor:'pointer'}}
          onClick={addStockHandler}
          >Add 
          </button>
          
        </Box>
  )
}
