import {createSessionProxy} from './ai-session-proxy.mjs';
export function createHandler(options={}){return createSessionProxy({...options,project:"sid-cos-actively-decisions-20261021"});}
export default async function handler(req,res){return createHandler()(req,res);}
