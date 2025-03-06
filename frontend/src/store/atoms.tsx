import {atom} from 'jotai'
import Cookies from 'js-cookie';

export const user = atom<string | null>(null);
export const token = atom<string | null>(Cookies.get('token') || null);



 