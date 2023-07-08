import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react';

import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) history.push("/chats");
  }, [history]);

  return (
    <Container maxW='xl' centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          textAlign="center"
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
        >
          Gossipy
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        color="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
