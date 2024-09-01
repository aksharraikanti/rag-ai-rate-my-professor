'use client';
import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';

export default function Home() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI assistant. How can I help you today?",
        },
    ]);
    const [message, setMessage] = useState('');

    const sendMessage = async () => {
        const newMessage = { role: 'user', content: message };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');

        const response = await fetch('../api/chat/route.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([...messages, newMessage]),
        });

        const result = await response.json();
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: result.message }]);
    };

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#f0f0f0"  // Optional: Set background color for the whole chat area
        >
            <Stack
                direction={'column'}
                width="500px"
                height="700px"
                border="1px solid black"
                borderRadius={8}
                p={2}
                spacing={3}
                bgcolor="white"  // Set background color for the chat box
            >
                <Stack
                    direction={'column'}
                    spacing={2}
                    flexGrow={1}
                    overflow="auto"
                    maxHeight="100%"
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={
                                message.role === 'assistant' ? 'flex-start' : 'flex-end'
                            }
                        >
                            <Box
                                bgcolor={
                                    message.role === 'assistant' ? '#e0f7fa' : '#007bff'  // Light blue for assistant, dark blue for user
                                }
                                color={message.role === 'assistant' ? 'black' : 'white'}  // Black text for assistant, white text for user
                                borderRadius={16}
                                p={2}
                                maxWidth="75%"
                            >
                                {message.content}
                            </Box>
                        </Box>
                    ))}
                </Stack>
                <Stack direction={'row'} spacing={2}>
                    <TextField
                        label="Message"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        variant="outlined"
                    />
                    <Button variant="contained" onClick={sendMessage}>
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
