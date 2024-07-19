import {React,useEffect,useState} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useSnackbar } from './SnackbarContext';
import '../styles/GetStatsModal.css'
import { PieChart } from '@mui/x-charts/PieChart';



export default function GetStatsModal({props}) {
    const {showSnackbar}=useSnackbar();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height:'60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex', 
        flexDirection: 'column',
        overflow:'auto'
      };

  
      const [startDate,setStartDate]=useState(null);
      const [endDate,setEndDate]=useState(null);


      const [showStats,setShowStats]=useState(false);
      const [unitSold,setUnitSold]=useState(0);
      const [value,setValue]=useState(0);
      const [totalUnitSold,setTotalUnitSold]=useState(0);
      const [totalValue,setTotalValue]=useState(0);

      const showStatsHandler=async()=>{
        console.log(startDate);
        console.log(endDate);
        
        if(startDate==null||endDate==null){
          showSnackbar("Enter Valid date","warning");
          return;
        }
        try{
          const token=localStorage.getItem("token");
            const res=await axios.get("http://localhost:8000/product/get-stats-code",{
              params:{
                code:props.code,
                startDate:startDate,
                endDate:endDate
              }, 
              headers:{
                'Authorization': `Bearer ${token}`
              }
            }
            );
            const totalRes=await axios.get("http://localhost:8000/product/get-total-stats",{
              params:{
                startDate:startDate,
                endDate:endDate
              },
              headers:{
                'Authorization': `Bearer ${token}`
              }
            });
            // console.log(res.data);
            setUnitSold(res.data.unitSold);
            setValue(res.data.value);
            // console.log(totalRes.data);
            setTotalUnitSold(parseInt(totalRes.data.totalUnitSold));
            setTotalValue(parseInt(totalRes.data.totalValue));
        }catch(err){
          console.log(err.response);
          showSnackbar("Enter Valid date","error");
          return;
        }
        
        

        console.log(value);
        console.log(totalValue);
        
        setShowStats(true);
      }

      const [stockLeft,setStockLeft]=useState(0);
      useEffect(() => {
        const fetchData = async () => {
          try {
            const token=localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/product/get-itemByCode", {
              params: {
                code: props.code
              },
              headers:{
                'Authorization': `Bearer ${token}`
              }
            });
            setStockLeft(res.data.quantity);
          } catch (error) {
            // Handle the error here
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [props.code]);   

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h5" component="h2" style={{ color: '#2E5C8A',margin:'10px'}}>
        Statistics
      </Typography>
    <div className="heading">
      <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px'}}>
        Code:{ props.code}
      </Typography>
      <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px'}}>
        Item Name:{ props.name}
      </Typography>
    </div>
      <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px',color:'#000'}}>
          Stock Left:{stockLeft}
        </Typography>
   

    <div className='date-box'>
      <label for="start_date">Start Date:</label>
      <input type="date" id="start_date" name="start_date"
      onChange={(e)=>setStartDate(e.target.value)} 
      className="date-input"/>

      <label for="end_date">End Date:</label>
      <input type="date" id="end_date" name="end_date" 
      onChange={(e)=>setEndDate(e.target.value)} 
      className="date-input"/>

        <button 
          style={{fontSize:'20px',borderRadius:'5px',backgroundColor:'#2E5C8A',color:'white',cursor:'pointer'}}
          onClick={showStatsHandler}
          >Get Stats 
        </button>

    </div>
    
    
    {
      showStats?(
      <div className='stats-box'>
        <div className="text-stats">
          <Typography id="modal-modal-title" variant="h6" component="h2" style= {{marginTop:'1px',marginLeft:'10px'}}>
            Units Sold :{unitSold}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'1px',marginLeft:'10px'}}>
            Revenue Generated : &#8377;{value}  
          </Typography>
        </div>
        <div className='pie-chart-box'>

          <div className="pie-chart">
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: unitSold, label: 'Our Item' },
                    { id: 1, value: (totalUnitSold - unitSold), label: 'Others' },
                  ],
                },
              ]}
              width={300}
              height={150}
            />
            <Typography variant="h6" component="h2" style={{ color: '#2E5C8A', margin:'10px',marginLeft:'50px' }}>
            Units Sold
            </Typography>
          </div>

          <div className="pie-chart">
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: value, label: 'Our Item' },
                    { id: 1, value: (totalValue - value), label: 'Others' },
                  ],
                },
              ]}
              width={300}
              height={150}
            />

            <Typography variant="h6" component="h2" style={{ color: '#2E5C8A', margin:'10px',marginLeft:'50px'}}>
            Revenue
            </Typography>
          </div>

        </div>
      </div>
      ):<h3 style={{marginLeft:'10px',color:'red'}}>Select Date range to get stats</h3>     

  
    }

    
    
  </Box>
  )
}
