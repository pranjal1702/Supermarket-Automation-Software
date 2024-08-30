import React from 'react'
import dummyImage from '../images/uploadImg.jpg'
import ItemCard from './ItemCard'
import '../styles/AllItems.css'
import { useState ,useEffect} from 'react'
import axios from 'axios'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useSnackbar } from './SnackbarContext'
import { useNavigate } from 'react-router-dom'
import { BASEURL } from './config'



export default function AllItems() {

  const navigate=useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      navigate('/login');
    }
    if(localStorage.getItem('user')!=null){
      const isManager=JSON.parse(localStorage.getItem('user')).isManager;
      if(!isManager) navigate('/login');
    }
  },[localStorage.getItem('token')]);

  // global snackbar
  const { showSnackbar } =useSnackbar();


  const [allItems,setAllItem]=useState([]);


  // for popup
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // #2E5C8A
  
  

  const [searchText,setSearchText]=useState("");
  useEffect( ()=>{

    const fetchAndStoreData=async ()=>{
      try{
        const getItemsURL=BASEURL+"product/get-items";
        const token=localStorage.getItem("token");
        console.log(searchText);
        const items=await axios.get(getItemsURL,{ 
          params: { txt: searchText },
          headers:{
            'Authorization': `Bearer ${token}`
          }
        });
        
         setAllItem(items.data);
        // console.log(items.data);
        // console.log(allItems);
      }catch(err){
        console.log(err);
      }
    }

    fetchAndStoreData();
   
  },[searchText]);

  const [image,setImage]=useState("");

  const onChangeHandeller=(e)=>{
    // convert it to base 64
    // console.log(e);
    try{
        let reader=new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload=()=>{
            // console.log(reader.result); // base64 encoded
            setImage(reader.result);
        }
        reader.onerror=(error)=>{
            console.log("Error "+error);
        }
    }catch(err){
        setImage("");
        console.log(err);
    }
    
  }

  


  // function for adding new Item to database

  const [newItemName,setNewItemName]=useState("");
  const [newItemCode,setNewItemCode]=useState("");
  const [newItemprice,setNewItemPrice]=useState("");

  const submitNewItem=async ()=>{
    if(newItemName==""||newItemCode==""||newItemprice==""||image==""){
      showSnackbar("Data not provided", "warning");
      return;
    }
    if(parseInt(newItemCode)<=0||parseInt(newItemprice)<=0){
      showSnackbar("Invalid Input", "warning");
      return;
    }
    try{
      const addItemURL= BASEURL+"product/add-item";
      const token=localStorage.getItem("token");
      const res=await axios.post(addItemURL,
      {
        name:newItemName,
        code:parseInt(newItemCode) ,
        unitPrice:parseInt(newItemprice),
        imageSrc:image
      },
      {
        headers:{
          'Authorization': `Bearer ${token}`
        }
      }
      )
      // console.log(res.data);
      // console.log(res.status);
      if(res.status==200){
        showSnackbar("Item added successfully","success");
        setOpen(false);
      }else{
        alert("Some error occurred");
      }
    }catch(err){
      if(err.response.status==409){
        showSnackbar(err.response.data.msg,"warning");
      }else {
        showSnackbar("some error occurred","error");

      }
    }
  }
  

 


  return (
    <div>

      <div className="search-box" onChange={(e)=>{
        setSearchText(e.target.value);
      }} >
        <button 
        className='bill-btn'
        onClick={handleOpen}
        >Add new Item</button>
        <input type="text" className='right-item' placeholder='Search box' />
      </div>

      {/* All items */}
      <div className='all-items'>
      {
        allItems.map((item,index)=>{
          return <ItemCard name={item.name} imageSrc={item.imageSrc} unitPrice={item.unitPrice} code={item.code} key={index} />
        })
      }
       
      </div>



      {/* Modal for adding new item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: '#2E5C8A',margin:'10px'}}>
            Add New Item
          </Typography>
          <TextField id="outlined-basic" label="Name" variant="outlined" style={{margin:'10px'}}  onChange={(e)=>{setNewItemName(e.target.value)}} />
          <TextField id="outlined-basic" label="Code" variant="outlined" style={{margin:'10px'}} type='number'  onChange={(e)=>{setNewItemCode(e.target.value)}} />
          <TextField 
          id="outlined-basic" 
          label="Unit Price" 
          variant="outlined" 
          style={{margin:'10px'}} 
          type='number'
          onChange={(e)=>{setNewItemPrice(e.target.value)}}
           />
          
         
          <label for='fileInput' style={{marginLeft:'10px'}}>
            Choose a image file
          </label>

          <input type="file" accept='image/*' onChange={onChangeHandeller} id='fileInput' style={{marginLeft:'10px'}} />

          <button 
          style={{margin:'10px',fontSize:'25px',borderRadius:'5px',backgroundColor:'#2E5C8A',color:'white',cursor:'pointer'}}
          onClick={submitNewItem}
          >Submit</button>          
        </Box>
      </Modal>
    </div>
  )
}
