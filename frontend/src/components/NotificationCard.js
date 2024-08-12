import axios from "axios";

const { Box, Button } = require("@mui/material")

export default function NotificationCard(props){
    const {notification} = props;
    const onReadClick=async()=>{
        // console.log(props);
        try{
            const token=localStorage.getItem("token");
            const res=await axios.post("http://localhost:8000/notification/change-notification-status",{
              id:notification._id,
            },{
              headers:{
                'Authorization': `Bearer ${token}`
              }
            });
            console.log(props._id);
            if(res.status==200){
            //   showSnackbar("Updated successfully","success");
            //   console.log("Updated successfully");
            console.log(res.data);
            }else{
              console.log("Some error occurred");
            }
          }catch(err){
            console.log("Some error occurred"+err);
          }
    }
    return (
        <div style={{width:'96%',marginLeft:'2%',marginTop:'5px',boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', padding:'4px', borderRadius:'5px'}}>
            <p style={{ whiteSpace: 'pre-line' }}>
                {notification&&notification.message}
            </p>
            {notification.seen||<Button onClick={onReadClick}>Read</Button>}
        </div>
    )
}