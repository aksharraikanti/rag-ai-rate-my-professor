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

        const response = await fetch('/api/chat', {
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
        <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Stack direction={'column'} width="500px" height="700px" border="1px solid black" p={2} spacing={3}>
                <Stack direction={'column'} spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
                    {messages.map((msg, index) => (
                        <Box key={index} display="flex" justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                            <Box bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'} color="white" borderRadius={16} p={3}>
                                {msg.content}
                            </Box>
                        </Box>
                    ))}
                </Stack>
                <Stack direction={'row'} spacing={2}>
                    <TextField label="Message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button variant="contained" onClick={sendMessage}>
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
