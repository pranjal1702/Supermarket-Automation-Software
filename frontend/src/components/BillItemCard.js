import React from 'react'
import '../styles/BillItemCard.css'
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
export default function BillItemCard(props) {
  const val=props.val;
  const onDelete=props.onDelete;
  // console.log(val);
  const handleDeleteOnClick=(e)=>{
    onDelete(val);
    console.log(val);
  }
  return (
    <div>
      <div className="bill-card-item">
        <p className='code-para'>{val.code}</p>
        <p className='name-para'>{
        val.name}</p>
        <p className='price-para'>&#8377; {val.price}</p>
        <p className='qty-para'>{val.qty}</p>
        <p className='total-para'>&#8377; {val.totalPrice}</p>
        <IconButton className='remove-button' onClick={handleDeleteOnClick} >
            <CloseIcon/>
        </IconButton>
        
      </div>
    </div>
  )
}
