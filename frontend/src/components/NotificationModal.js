import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Accordion, AccordionSummary, Box, Typography, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationCard from './NotificationCard';
import axios from 'axios';
import { BASEURL } from './config';


const style = {
  position: 'absolute',
  top: '20px',
  left: '75%',
  transform: 'translate(-50%, 0)',
  width: '40%',
  bgcolor: '#FFF',
  border: '2px solid #FFF',
  borderRadius: '5px',
  boxShadow: 24,
  p: 1,
};

const accordianStyle={
  maxHeight: '50vh',
  overflowY: 'auto',
  padding:'0px',
  scrollbarWidth: 'none', // For Firefox
  msOverflowStyle: 'none', // For IE and Edge
}

export default function NotificationModal({openNotification,setOpenNotification}) {

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => setOpenNotification(false);

  const [allNotifications,setAllNotifications]=React.useState([]);
  React.useEffect( ()=>{
    const fetchAndStoreData=async ()=>{
      try{
        const getAllNotificationsURL=BASEURL+"notification/get-all-notifications";
        const token=localStorage.getItem("token");
        const items=await axios.get(getAllNotificationsURL,{ 
          headers:{
            'Authorization': `Bearer ${token}`
          }
        });

        setAllNotifications(items.data);
        console.log(items.data);
      }catch(err){
        console.log(err);
      }
    }

    fetchAndStoreData();

  },[]);


  return (      
      <Modal
        open={openNotification}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>New Notifications</Typography>
        </AccordionSummary>
        <AccordionDetails sx={accordianStyle}>
         {
          allNotifications.filter((notification)=>notification.seen===false).map((notification)=><NotificationCard notification={notification}/>)
         }
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Seen</Typography>
        </AccordionSummary>
        <AccordionDetails sx={accordianStyle}>
       {
           allNotifications.filter((notification)=>notification.seen===true).map((notification)=><NotificationCard notification={notification} />)
       }
        </AccordionDetails>
      </Accordion>
      </Box>
 
      </Modal>
  );
}