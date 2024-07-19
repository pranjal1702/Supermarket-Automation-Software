import React from 'react'
import { useState,useEffect } from 'react'
import '../styles/imageUpload.css'
import previewImg from '../images/uploadImg.jpg'
export default function ImageUpload() {
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
  return (
    <div>
        <div className="image-container">
            
            {image==null||image==""?<img src={previewImg} className='preview-img'></img>:<img src={image} className='preview-img'></img>}
            <br></br>
            <input type="file" accept='image/*' onChange={onChangeHandeller}  />
      </div>
    </div>
  )
}
