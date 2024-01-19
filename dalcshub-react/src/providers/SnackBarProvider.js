//Author: Shiwen(Lareina) Yang
import { createContext, useState, useContext, useMemo, useCallback, forwardRef } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

const SnackbarContext = createContext();

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

  
export function SnackbarProvider({ children }) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    // Can be "success", "error", "warning", "info"
    const [snackbarType, setSnackbarType] = useState('success'); 

    const openSnackbar = useCallback ( 
        (message, type = 'success') => {
            setSnackbarOpen(true);
            setSnackbarMessage(message);
            setSnackbarType(type);
        }, []
      );

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const SnackbarContextValue = useMemo(
        () => ({ openSnackbar }), [openSnackbar]
    );

    return (
        <SnackbarContext.Provider value={SnackbarContextValue}>
            <Snackbar 
                anchorOrigin={{
                    vertical: "top", 
                    horizontal: "right"
                }}
                open={snackbarOpen} 
                autoHideDuration={2000} 
                onClose={closeSnackbar}
            >
                <Alert onClose={closeSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {children}
        </SnackbarContext.Provider>
    );
}
