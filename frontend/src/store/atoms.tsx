import {atom} from 'jotai'
import Cookie from 'js-cookie';


export const user = atom<string | null>(null);
export const token = atom<string | null>(Cookie.get('token') || null);






 