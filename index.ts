import express,{Express,Request,Response} from "express"
import axios from 'axios';
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()

import DiscordOauth2 from "discord-oauth2";

const app:Express=express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const oauth= new DiscordOauth2({
  clientId:process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET,

})

app.get('/auth/discord', (req: Request, res: Response) => {
    const redirectUrl = oauth.generateAuthUrl({
      scope: ['identify'],
      prompt: 'none',
      redirectUri: 'http://localhost:7777/auth/discord/callback',
    });
    res.redirect(redirectUrl);
  });


  

app.get('/auth/discord/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      throw new Error('Authorization code not found');
    }

    const tokenResponse = await axios.post(
      'https://discord.com/api/v9/oauth2/token',
      new URLSearchParams({
        client_id:process.env.CLIENT_ID as string,
        client_secret:process.env.CLIENT_SECRET as string,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:7777/auth/discord/callback', // Replace with your actual redirect URI
        scope: 'identify', // Replace with the required scope(s)
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log(accessToken)
    //FfFvndpo8JZV7ti7mUg4FQGNcMJ8F9
  
    const refreshToken = tokenResponse.data.refresh_token;
    console.log(refreshToken)

    if (accessToken) {
      const userData = await oauth.getUser(accessToken);
      // You can store the user data in your database or use it as needed
      res.cookie("id",userData.id,{
        expires:new Date(Date.now() + (10 * 60 * 1000)),
        httpOnly:false,
    })
      res.json(`Successs!!!===>${userData}`);
    } else {
      throw new Error('Failed to obtain access token');
    }
  } catch (error) {
    console.error('Discord authentication error:', error);
    res.status(500).json({ error: 'Discord authentication failed' });
  }
});


app.listen(process.env.PORT,()=>{
 console.log("http://localhost:7777")
})