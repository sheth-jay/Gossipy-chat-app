import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Avatar, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleClick }) => (
  <Box
    onClick={handleClick}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
      background: "#3882AC",
      color: "white",
    }}
    w="100%"
    d="flex"
    alignItems="center"
    color="black"
    px={3}
    py={2}
    mb={2}
    borderRadius="lg"
  >
    <Avatar
      mr={2}
      size="sm"
      cursor="pointer"
      name={user.name}
      src={user.pic}
    />
    <Box>
      <Text>{user.name}</Text>
      <Text fontSize="xs">
        <b>Email: </b>
        {user.email}
      </Text>
    </Box>
  </Box>
);

export default UserListItem;