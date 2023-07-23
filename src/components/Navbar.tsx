import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';

import CustomIcon from './CustomIcon';

const NavBar = ({session}: any) => {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    router.replace('/signin');
  };

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Box display="inline-flex" mr={4}>
            <CustomIcon mr={2} />
            <Typography>Homex</Typography>
          </Box>
          <Box sx={{flexGrow: 1}}>
            <Link href="/dashboard" passHref>
              <Button color="inherit">Home</Button>
            </Link>
            <Link href="/cards" passHref>
              <Button color="inherit">Cards</Button>
            </Link>
            <Link href="/financial_account" passHref>
              <Button color="inherit">Financial Account</Button>
            </Link>
          </Box>
          <Box>
            <Typography variant="body1" component="span" sx={{mr: 2}}>
              {session.customerName}
            </Typography>
            <IconButton color="inherit" onClick={logout}>
              <ExitToAppIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
