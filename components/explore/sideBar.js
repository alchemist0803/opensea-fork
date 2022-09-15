import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Apps,
  ContactMail,
  AssignmentInd,
  Home
} from "@material-ui/icons";

export default function SideBar() {
  return (
    <div className="w-[420px] h-full flex flex-col items-start pt-[70px] box-border ">
        <div className="w-full p-4 flex flex-row justify-start items-center border-b-[1px] border-[#e5e8eb]">
            <FontAwesomeIcon icon="fa-solid fa-circle-user" className="w-[23px] h-[23px]" />
            <p className="ml-2 text-[16px] font-semibold">My wallet</p>
        </div>
        <div className="w-full p-4">
            If you don't have a <a href="https://support.opensea.io/hc/en-us/articles/1500007978402-Wallets-supported-by-OpenSea" className="no-underline text-[#2081E2] font-semibold">wallet</a> yet, you can select a provider and create one now.
        </div>
        <div className="w-full p-4">
        <div className="flex flex-col border-[1px] border-[#e5e8eb] rounded-lg w-full">
            <div className="flex flex-row justify-between items-center p-4">
                <div className="flex flex-row justify-start items-center">
                    <img src="https://opensea.io/static/images/logos/metamask-fox.svg" className="w-[24px] h-[24px] mr-2"></img>
                    <div className="font-bold ">
                        MetaMask
                    </div>
                </div>
                <div className=" bg-[#2081E2] px-[8px] py-[2px] rounded-lg text-[#fff] font-normal">
                    Popular
                </div>
            </div>
            
        </div>
        </div>
        
    </div>
    // <Box className={classes.menuSliderContainer} component="div">
    //   <Avatar
    //     className={classes.avatar}
    //     src="https://i.ibb.co/rx5DFbs/avatar.png"
    //     alt="Juaneme8"
    //   />
    //   <Divider />
    //   <List>
    //     {listItems.map((listItem, index) => (
    //       <ListItem className={classes.listItem} button key={index}>
    //         <ListItemIcon className={classes.listItem}>
    //           {listItem.listIcon}
    //         </ListItemIcon>
    //         <ListItemText primary={listItem.listText} />
    //       </ListItem>
    //     ))}
    //   </List>
    // </Box>
  )
}

// const useStyles = makeStyles((theme) => ({
//     menuSliderContainer: {
//       width: 250,
//       background: "#511",
//       height: "100%",
//       zIndex: "30",
//     },
//     avatar: {
//       margin: "0.5rem auto",
//       padding: "1rem",
//       width: theme.spacing(13),
//       height: theme.spacing(13)
//     },
//     listItem: {
//       color: "tan"
//     }
//   }));
  
//   const listItems = [
//     {
//       listIcon: <Home />,
//       listText: "Home"
//     },
//     {
//       listIcon: <AssignmentInd />,
//       listText: "Resume"
//     },
//     {
//       listIcon: <Apps />,
//       listText: "Portfolio"
//     },
//     {
//       listIcon: <ContactMail />,
//       listText: "Contacts"
//     }
//   ];