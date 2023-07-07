"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const discord_oauth2_1 = __importDefault(require("discord-oauth2"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const oauth = new discord_oauth2_1.default({
    clientId: "1126890072508211251",
    clientSecret: "ZFvFb3Afmo0luNM2j1ebuMQn-_ImjHi_",
});
app.get('/auth/discord', (req, res) => {
    const redirectUrl = oauth.generateAuthUrl({
        scope: ['identify'],
        prompt: 'none',
        redirectUri: 'http://localhost:7777/auth/discord/callback',
    });
    res.redirect(redirectUrl);
});
app.get('/auth/discord/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        if (!code) {
            throw new Error('Authorization code not found');
        }
        const tokenResponse = yield axios_1.default.post('https://discord.com/api/v9/oauth2/token', new URLSearchParams({
            client_id: "1126890072508211251",
            client_secret: "ZFvFb3Afmo0luNM2j1ebuMQn-_ImjHi_",
            code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:7777/auth/discord/callback',
            scope: 'identify', // Replace with the required scope(s)
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const accessToken = tokenResponse.data.access_token;
        console.log(accessToken);
        //FfFvndpo8JZV7ti7mUg4FQGNcMJ8F9
        const refreshToken = tokenResponse.data.refresh_token;
        console.log(refreshToken);
        if (accessToken) {
            const userData = yield oauth.getUser(accessToken);
            // You can store the user data in your database or use it as needed
            res.json(userData);
        }
        else {
            throw new Error('Failed to obtain access token');
        }
    }
    catch (error) {
        console.error('Discord authentication error:', error);
        res.status(500).json({ error: 'Discord authentication failed' });
    }
}));
app.listen(7777, () => {
    console.log("http://localhost:7777");
});
