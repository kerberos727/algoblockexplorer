import './Header.scss';
import {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Grid, Tab, Tabs, Menu, MenuItem,IconButton} from "@mui/material";
import QLogo from '../../../../assets/images/icon.svg';
import { useWindowSize } from '../../../../utils/windowsize';
import MenuIcon from '@mui/icons-material/Menu'; 
import HomeIcon from '@mui/icons-material/Home';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AppsIcon from '@mui/icons-material/Apps';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
function Header(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();

    //-------------------Responsive Menu------------------//
    const [anchorEl, setAnchorEl] = useState(null);
    const {width} = useWindowSize()
    const isMobileMode = width > 992
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    //-----------------Dark/Bright Mode--------------------//
    const [isDarkMode, setIsDarkMode] = useState(false)


    let route: string | boolean = location.pathname;
    route = route.substring(1);
    route = route.split('/')[1];

    const routes = ["home", "accounts", "transactions", "assets", "applications"];
    if (routes.indexOf(route) === -1) {
        route = false;
    }

    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>

            <div>
                <img src = {QLogo} width={200} style={{marginTop:5}} />
            </div>    
             
             <div style = {{display:'flex'}}>
                    <div style = {{marginRight : !isMobileMode ? 0 : 50, marginTop : 10}}>
                        <IconButton
                                onClick={()=>{setIsDarkMode(!isDarkMode)}}
                                size="small"
                                sx={{ ml: 2 }}
                                
                            >
                            {isDarkMode == true ? <WbSunnyOutlinedIcon/> : <Brightness2OutlinedIcon/>}
                        </IconButton>
                
                    </div>
                <div>
                    { isMobileMode ?
                        <Grid container>
                        <Tabs sx={{marginLeft: '-20px', borderBottom: '1px solid #f2f2f2'}} value={route} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" />}}>
                            <Tab label="Home" value="home" onClick={() => {
                                navigate('/explorer/home');
                            }}/>
                            <Tab label="Accounts" value="accounts" onClick={() => {
                                navigate('/explorer/accounts');
                            }}/>
                            <Tab label="Transactions" value="transactions" onClick={() => {
                                navigate('/explorer/transactions');
                            }}/>
                            <Tab label="Assets" value="assets" onClick={() => {
                                navigate('/explorer/assets');
                            }}/>
                            <Tab label="Applications" value="applications" onClick={() => {
                                navigate('/explorer/applications');
                            }}/>
                        </Tabs>
                        </Grid>:
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2, marginTop:1 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                        <MenuIcon />
                    </IconButton>
                    }
                </div>
            </div>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                    },
                    '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    },
                },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={()=>{
                     navigate('/explorer/home');
                     handleClose();
                }}
                style = {{width:200}}
                >
                   <HomeIcon style = {{marginRight : 10}}/> Home
                </MenuItem>
                <MenuItem onClick={()=>{
                     navigate('/explorer/accounts');
                     handleClose();
                }}
                style = {{width:200}}
                
                >
                 <SupervisorAccountIcon style = {{marginRight : 10}}/>   Accounts
                </MenuItem>
                <MenuItem onClick={()=>{
                     navigate('/explorer/transactions');
                     handleClose();
                }}
                style = {{width:200}}
                
                >
                 <ReceiptIcon style = {{marginRight : 10}}/>Transactions
                </MenuItem>
                <MenuItem onClick={()=>{
                     navigate('/explorer/assets');
                     handleClose();
                }}
                style = {{width:200}}
                
                >
                 <PaymentIcon style = {{marginRight : 10}}/> Assets
                </MenuItem>
                <MenuItem onClick={()=>{
                     navigate('/explorer/applications');
                     handleClose();
                }}
                style = {{width:200}}
                
                >
                 <AppsIcon style = {{marginRight : 10}}/>  Applications
                </MenuItem>
            </Menu>


        </div>
    </div>);
}

export default Header;
