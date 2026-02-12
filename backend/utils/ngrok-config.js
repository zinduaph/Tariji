import ngrok from 'ngrok';
import dotenv from 'dotenv';
dotenv.config();

let ngrokUrl = null;
let ngrokReady = false;

const startNgrok = async () => {
    try {
        if(!process.env.NGROK_AUTH_TOKEN){
            console.warn('NGROK_AUTH_TOKEN is not set in environment variables.');
            ngrokReady = true; 
            return null;
        }

        console.log('killing existing ngrok processes...')
        await ngrok.kill();

        const port = process.env.NGROK_URL || 3000;
        console.log(`starting ngrok on port ${port}...`);


        const url = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_AUTH_TOKEN,

                        onStatusChange: status => {
                console.log(`Ngrok status: ${status}`);
            },
        })

        ngrokUrl = url;
        ngrokReady = true;
        console.log(`ngrok started at ${ngrokUrl}`);
        return ngrokUrl;
    } catch (error) {
        console.error('Error starting ngrok:', error);
        ngrokReady = false;
    }
}
export const getNgrokUrl = () => ngrokUrl;
export const isNgrokReady = () => ngrokReady;