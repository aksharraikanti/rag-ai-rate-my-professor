// app/api/chat/route.js

import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { Groq } from 'groq';

// Step 2: Define the system prompt
const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;

// Step 3: Create the POST function
export async function POST(req) {
    const data = await req.json();
    const userQuery = data[data.length - 1].content;

    // Step 4: Initialize Pinecone and Groq
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.index('rag');
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Query Pinecone for relevant professors based on user query
    const queryVector = [/* Some vector representing user query */]; // Create a vector based on the user query
    const queryResponse = await index.query({
        vector: queryVector,
        topK: 3, // Retrieve the top 3 professors
        includeMetadata: true,
        namespace: "ns1",
    });

    // Format Pinecone results to be used in the prompt
    let pineconeResults = '';
    queryResponse.matches.forEach(match => {
        pineconeResults += `
        Professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        `;
    });

    // Use Groq API to generate a response based on Pinecone results and system prompt
    const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery },
            { role: "assistant", content: pineconeResults }
        ],
    });

    // Extract the generated response from Groq
    const responseText = completion.choices[0].message.content;

    // Return response to the client
    return NextResponse.json({ message: responseText });
}
