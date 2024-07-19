import './App.css';
import AllItems from './components/AllItems';
import SignInSide from './components/Login';

import MainArea from './components/MainArea';
// import ImageUpload from './components/imageUpload';
import {Routes,Route, Navigate} from 'react-router-dom'
import SignUpSide from './components/SignUp';
import CreateBill from './components/CreateBill';
import { SnackbarProvider } from './components/SnackbarContext';
import { redirect } from "react-router-dom";
import About from './components/About';

function App() {
  return (
    <div>
      {/* <ImageUpload/> */}
      <SnackbarProvider>
        <Routes>
          <Route path='/app' element={<MainArea/>}>
            <Route path='all-items' element={<AllItems/>} />
            <Route path='generate-bill' element={<CreateBill/>} />
            <Route path='about' element={<About/>} />

          </Route>
          <Route path='/login' element={<SignInSide/>} />
          <Route path='/signup' element={<SignUpSide/>} />
          <Route exact path="/" element={<Navigate to="/login" />} />
        </Routes>
      </SnackbarProvider>

    </div>
  );
}

export default App;
