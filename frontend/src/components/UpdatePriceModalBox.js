import {React,useState} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useSnackbar } from './SnackbarContext';
import { BASEURL } from './config';

export default function UpdatePriceModalBox({props}) {
    const {showSnackbar}=useSnackbar();
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
      const [newPrice,setNewPrice]=useState(props.unitPrice);

      const updateHandler=async ()=>{
        if(newPrice==null){
          showSnackbar("Required data not provided","warning");
          return;
        }
        if(parseInt(newPrice)<=0){
          showSnackbar("Please enter Valid Price","warning");
          return;
        }
        try{
          const token=localStorage.getItem("token");
          const updatePriceURL=BASEURL+"product/update-price";
          const res=await axios.post(updatePriceURL,{
            code:props.code,
            newPrice:newPrice
          },{
            headers:{
              'Authorization': `Bearer ${token}`
            }
          });
          showSnackbar("Price updated Successfully","success");
        }catch(err){
          showSnackbar("Some error occurred","error");
        }
      }

  return (
    <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: '#2E5C8A',margin:'10px'}}>
      Update Price
    </Typography>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px'}}>
      Code:{ props.code}
    </Typography>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px'}}>
       Item Name:{ props.name}
    </Typography>
    
    <TextField 
    id="outlined-basic" 
    label="New Price" 
    variant="outlined" 
    style={{margin:'10px'}} 
    type='number'
    placeholder={props.unitPrice}
    onChange={(e)=>{setNewPrice(e.target.value)}}
     />
    

    <button 
    style={{margin:'10px',fontSize:'25px',borderRadius:'5px',backgroundColor:'#2E5C8A',color:'white',cursor:'pointer'}}
    onClick={updateHandler}
    >Update 
    </button>
    
  </Box>
  )
}
