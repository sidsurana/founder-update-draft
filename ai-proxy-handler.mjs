import {createProxy} from './ai-proxy.mjs';
export function createHandler(options={}){return createProxy({...options,project:"sid-cos-actively-decisions-20261021",task:"cos.actively.founder-update.v1"});}
export default async function handler(req,res){return createHandler()(req,res);}
