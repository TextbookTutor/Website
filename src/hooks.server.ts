import { SvelteKitAuth } from '@auth/sveltekit';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from './lib/db';
import Google from '@auth/sveltekit/providers/google';
import { AUTH_SECRET } from '$env/static/private';


let handlerFunc = SvelteKitAuth({
    //@ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
    adapter: MongoDBAdapter(client),
    providers: [Google],
    secret: AUTH_SECRET,
    useSecureCookies: true,
    trustHost: true,
    debug:true,

});


export const handle = ({event, resolve}: any) => {
    event.url.protocol = "https:";

    const symbol = Object.getOwnPropertySymbols(event.request)[1];

    event.request[symbol].url.protocol = "https:";
    for (let i = 0; i < event.request[symbol].urlList.length; i++) {
        event.request[symbol].urlList[i].protocol = "https:";
    }

    return handlerFunc.handle({event, resolve});
};