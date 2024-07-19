import React, { useEffect, useState ,useRef} from 'react'
import '../styles/CreateBill.css'
import BillItemCard from './BillItemCard'
import axios from 'axios';
import 'jspdf-autotable';
import { useSnackbar } from './SnackbarContext';
import { useNavigate } from 'react-router-dom';



export default function CreateBill() {
  const navigate=useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      navigate('/login');
    }
    const user=JSON.parse(localStorage.getItem('user'));
    if(user&&user.isManager){
      navigate('/login');
    }
    
  },[]);

  const [billItems,setBillItems]=useState([]);
  const [qty,setQty]=useState(null);
  const [code,setCode]=useState(null);
  const [customerName,setCustomerName]=useState(null);
  const [customerPhone,setCustomerPhone]=useState(null);
  const codeInputRef = useRef(null);
  const qtyInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const {showSnackbar}=useSnackbar();

  const onAddClick=async ()=>{
    if(qty==null||code==null||qty==0) return ;
    if(qty<=0) {
      showSnackbar("Please Enter Valid quantity","warning");
      return;
    }
    // check whether code is valid or not
    try{
      const token=localStorage.getItem("token");
      const res=await axios.get("http://localhost:8000/product/get-itemByCode",{        
        params: { code: code },
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      if(res.status==200){
        const itemsArr=billItems;
        // console.log(res.data);
        const newItem={
          code:res.data.code,
          name:res.data.name,
          price:res.data.unitPrice,
          qty:qty,
          totalPrice:(res.data.unitPrice)*(qty)
        }
        itemsArr.push(newItem);
        setBillItems(itemsArr);
        
        console.log(billItems);
      }else if(res.status==204){
        showSnackbar("Incorrect Code","error");
      }else{
        showSnackbar("Internal server error","error");
      }
      setQty(null);
      setCode(null);
      codeInputRef.current.value='';
      qtyInputRef.current.value='';
    }catch(err){
     return console.log(err);
    }
  }

  const handleDeleteItem = (itemToDelete) => {
    setBillItems(billItems.filter(item => item !== itemToDelete));
  };

  const generatePDF =async () => {
    if(customerName==null||customerPhone==null||billItems.length==0){
      showSnackbar("All details not provided","warning");
      return;
    }
    // 
   
    // Set up columns and rows
    const columns = ["Code", "Name", "Rate", "Quantity", "Total"];
    const rows = billItems.map(item => [item.code, item.name,'&#8377; ' +item.price, item.qty,'&#8377; ' + item.totalPrice]);
  
    // Calculate the total payable amount
    const totalPayable = billItems.reduce((sum, item) => sum + item.totalPrice, 0);



        // we also have to store this trnsaction
        let transactionId;

          try{
            const token=localStorage.getItem("token");
            const res= await axios.post("http://localhost:8000/product/create-transaction",{billItems:billItems,customerName:customerName,customerPhone:customerPhone},{
              headers:{
                'Authorization': `Bearer ${token}`
              }
            });
            // console.log(res.data);
            transactionId=res.data._id;

           }catch(err){
             return console.log(err);
           }
       
           // decrease the qty present
           try{
            const token=localStorage.getItem("token");
            for(let item of billItems){
              const res=await axios.post("http://localhost:8000/product/decrease-quantity",{code:item.code,quantity:item.qty},{
                headers:{
                  'Authorization': `Bearer ${token}`
                }
              });
              // console.log(res.data);
            }
           }catch(err){
            return console.log(err);
           }
          

    // await addTransactionToDb();

    // Create a printable HTML content
    const styleOfPdf=`<style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      border: 1px solid #000;
    }
    th {
      background-color: #0E79B2;
    }
    tr:nth-child(even) {
      background-color: #0E79B2;
    }
    .total-row td {
      background-color: #0E79B2;
      font-weight: bold;
    }
    h1 {
      color: #2E5C8A;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contact-info p {
      margin: 0; /* Remove default margin */
      padding-right: 10px; /* Adjust spacing */
    }
    .customer-details p{
      margin: 0;
      padding-right:10px;
    }
    .thanks{
      margin-left: 40%;
      margin-top:10px;
    }
    .thanks p{
      margin: 0;
      padding-right:10px;
      color: #2E5C8A;
    }
  </style>`;
    
    const printableContent = `
      <p>Bill Details</p>
      <div class='header'>
        <h1>ABC Markets</h1>
        <div class="contact-info">
          <p>Dhanbad Jharkhand</p>
          <p>9795xxxxx</p>
        </div>
      </div>
      <hr/>
      <div class='customer-details'>
        <p>Name: ${customerName}</p>
        <p>Phone number : ${customerPhone}</p>  
        <p>Date : 23-03-2024</p>
      </div>
      <h3>Transaction Id:${transactionId}<h3/>
      <table>
        <thead>
          <tr>
            ${columns.map(column => `<th>${column}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          <tr class="total-row"><td colspan="4">Total Payable:</td><td>&#8377; ${totalPayable.toFixed(2)}</td></tr>
        </tbody>
      </table>
      <div class='thanks'>
        <p >Thanks  :)</p>
        <p>Visit again</p>
      </div>
    `;
  
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  
    // Inject the printable content into the iframe
    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Final Bill</title>
          ${styleOfPdf}
        </head>
        <body>
          ${printableContent}
        </body>
      </html>
    `);
    iframeDocument.close();
  
    // Print the content
    iframe.contentWindow.print();
  
    // Remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000); // Adjust the delay as needed
    setBillItems([]);

    nameInputRef.current.value='';
    phoneInputRef.current.value='';
    setCustomerName(null);
    setCustomerPhone(null);
  };
  

  return (

    
    <div>
      <div className="main-container-create-bill">
        <div className="left-container">
          <div className="add-item">
            <input 
            type='number'
            placeholder='Code'
            ref={codeInputRef} 
            className='bill-input'onChange={(e)=>{
              setCode(e.target.value);
            }} ></input>
            <input
            type='number' 
            placeholder='Quantity' 
            className='bill-input' 
            ref={qtyInputRef} 
            onChange={(e)=>{
              setQty(e.target.value);
            }}></input>
            <button className='add-btn' onClick={onAddClick} >Add</button>
          </div>
          <div className="customer-details">
            <input
            type='text'
            placeholder='customer-name'
            className='customer-details-input'
            ref={nameInputRef}
            onChange={(e)=>{
              setCustomerName(e.target.value);
            }}
            >
            </input>
            <input
            type='number'
            placeholder='Mobile number'
            className='customer-details-input'
            ref={phoneInputRef}
            onChange={(e)=>{
              setCustomerPhone(e.target.value);
            }}
            >
            </input>
          </div>
          <button 
          className='generate-bill'
          onClick={generatePDF}
          >Generate bill</button>
        </div>

        

        <div className="right-container">
          <div className="parameter-para">
            <p className='code-para'>Code</p>
            <p className='name-para'>Name</p>
            <p className='price-para'>Rate</p>
            <p className='qty-para'>Quantity</p>
            <p className='total-para'>Total </p>
          </div>
          

          {
            billItems.map((item,id)=>{
              return <BillItemCard key={id} val={item} onDelete={handleDeleteItem}  />
            })
          }

        </div>
      </div>


    </div>
  )
}
