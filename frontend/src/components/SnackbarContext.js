import React, { createContext, useState, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackText, setSnackText] = useState("");
  const [snackVariant, setSnackVariant] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  const showSnackbar = (text, variant) => {
    setSnackText(text);
    setSnackVariant(variant);
    setOpenSnack(true);
  };

  const closeSnackbar = () => {
    setOpenSnack(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
      <Snackbar
        open={openSnack}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackVariant}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackText}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
